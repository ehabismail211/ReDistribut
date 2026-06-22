export function siteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();

  const rawUrl = configuredUrl
    || (vercelProductionUrl ? `https://${vercelProductionUrl}` : "")
    || (vercelUrl ? `https://${vercelUrl}` : "")
    || "https://redistribut.com";

  return rawUrl.replace(/\/+$/, "");
}
