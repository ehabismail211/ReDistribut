import { createClient } from "@supabase/supabase-js";

type DatabaseClientOptions = {
  authorization?: string | null;
  serviceRole?: boolean;
};

export function supabaseClient(options: DatabaseClientOptions = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = options.serviceRole ? serviceRoleKey : anonKey;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: options.authorization ? { Authorization: options.authorization } : {},
    },
  });
}

export function bearerToken(request: Request) {
  return request.headers.get("authorization");
}

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return new Map<string, string>();

  return new Map(
    cookieHeader
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const separator = item.indexOf("=");
        if (separator === -1) return [item, ""];
        return [item.slice(0, separator), decodeURIComponent(item.slice(separator + 1))];
      }),
  );
}

function accessTokenFromSupabaseCookie(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed) && typeof parsed[0] === "string") return parsed[0];
    if (parsed && typeof parsed === "object") {
      const token = (parsed as { access_token?: unknown; currentSession?: { access_token?: unknown } }).access_token
        ?? (parsed as { currentSession?: { access_token?: unknown } }).currentSession?.access_token;
      if (typeof token === "string") return token;
    }
  } catch {
    return null;
  }

  return null;
}

export function authorizationFromRequest(request: Request) {
  const authorization = bearerToken(request);
  if (authorization) return authorization;

  const cookies = parseCookieHeader(request.headers.get("cookie"));
  const explicitToken = cookies.get("redist_access_token") ?? cookies.get("sb-access-token");
  if (explicitToken) return `Bearer ${explicitToken}`;

  for (const [name, value] of cookies) {
    if (!name.startsWith("sb-") || !name.endsWith("-auth-token")) continue;
    const token = accessTokenFromSupabaseCookie(value);
    if (token) return `Bearer ${token}`;
  }

  return null;
}

export async function requireUser(request: Request) {
  const authorization = authorizationFromRequest(request);
  if (!authorization) {
    throw new Error("Authentication is required.");
  }

  const supabase = supabaseClient({ authorization });
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Invalid or expired session.");
  }

  return { supabase, user: data.user, authorization };
}

export async function getOptionalUser(request: Request) {
  const authorization = authorizationFromRequest(request);
  if (!authorization) return null;

  const supabase = supabaseClient({ authorization });
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return { supabase, user: data.user, authorization };
}
