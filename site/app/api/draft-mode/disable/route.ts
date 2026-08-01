import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Exits draft mode and returns to the site. */
export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  const { searchParams } = new URL(request.url);
  // Only same-origin relative paths — an open redirect here would let a crafted
  // link bounce visitors off-site from a URL on our domain.
  const target = searchParams.get("redirect");
  const safe = target?.startsWith("/") && !target.startsWith("//") ? target : "/";

  redirect(safe);
}
