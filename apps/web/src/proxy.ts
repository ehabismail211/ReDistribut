import { NextResponse, type NextRequest } from "next/server";
import { requireRoutePermission, type Permission } from "./lib/permissions";
import { getOptionalUser } from "./lib/supabase";

const protectedRoutes: Array<{ pattern: RegExp; permission: Permission; label: string }> = [
  {
    pattern: /^\/app\/pilot-monitoring(?:\/)?$/,
    permission: "founder.route.access",
    label: "founder pilot monitoring route",
  },
  {
    pattern: /^\/api\/v1\/organizations\/[^/]+\/trust-score\/recalculate(?:\/)?$/,
    permission: "trust.recalculate",
    label: "trust recalculation API",
  },
  {
    pattern: /^\/api\/v1\/audit(?:\/)?$/,
    permission: "audit.read",
    label: "audit access API",
  },
  {
    pattern: /^\/api\/v1\/verifications\/[^/]+\/review(?:\/)?$/,
    permission: "verification.review",
    label: "verification review API",
  },
];

export async function proxy(request: NextRequest) {
  const route = protectedRoutes.find((item) => item.pattern.test(request.nextUrl.pathname));
  if (!route) return NextResponse.next();

  try {
    const session = await getOptionalUser(request);
    await requireRoutePermission({
      request,
      supabase: session?.supabase,
      user: session?.user,
      permission: route.permission,
    });
    return NextResponse.next();
  } catch {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: { message: "Permission denied.", details: { route: route.label, permission: route.permission } } },
        { status: 403 },
      );
    }

    return NextResponse.redirect(new URL(`/app?permission=denied&route=${encodeURIComponent(route.label)}`, request.url));
  }
}

export const config = {
  matcher: [
    "/app/pilot-monitoring",
    "/api/v1/audit",
    "/api/v1/verifications/:path*/review",
    "/api/v1/organizations/:path*/trust-score/recalculate",
  ],
};
