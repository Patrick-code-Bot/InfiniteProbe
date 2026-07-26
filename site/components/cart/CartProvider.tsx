"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type Cart,
  addCartLine,
  createCart,
  getCart,
  isShopifyConfigured,
  removeCartLine,
  updateCartLine,
} from "@/lib/shopify";

const CART_ID_KEY = "infiniteprobe:cartId";

interface CartContextValue {
  cart: Cart | null;
  isOpen: boolean;
  isBusy: boolean;
  configured: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (merchandiseId: string) => Promise<void>;
  setLineQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const configured = isShopifyConfigured();

  // Restore the persisted Shopify cart on first load.
  useEffect(() => {
    if (!configured) return;
    const cartId = window.localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;
    getCart(cartId)
      .then((existing) => {
        if (existing) setCart(existing);
        else window.localStorage.removeItem(CART_ID_KEY);
      })
      .catch(() => window.localStorage.removeItem(CART_ID_KEY));
  }, [configured]);

  const ensureCart = useCallback(async (): Promise<Cart> => {
    if (cart) return cart;
    const fresh = await createCart();
    window.localStorage.setItem(CART_ID_KEY, fresh.id);
    setCart(fresh);
    return fresh;
  }, [cart]);

  const addItem = useCallback(
    async (merchandiseId: string) => {
      if (!configured) {
        setIsOpen(true);
        return;
      }
      setIsBusy(true);
      try {
        const current = await ensureCart();
        const updated = await addCartLine(current.id, merchandiseId, 1);
        setCart(updated);
        setIsOpen(true);
      } finally {
        setIsBusy(false);
      }
    },
    [configured, ensureCart]
  );

  const setLineQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsBusy(true);
      try {
        const updated =
          quantity <= 0
            ? await removeCartLine(cart.id, lineId)
            : await updateCartLine(cart.id, lineId, quantity);
        setCart(updated);
      } finally {
        setIsBusy(false);
      }
    },
    [cart]
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsBusy(true);
      try {
        setCart(await removeCartLine(cart.id, lineId));
      } finally {
        setIsBusy(false);
      }
    },
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isBusy,
        configured,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        setLineQuantity,
        removeLine,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
