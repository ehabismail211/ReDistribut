import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const { createClient } = require("@supabase/supabase-js");

function unquoteEnvValue(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function loadEnvFile(path) {
  if (!existsSync(path)) return false;

  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = unquoteEnvValue(trimmed.slice(separator + 1));
    if (!key || process.env[key] != null) continue;
    process.env[key] = value;
  }

  return true;
}

[
  ".env.staging.local",
  ".env.staging",
  ".env.local",
].forEach(loadEnvFile);

const defaultPassword = process.env.STAGING_PILOT_PASSWORD || "ReDistPilot!2026";

const platformAccounts = [
  {
    key: "FOUNDER",
    label: "ReDist Founder",
    email: "founder@staging.redist.ae",
    phone: "+971500000001",
    city: "Dubai",
    role: "founder",
  },
  {
    key: "PLATFORM_ADMIN",
    label: "ReDist Platform Admin",
    email: "platform-admin@staging.redist.ae",
    phone: "+971500000002",
    city: "Dubai",
    role: "platform_admin",
  },
  {
    key: "REVIEWER",
    label: "ReDist Verification Reviewer",
    email: "reviewer@staging.redist.ae",
    phone: "+971500000003",
    city: "Dubai",
    role: "reviewer",
  },
  {
    key: "PILOT_COORDINATOR",
    label: "ReDist Pilot Coordinator",
    email: "pilot-coordinator@staging.redist.ae",
    phone: "+971500000004",
    city: "Dubai",
    role: "pilot_coordinator",
  },
];

const organizations = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    name: "Restaurant A",
    slug: "restaurant-a",
    description: "Controlled UAE pilot restaurant for prepared food and surplus inventory workflows.",
    city: "Dubai",
    admin: {
      key: "RESTAURANT_A_ADMIN",
      label: "Restaurant A Admin",
      email: "restaurant-a-admin@staging.redist.ae",
      phone: "+971501000001",
      city: "Dubai",
    },
    user: {
      key: "RESTAURANT_A_USER",
      label: "Restaurant A User",
      email: "restaurant-a-user@staging.redist.ae",
      phone: "+971501000002",
      city: "Dubai",
    },
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    name: "Restaurant B",
    slug: "restaurant-b",
    description: "Controlled UAE pilot restaurant for branch-level listing and request validation.",
    city: "Dubai",
    admin: {
      key: "RESTAURANT_B_ADMIN",
      label: "Restaurant B Admin",
      email: "restaurant-b-admin@staging.redist.ae",
      phone: "+971501000003",
      city: "Dubai",
    },
    user: {
      key: "RESTAURANT_B_USER",
      label: "Restaurant B User",
      email: "restaurant-b-user@staging.redist.ae",
      phone: "+971501000004",
      city: "Dubai",
    },
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    name: "Hotel A",
    slug: "hotel-a",
    description: "Controlled UAE pilot hotel for furniture, fixtures, and hospitality surplus workflows.",
    city: "Abu Dhabi",
    admin: {
      key: "HOTEL_A_ADMIN",
      label: "Hotel A Admin",
      email: "hotel-a-admin@staging.redist.ae",
      phone: "+971501000005",
      city: "Abu Dhabi",
    },
    user: {
      key: "HOTEL_A_USER",
      label: "Hotel A User",
      email: "hotel-a-user@staging.redist.ae",
      phone: "+971501000006",
      city: "Abu Dhabi",
    },
  },
  {
    id: "30000000-0000-4000-8000-000000000004",
    name: "Warehouse A",
    slug: "warehouse-a",
    description: "Controlled UAE pilot warehouse for pallets, packaging, and logistics material workflows.",
    city: "Dubai",
    admin: {
      key: "WAREHOUSE_A_ADMIN",
      label: "Warehouse A Admin",
      email: "warehouse-a-admin@staging.redist.ae",
      phone: "+971501000007",
      city: "Dubai",
    },
    user: {
      key: "WAREHOUSE_A_USER",
      label: "Warehouse A User",
      email: "warehouse-a-user@staging.redist.ae",
      phone: "+971501000008",
      city: "Dubai",
    },
  },
  {
    id: "30000000-0000-4000-8000-000000000005",
    name: "NGO A",
    slug: "ngo-a",
    description: "Controlled UAE pilot NGO for recipient request, transfer completion, and certificate validation.",
    city: "Sharjah",
    admin: {
      key: "NGO_A_ADMIN",
      label: "NGO A Admin",
      email: "ngo-a-admin@staging.redist.ae",
      phone: "+971501000009",
      city: "Sharjah",
    },
    user: {
      key: "NGO_A_USER",
      label: "NGO A User",
      email: "ngo-a-user@staging.redist.ae",
      phone: "+971501000010",
      city: "Sharjah",
    },
  },
];

function requiredEnv() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing staging environment values: ${missing.join(", ")}`);
  }
}

function passwordFor(accountKey) {
  return process.env[`STAGING_${accountKey}_PASSWORD`] || defaultPassword;
}

async function signInPilotUser(publicClient, account) {
  const { data, error } = await publicClient.auth.signInWithPassword({
    email: account.email,
    password: passwordFor(account.key),
  });
  if (error || !data.user) {
    throw new Error(`${account.email}: ${error?.message ?? "sign-in did not return a user"}`);
  }

  await publicClient.auth.signOut();
  return data.user;
}

async function upsertAuthUser(adminClient, publicClient, account, appRoles = []) {
  const userMetadata = { display_name: account.label };
  const appMetadata = appRoles.length > 0
    ? { redist_platform_roles: appRoles }
    : undefined;

  const { data, error } = await adminClient.auth.admin.createUser({
    email: account.email,
    password: passwordFor(account.key),
    email_confirm: true,
    user_metadata: userMetadata,
    app_metadata: appMetadata,
  });
  if (!error) return data.user;

  if (!/already.*registered/i.test(error.message)) {
    throw error;
  }

  const existingUser = await signInPilotUser(publicClient, account);
  const { data: updated, error: updateError } = await adminClient.auth.admin.updateUserById(existingUser.id, {
    password: passwordFor(account.key),
    email_confirm: true,
    user_metadata: userMetadata,
    app_metadata: appMetadata,
  });
  if (updateError) throw updateError;
  return updated.user;
}

function assertNoError(label, error) {
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }
}

requiredEnv();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
const publicSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const userByEmail = new Map();

for (const account of platformAccounts) {
  const user = await upsertAuthUser(supabase, publicSupabase, account, [account.role]);
  userByEmail.set(account.email, user);
}

for (const organization of organizations) {
  const admin = await upsertAuthUser(supabase, publicSupabase, organization.admin);
  const member = await upsertAuthUser(supabase, publicSupabase, organization.user);
  userByEmail.set(organization.admin.email, admin);
  userByEmail.set(organization.user.email, member);
}

const allAccounts = [
  ...platformAccounts,
  ...organizations.flatMap((organization) => [organization.admin, organization.user]),
];

const profileRows = allAccounts.map((account) => ({
  id: userByEmail.get(account.email).id,
  display_name: account.label,
  phone: account.phone,
  country_code: "AE",
  city: account.city,
}));

assertNoError(
  "profiles upsert",
  (await supabase.from("profiles").upsert(profileRows, { onConflict: "id" })).error,
);

const founderId = userByEmail.get(platformAccounts[0].email).id;
const platformRows = platformAccounts.map((account) => ({
  user_id: userByEmail.get(account.email).id,
  role: account.role,
  assigned_by: founderId,
  revoked_at: null,
}));

assertNoError(
  "pilot platform role cleanup",
  (await supabase
    .from("user_platform_roles")
    .delete()
    .in("role", platformAccounts.map((account) => account.role))).error,
);

assertNoError(
  "pilot platform role insert",
  (await supabase.from("user_platform_roles").insert(platformRows)).error,
);

for (const account of platformAccounts) {
  const user = userByEmail.get(account.email);
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { redist_platform_roles: [account.role] },
  });
  assertNoError(`${account.email} claim synchronization`, error);
}

const organizationRows = organizations.map((organization) => ({
  id: organization.id,
  name: organization.name,
  slug: organization.slug,
  description: organization.description,
  country_code: "AE",
  city: organization.city,
  created_by: userByEmail.get(organization.admin.email).id,
}));

assertNoError(
  "pilot organizations upsert",
  (await supabase.from("organizations").upsert(organizationRows, { onConflict: "id" })).error,
);

assertNoError(
  "pilot organization membership cleanup",
  (await supabase
    .from("organization_members")
    .delete()
    .in("organization_id", organizations.map((organization) => organization.id))).error,
);

const membershipRows = organizations.flatMap((organization) => [
  {
    organization_id: organization.id,
    user_id: userByEmail.get(organization.admin.email).id,
    role: "organization_admin",
  },
  {
    organization_id: organization.id,
    user_id: userByEmail.get(organization.user.email).id,
    role: "organization_user",
  },
]);

assertNoError(
  "pilot organization membership insert",
  (await supabase.from("organization_members").insert(membershipRows)).error,
);

assertNoError(
  "pilot provisioning audit",
  (await supabase.from("audit_events").insert({
    actor_id: founderId,
    event_type: "staging_pilot.auth_provisioned",
    entity_type: "pilot_seed",
    entity_id: null,
    details: {
      organizations: organizations.map((organization) => organization.name),
      accounts: allAccounts.map((account) => account.email),
      provider: "supabase_auth_admin",
    },
  })).error,
);

console.log(JSON.stringify({
  provisionedAt: new Date().toISOString(),
  accounts: allAccounts.length,
  organizations: organizations.length,
  platformRoles: platformRows.length,
  memberships: membershipRows.length,
}, null, 2));
