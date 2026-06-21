import { pathToFileURL } from "node:url";

const scenarios = [
  {
    id: "restaurant",
    name: "Restaurant scenario",
    organization: {
      type: "Restaurant",
      country: "UAE",
      location: "Dubai Marina",
      verificationRequired: ["trade_license", "food_permit", "authorized_signatory", "registered_address"],
      roles: ["owner_admin", "inventory_manager", "requester"],
    },
    listing: {
      title: "Prepared chicken meals",
      quantity: 120,
      unit: "meals",
      category: "food and beverage",
      reason: "near_expiry",
      offerType: "free",
      handoverMethod: "pickup",
    },
    requests: [
      { requester: "NGO", quantity: 80, decision: "accept", handover: "same-day pickup" },
      { requester: "School", quantity: 40, decision: "accept", handover: "next morning pickup" },
      { requester: "Retail requester", quantity: 150, decision: "prevent", reason: "exceeds availability" },
    ],
    expected: {
      completedQuantity: 120,
      completedRequests: 2,
      remainingQuantity: 0,
      preventedRequests: 1,
      requiredAuditEvents: ["request.accepted", "handover.completed"],
    },
  },
  {
    id: "hotel",
    name: "Hotel scenario",
    organization: {
      type: "Hotel",
      country: "UAE",
      location: "Abu Dhabi",
      verificationRequired: ["trade_license", "authorized_contact", "registered_address"],
      roles: ["owner_admin", "housekeeping_inventory_manager"],
    },
    listing: {
      title: "Gently used banquet chairs",
      quantity: 60,
      unit: "chairs",
      category: "furniture and fixtures",
      reason: "renovation_surplus",
      offerType: "exchange",
      handoverMethod: "requester delivery or pickup",
    },
    requests: [
      { requester: "School", quantity: 20, decision: "accept", handover: "school collection" },
      { requester: "Event supplier", quantity: 40, decision: "accept", handover: "shelving exchange and pickup" },
    ],
    expected: {
      completedQuantity: 60,
      completedRequests: 2,
      remainingQuantity: 0,
      preventedRequests: 0,
      requiredAuditEvents: ["request.accepted", "handover.completed"],
    },
  },
  {
    id: "warehouse",
    name: "Warehouse scenario",
    organization: {
      type: "Warehouse/logistics operator",
      country: "UAE",
      location: "Jebel Ali",
      verificationRequired: ["trade_license", "storage_permit", "authorized_contact", "registered_address"],
      roles: ["owner_admin", "warehouse_manager"],
    },
    listing: {
      title: "Reusable plastic pallets",
      quantity: 1200,
      unit: "pallets",
      category: "warehouse materials",
      reason: "excess",
      offerType: "sale",
      unitPrice: 12,
      currency: "AED",
      handoverMethod: "requester delivery",
    },
    requests: [
      { requester: "Manufacturer", quantity: 500, decision: "accept", handover: "truck collection window" },
      { requester: "Packaging supplier", quantity: 700, decision: "accept", handover: "loading dock collection" },
      { requester: "Retail business", quantity: 100, decision: "prevent", reason: "no quantity remains" },
    ],
    expected: {
      completedQuantity: 1200,
      completedRequests: 2,
      remainingQuantity: 0,
      preventedRequests: 1,
      requiredAuditEvents: ["request.accepted", "handover.completed"],
    },
  },
  {
    id: "ngo",
    name: "NGO scenario",
    organization: {
      type: "NGO/charity",
      country: "UAE",
      location: "Dubai",
      verificationRequired: ["ngo_license", "authorized_signatory", "registered_address"],
      roles: ["owner_admin", "program_coordinator", "requester"],
    },
    listing: {
      title: "Hygiene kits",
      quantity: 500,
      unit: "kits",
      category: "community supplies",
      reason: "excess",
      offerType: "free",
      handoverMethod: "pickup or delivery by owner",
    },
    requests: [
      { requester: "School", quantity: 200, decision: "accept", handover: "owner delivery" },
      { requester: "Community organization", quantity: 300, decision: "accept", handover: "community pickup" },
      { requester: "Retail company", quantity: 100, decision: "decline", reason: "beneficiary fit lower and stock allocated" },
    ],
    expected: {
      completedQuantity: 500,
      completedRequests: 2,
      remainingQuantity: 0,
      preventedRequests: 0,
      declinedRequests: 1,
      requiredAuditEvents: ["request.accepted", "request.declined", "handover.completed"],
    },
  },
];

function audit(events, type, detail) {
  events.push({ type, detail });
}

export function runScenario(scenario) {
  const auditEvents = [];
  const requests = [];
  const reservations = [];
  const transactions = [];
  const handoverRecords = [];
  const evidenceControls = [];
  let available = scenario.listing.quantity;
  let completedQuantity = 0;
  let sequence = 1;

  audit(auditEvents, "organization.setup", `${scenario.organization.type} created in ${scenario.organization.location}.`);
  audit(auditEvents, "verification.required", scenario.organization.verificationRequired.join(","));
  audit(auditEvents, "listing.published", `${scenario.listing.title}: ${scenario.listing.quantity} ${scenario.listing.unit}.`);

  for (const request of scenario.requests) {
    const record = {
      requester: request.requester,
      quantity: request.quantity,
      requested: true,
      status: "pending",
      reason: request.reason ?? null,
      handover: request.handover ?? null,
    };

    audit(auditEvents, "request.created", `${request.requester} requested ${request.quantity} ${scenario.listing.unit}.`);

    if (request.decision === "decline") {
      record.status = "declined";
      audit(auditEvents, "request.declined", `${request.requester}: ${record.reason}.`);
      requests.push(record);
      continue;
    }

    if (request.decision === "prevent" || request.quantity > available) {
      record.status = "prevented";
      record.reason = request.reason ?? "insufficient availability";
      audit(auditEvents, "request.prevented", `${request.requester}: ${record.reason}.`);
      requests.push(record);
      continue;
    }

    available -= request.quantity;
    record.status = "accepted";
    const reservation = {
      id: `res-${scenario.id}-${sequence}`,
      listingRequestId: `req-${scenario.id}-${sequence}`,
      status: "active",
      quantity: request.quantity,
      unit: scenario.listing.unit,
      expiresInDays: 7,
    };
    reservations.push(reservation);
    audit(auditEvents, "request.accepted", `${request.requester}: ${request.quantity} ${scenario.listing.unit} reserved.`);
    audit(auditEvents, "reservation.created", `${request.requester}: reservation ${reservation.id}.`);

    record.status = "completed";
    completedQuantity += request.quantity;
    reservation.status = "converted";

    const transaction = {
      id: `txn-${scenario.id}-${sequence}`,
      reservationId: reservation.id,
      listingRequestId: reservation.listingRequestId,
      transactionNumber: `RTX-UAE-2026-${String(sequence).padStart(6, "0")}`,
      status: "completed",
      sender: scenario.organization.type,
      receiver: request.requester,
      resourceName: scenario.listing.title,
      quantity: request.quantity,
      unit: scenario.listing.unit,
      location: scenario.organization.location,
      handoverMethod: request.handover,
    };
    transactions.push(transaction);

    const handoverRecord = {
      id: `handover-${scenario.id}-${sequence}`,
      transactionId: transaction.id,
      status: "completed",
      evidenceRequired: true,
      pilotManualControl: true,
      method: request.handover,
      location: scenario.organization.location,
    };
    handoverRecords.push(handoverRecord);

    evidenceControls.push({
      handoverRecordId: handoverRecord.id,
      privateEvidenceRequired: true,
      accessAuditRequired: true,
      manualPilotControl: true,
    });

    audit(auditEvents, "redistribution_transaction.completed", `${transaction.transactionNumber}: ${request.requester}.`);
    audit(auditEvents, "handover.completed", `${request.requester}: ${request.handover}.`);
    requests.push(record);
    sequence += 1;
  }

  const completedRequests = requests.filter((request) => request.status === "completed").length;
  const preventedRequests = requests.filter((request) => request.status === "prevented").length;
  const declinedRequests = requests.filter((request) => request.status === "declined").length;
  const listingStatus = available === 0 ? "completed" : "partially_available";

  const checks = [
    {
      name: "remaining quantity",
      pass: available === scenario.expected.remainingQuantity,
      expected: scenario.expected.remainingQuantity,
      actual: available,
    },
    {
      name: "completed quantity",
      pass: completedQuantity === scenario.expected.completedQuantity,
      expected: scenario.expected.completedQuantity,
      actual: completedQuantity,
    },
    {
      name: "completed requests",
      pass: completedRequests === scenario.expected.completedRequests,
      expected: scenario.expected.completedRequests,
      actual: completedRequests,
    },
    {
      name: "prevented requests",
      pass: preventedRequests === scenario.expected.preventedRequests,
      expected: scenario.expected.preventedRequests,
      actual: preventedRequests,
    },
    {
      name: "declined requests",
      pass: declinedRequests === (scenario.expected.declinedRequests ?? 0),
      expected: scenario.expected.declinedRequests ?? 0,
      actual: declinedRequests,
    },
    ...scenario.expected.requiredAuditEvents.map((eventType) => ({
      name: `audit event ${eventType}`,
      pass: auditEvents.some((event) => event.type === eventType),
      expected: true,
      actual: auditEvents.some((event) => event.type === eventType),
    })),
    {
      name: "converted reservations",
      pass: reservations.filter((reservation) => reservation.status === "converted").length === completedRequests,
      expected: completedRequests,
      actual: reservations.filter((reservation) => reservation.status === "converted").length,
    },
    {
      name: "completed transactions",
      pass: transactions.length === completedRequests && transactions.every((transaction) => transaction.status === "completed"),
      expected: completedRequests,
      actual: transactions.length,
    },
    {
      name: "handover records",
      pass: handoverRecords.length === completedRequests && handoverRecords.every((handover) => handover.evidenceRequired),
      expected: completedRequests,
      actual: handoverRecords.length,
    },
    {
      name: "private evidence controls",
      pass: evidenceControls.length === completedRequests && evidenceControls.every((control) => control.privateEvidenceRequired && control.accessAuditRequired),
      expected: completedRequests,
      actual: evidenceControls.length,
    },
  ];

  return {
    id: scenario.id,
    name: scenario.name,
    organization: scenario.organization,
    listing: {
      ...scenario.listing,
      status: listingStatus,
      availableQuantity: available,
      completedQuantity,
    },
    requests,
    reservations,
    transactions,
    handoverRecords,
    evidenceControls,
    auditEvents,
    checks,
    passed: checks.every((check) => check.pass),
  };
}

export function runAllScenarios() {
  const results = scenarios.map(runScenario);
  return {
    generatedAt: new Date().toISOString(),
    total: results.length,
    passed: results.filter((result) => result.passed).length,
    failed: results.filter((result) => !result.passed).length,
    results,
  };
}

export { scenarios };

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const output = runAllScenarios();
  console.log(JSON.stringify(output, null, 2));
  process.exitCode = output.failed === 0 ? 0 : 1;
}
