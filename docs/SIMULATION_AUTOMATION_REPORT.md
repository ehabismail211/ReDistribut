# ReDist Simulation Automation Report

## Purpose

This report documents the automated simulation runner created for ReDist pilot workflow validation. The runner gives future sprints a deterministic way to validate core redistribution flows before UI, database, or API changes are promoted.

This work is automation-focused only. It does not introduce product UI changes, database migrations, or feature pages.

## Implemented Files

- `scripts/simulation-runner.mjs`
- `scripts/simulation-runner.test.mjs`
- `package.json`
- `docs/SIMULATION_AUTOMATION_REPORT.md`

## Implemented Scenarios

### 1. Restaurant Scenario

Organization setup:
- UAE restaurant in Dubai Marina.
- Requires trade license, food permit, authorized signatory, and registered address verification inputs.
- Uses owner, inventory manager, and requester roles.

Workflow:
- Publishes 120 prepared chicken meals.
- NGO requests 80 meals and completes pickup.
- School requests 40 meals and completes pickup.
- Retail requester attempts to request 150 meals and is prevented because availability is exhausted.

Expected output:
- Completed quantity: `120`
- Remaining quantity: `0`
- Completed requests: `2`
- Prevented requests: `1`
- Required audit events: `request.accepted`, `handover.completed`
- Scenario result: `passed: true`

### 2. Hotel Scenario

Organization setup:
- UAE hotel in Abu Dhabi.
- Requires trade license, authorized contact, and registered address verification inputs.
- Uses owner and housekeeping inventory roles.

Workflow:
- Publishes 60 gently used banquet chairs.
- School requests 20 chairs and completes collection.
- Event supplier requests 40 chairs and completes exchange/pickup.

Expected output:
- Completed quantity: `60`
- Remaining quantity: `0`
- Completed requests: `2`
- Prevented requests: `0`
- Required audit events: `request.accepted`, `handover.completed`
- Scenario result: `passed: true`

### 3. Warehouse Scenario

Organization setup:
- UAE warehouse/logistics operator in Jebel Ali.
- Requires trade license, storage permit, authorized contact, and registered address verification inputs.
- Uses owner and warehouse manager roles.

Workflow:
- Publishes 1,200 reusable plastic pallets.
- Manufacturer requests 500 pallets and completes collection.
- Packaging supplier requests 700 pallets and completes collection.
- Retail business attempts to request 100 pallets and is prevented because no quantity remains.

Expected output:
- Completed quantity: `1200`
- Remaining quantity: `0`
- Completed requests: `2`
- Prevented requests: `1`
- Required audit events: `request.accepted`, `handover.completed`
- Scenario result: `passed: true`

### 4. NGO Scenario

Organization setup:
- UAE NGO in Dubai.
- Requires NGO license, authorized signatory, and registered address verification inputs.
- Uses owner, program coordinator, and requester roles.

Workflow:
- Publishes 500 hygiene kits.
- School requests 200 kits and completes delivery.
- Community organization requests 300 kits and completes pickup.
- Retail company requests 100 kits and is declined because beneficiary fit is lower and stock is already allocated.

Expected output:
- Completed quantity: `500`
- Remaining quantity: `0`
- Completed requests: `2`
- Declined requests: `1`
- Prevented requests: `0`
- Required audit events: `request.accepted`, `request.declined`, `handover.completed`
- Scenario result: `passed: true`

## Execution Method

Run the simulation runner directly:

```bash
node scripts/simulation-runner.mjs
```

Run the automated validation suite:

```bash
./.tools/pnpm test
```

The project test command now executes all Node test files under `scripts/*.test.mjs`, including:

- Sprint 2 verification foundation checks.
- Simulation automation checks.

## Output Contract

The direct runner prints JSON with this top-level shape:

```json
{
  "generatedAt": "ISO-8601 timestamp",
  "total": 4,
  "passed": 4,
  "failed": 0,
  "results": []
}
```

Each result includes:

- `id`
- `name`
- `organization`
- `listing`
- `requests`
- `auditEvents`
- `checks`
- `passed`

Each check includes:

- `name`
- `pass`
- `expected`
- `actual`

The CLI exits with:

- `0` when all scenarios pass.
- `1` when one or more scenarios fail.

## Automated Test Coverage

The simulation test suite validates:

- Required scenario coverage: restaurant, hotel, warehouse, NGO.
- All scenarios pass expected workflow checks.
- Restaurant and warehouse prevent over-allocation.
- NGO decline flow does not reduce completed impact.
- Completed scenarios emit required audit events.
- Listing availability never becomes negative.

## Future Sprint Usage

Future backend and workflow sprints should use this runner as a regression harness when implementing:

- Real organization setup APIs.
- Listing publication and reservation logic.
- Request acceptance, decline, and prevention logic.
- Handover records.
- Completion records.
- Audit logs.
- Impact calculations.

As real APIs become available, this runner can be extended from deterministic in-memory workflow simulation into API-backed integration checks while preserving the same scenario expectations.

## Validation Results

Validation completed successfully on 2026-06-19.

Commands executed:

```bash
node scripts/simulation-runner.mjs
./.tools/pnpm test
./.tools/pnpm typecheck
./.tools/pnpm build
```

Results:

- Simulation runner: `4` total, `4` passed, `0` failed.
- Test suite: `9` tests passed, `0` failed.
- Typecheck: passed.
- Build: passed.
