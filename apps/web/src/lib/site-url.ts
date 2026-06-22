export function siteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  const rawUrl = configuredUrl || "https://www.redistribut.com";

  return rawUrl.replace(/\/+$/, "");
}
