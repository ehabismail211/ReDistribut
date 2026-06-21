import type { SupabaseClient } from "@supabase/supabase-js";
import type { ImpactHistorySearchInput, ImpactMetricSnapshot } from "@redist/shared";

type Client = SupabaseClient;

export type ImpactListing = {
  id: string;
  title: string;
  category: string;
  city: string;
  quantityAvailable?: number;
  unit: string;
  unitPrice?: number | null;
  status: string;
};

export type ImpactRequest = {
  id: string;
  listingId: string;
  quantity: number;
  status: string;
};

export type ImpactCalculationInput = {
  listings: ImpactListing[];
  requests: ImpactRequest[];
};

export type ImpactBreakdown = {
  label: string;
  value: number;
  aed_recovered: number;
  completed_transactions: number;
};

export type ImpactMetrics = {
  aed_recovered: number;
  resources_redistributed: number;
  waste_prevented_kg: number;
  co2_saved_kg: number;
  completed_transactions: number;
  active_listings: number;
  active_requests: number;
  top_categories: ImpactBreakdown[];
  top_locations: ImpactBreakdown[];
};

type ImpactFactor = {
  valueAed: number;
  wasteKg: number;
  co2Kg: number;
};

const impactFactors: Record<string, ImpactFactor> = {
  meals: { valueAed: 18, wasteKg: 0.45, co2Kg: 1.9 },
  meal: { valueAed: 18, wasteKg: 0.45, co2Kg: 1.9 },
  chairs: { valueAed: 45, wasteKg: 7, co2Kg: 18 },
  chair: { valueAed: 45, wasteKg: 7, co2Kg: 18 },
  pallets: { valueAed: 12, wasteKg: 9, co2Kg: 12 },
  pallet: { valueAed: 12, wasteKg: 9, co2Kg: 12 },
  kits: { valueAed: 22, wasteKg: 0.8, co2Kg: 2.4 },
  kit: { valueAed: 22, wasteKg: 0.8, co2Kg: 2.4 },
};

const defaultImpactFactor: ImpactFactor = { valueAed: 12, wasteKg: 1, co2Kg: 2 };

function roundMetric(value: number) {
  return Math.round(value * 100) / 100;
}

function factorForUnit(unit: string) {
  return impactFactors[unit.trim().toLowerCase()] ?? defaultImpactFactor;
}

function addBreakdown(
  breakdown: Map<string, ImpactBreakdown>,
  label: string,
  quantity: number,
  aedRecovered: number,
) {
  const current = breakdown.get(label) ?? {
    label,
    value: 0,
    aed_recovered: 0,
    completed_transactions: 0,
  };

  current.value += quantity;
  current.aed_recovered += aedRecovered;
  current.completed_transactions += 1;
  breakdown.set(label, current);
}

function sortedBreakdown(breakdown: Map<string, ImpactBreakdown>) {
  return [...breakdown.values()]
    .map((item) => ({
      ...item,
      value: roundMetric(item.value),
      aed_recovered: roundMetric(item.aed_recovered),
    }))
    .sort((a, b) => b.value - a.value || b.aed_recovered - a.aed_recovered)
    .slice(0, 5);
}

export function calculateImpactMetrics(input: ImpactCalculationInput): ImpactMetrics {
  const listingsById = new Map(input.listings.map((listing) => [listing.id, listing]));
  const categories = new Map<string, ImpactBreakdown>();
  const locations = new Map<string, ImpactBreakdown>();
  let aedRecovered = 0;
  let resourcesRedistributed = 0;
  let wastePreventedKg = 0;
  let co2SavedKg = 0;
  let completedTransactions = 0;

  for (const request of input.requests) {
    if (request.status !== "completed") continue;

    const listing = listingsById.get(request.listingId);
    if (!listing) continue;

    const factor = factorForUnit(listing.unit);
    const requestValue = request.quantity * (listing.unitPrice ?? factor.valueAed);

    aedRecovered += requestValue;
    resourcesRedistributed += request.quantity;
    wastePreventedKg += request.quantity * factor.wasteKg;
    co2SavedKg += request.quantity * factor.co2Kg;
    completedTransactions += 1;

    addBreakdown(categories, listing.category, request.quantity, requestValue);
    addBreakdown(locations, listing.city, request.quantity, requestValue);
  }

  return {
    aed_recovered: roundMetric(aedRecovered),
    resources_redistributed: roundMetric(resourcesRedistributed),
    waste_prevented_kg: roundMetric(wastePreventedKg),
    co2_saved_kg: roundMetric(co2SavedKg),
    completed_transactions: completedTransactions,
    active_listings: input.listings.filter((listing) => listing.status === "published" || listing.status === "reserved").length,
    active_requests: input.requests.filter((request) => request.status === "pending" || request.status === "accepted").length,
    top_categories: sortedBreakdown(categories),
    top_locations: sortedBreakdown(locations),
  };
}

export async function listImpactHistory(supabase: Client, filters: ImpactHistorySearchInput) {
  let query = supabase
    .from("impact_metric_history")
    .select("*")
    .order("calculated_at", { ascending: false })
    .range(filters.offset, filters.offset + filters.limit - 1);

  if (filters.scope) query = query.eq("scope", filters.scope);
  if (filters.organization_id) query = query.eq("organization_id", filters.organization_id);
  if (filters.user_id) query = query.eq("user_id", filters.user_id);
  if (filters.country_code) query = query.eq("country_code", filters.country_code);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function recordImpactSnapshot(
  supabase: Client,
  snapshot: ImpactMetricSnapshot,
  source: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("record_impact_metric_snapshot", {
    target_scope: snapshot.scope,
    target_user_id: snapshot.user_id ?? null,
    target_organization_id: snapshot.organization_id ?? null,
    target_country_code: snapshot.country_code ?? null,
    target_period_start: snapshot.period_start,
    target_period_end: snapshot.period_end,
    target_aed_recovered: snapshot.aed_recovered,
    target_resources_redistributed: snapshot.resources_redistributed,
    target_waste_prevented_kg: snapshot.waste_prevented_kg,
    target_co2_saved_kg: snapshot.co2_saved_kg,
    target_completed_transactions: snapshot.completed_transactions,
    target_active_listings: snapshot.active_listings,
    target_active_requests: snapshot.active_requests,
    target_top_categories: snapshot.top_categories,
    target_top_locations: snapshot.top_locations,
    target_source: source,
  });

  if (error) throw error;
  return data;
}
