/**
 * Shopify Storefront API client (cart + checkout).
 *
 * Runs entirely in the browser with the public Storefront access token —
 * prices and products live in Shopify admin, so changing a price there is
 * reflected on the site with zero deploys.
 *
 * Required env vars (see .env.example / LAUNCH_CHECKLIST.md):
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN            e.g. "your-store.myshopify.com"
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN public Storefront API token
 */

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2025-01";

export function isShopifyConfigured(): boolean {
  return Boolean(
    STORE_DOMAIN &&
      STOREFRONT_TOKEN &&
      !STORE_DOMAIN.startsWith("[") &&
      !STOREFRONT_TOKEN.startsWith("[")
  );
}

async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error(
      "Shopify is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN."
    );
  }
  const res = await fetch(
    `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: HTTP ${res.status}`);
  }
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`Shopify Storefront API error: ${json.errors[0].message}`);
  }
  return json.data as T;
}

/* ---------- Types ---------- */

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  variantId: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  title: string;
  price: { amount: string; currencyCode: string };
  imageUrl: string | null;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: { amount: string; currencyCode: string };
  lines: CartLine[];
}

/* ---------- Fragments / mapping ---------- */

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              product {
                title
                featuredImage {
                  url
                }
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: { amount: string; currencyCode: string } };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          product: {
            title: string;
            featuredImage: { url: string } | null;
          };
          price: { amount: string; currencyCode: string };
        };
      };
    }[];
  };
}

function mapCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: raw.cost.subtotalAmount,
    lines: raw.lines.edges.map(({ node }) => ({
      id: node.id,
      quantity: node.quantity,
      merchandiseId: node.merchandise.id,
      title: node.merchandise.product.title,
      price: node.merchandise.price,
      imageUrl: node.merchandise.product.featuredImage?.url ?? null,
    })),
  };
}

export function formatPrice(amount: string, currencyCode: string): string {
  const value = parseFloat(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

/* ---------- Products ---------- */

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const data = await storefront<{
    product: {
      id: string;
      handle: string;
      title: string;
      description: string;
      featuredImage: { url: string; altText: string | null } | null;
      variants: {
        edges: {
          node: {
            id: string;
            availableForSale: boolean;
            price: { amount: string; currencyCode: string };
          };
        }[];
      };
    } | null;
  }>(
    /* GraphQL */ `
      query ProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          handle
          title
          description
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `,
    { handle }
  );
  const p = data.product;
  const variant = p?.variants.edges[0]?.node;
  if (!p || !variant) return null;
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    featuredImage: p.featuredImage,
    variantId: variant.id,
    price: variant.price,
    availableForSale: variant.availableForSale,
  };
}

/* ---------- Cart ---------- */

export async function createCart(): Promise<Cart> {
  const data = await storefront<{ cartCreate: { cart: RawCart } }>(
    /* GraphQL */ `
      mutation CartCreate {
        cartCreate {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `
  );
  return mapCart(data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefront<{ cart: RawCart | null }>(
    /* GraphQL */ `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFields
        }
      }
      ${CART_FRAGMENT}
    `,
    { cartId }
  );
  return data.cart ? mapCart(data.cart) : null;
}

export async function addCartLine(
  cartId: string,
  merchandiseId: string,
  quantity = 1
): Promise<Cart> {
  const data = await storefront<{ cartLinesAdd: { cart: RawCart } }>(
    /* GraphQL */ `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    { cartId, lines: [{ merchandiseId, quantity }] }
  );
  return mapCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const data = await storefront<{ cartLinesUpdate: { cart: RawCart } }>(
    /* GraphQL */ `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return mapCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<Cart> {
  const data = await storefront<{ cartLinesRemove: { cart: RawCart } }>(
    /* GraphQL */ `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFields
          }
        }
      }
      ${CART_FRAGMENT}
    `,
    { cartId, lineIds: [lineId] }
  );
  return mapCart(data.cartLinesRemove.cart);
}
