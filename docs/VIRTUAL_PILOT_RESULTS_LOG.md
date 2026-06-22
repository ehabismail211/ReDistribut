# ReDist Virtual Pilot Results Log

Date: 2026-06-22  
Status: Simulated results log  
Evidence level: Virtual rehearsal only. Outcomes below are simulated assumptions, not real pilot evidence.

## Results Boundary

This log records expected and simulated outcomes from virtual Pilot Wave 1 scenarios. It must not be used as proof of live usage, customer traction, real transfer completion, or audited impact.

## Result Definitions

| Outcome | Meaning |
| --- | --- |
| Simulated pass | Workflow is expected to complete under current product assumptions |
| Simulated pass with caution | Workflow can proceed, but founder must watch a known risk |
| Simulated conditional | Workflow needs clearer process guidance before real pilot |
| Simulated fail | Workflow should not be attempted live until fixed or gated |

## Scenario Results

| Scenario | Outcome | Issues Found | Severity | Recommendation |
| --- | --- | --- | --- | --- |
| VP-01 Urgent sealed meal packs | Simulated conditional | Food-adjacent workflow may be interpreted as safety-approved if certificate language is not handled carefully | High | Use only after compliance review or switch first real pilot to non-food category |
| VP-02 Pantry cartons partial request | Simulated pass | Partial quantity must remain obvious in certificate and impact summary | Medium | Founder should confirm completed quantity before certificate review |
| VP-03 Reusable service trays | Simulated pass with caution | Requester may ask to modify quantity after submission | Medium | Capture as support/process guidance; avoid feature change unless real users fail |
| VP-04 Banquet chairs | Simulated pass | Condition expectations may differ between supplier and recipient | Medium | Require clear condition notes and recipient confirmation before pickup |
| VP-05 Towel sets | Simulated conditional | Recipient may treat certificate as quality guarantee | High | Use certificate explanation script before handover |
| VP-06 Shelving units | Simulated pass with caution | Bulky pickup instructions can be missed or unclear | Medium | Founder should confirm pickup access, dismantling status, and vehicle needs |
| VP-07 Plastic storage bins | Simulated pass | Bulk count verification may be manual | Low | Record quantity at approval and receipt |
| VP-08 Cardboard cartons competing requests | Simulated pass with caution | Competing requests may confuse availability until supplier decision is understood | Medium | Founder should watch request queue and explain pending versus approved quantities |
| VP-09 Reusable pallets | Simulated pass with caution | Logistics details may sit outside the product workflow | Medium | Use notes and founder guidance for dock, truck, and time window |
| VP-10 Parallel requests queue | Simulated pass | Founder monitoring burden increases with multiple active workflows | Medium | Limit first live pilot to one supplier-recipient path before parallel workflows |

## Issue Register

| Issue ID | Scenario | Description | Severity | Recommendation | Status |
| --- | --- | --- | --- | --- | --- |
| VP-I01 | VP-01 | Food-adjacent certificates may be misunderstood as safety or legal approval | High | Avoid food-sensitive first transfer until compliance language is reviewed | Open |
| VP-I02 | VP-05 | Certificate may be misunderstood as quality warranty | High | Add founder explanation in onboarding and walkthrough | Open |
| VP-I03 | VP-03 | Quantity changes after request may require manual clarification | Medium | Handle through notes/support during Wave 1 | Watch |
| VP-I04 | VP-04 | Furniture condition expectations could create disputes | Medium | Require condition notes and recipient confirmation before handover | Watch |
| VP-I05 | VP-06 | Bulky pickup logistics may be under-specified | Medium | Confirm vehicle, access, dismantling, and timing manually | Watch |
| VP-I06 | VP-08 | Competing requests can create perceived availability confusion | Medium | Explain pending vs approved status during onboarding | Watch |
| VP-I07 | VP-09 | Dock and truck instructions may live outside structured fields | Medium | Use handover notes and founder support | Watch |
| VP-I08 | VP-10 | Parallel workflows increase founder operating load | Medium | Keep first real pilot to one live transfer at a time | Watch |

## Simulation Summary

| Metric | Count |
| --- | ---: |
| Total scenarios | 10 |
| Simulated pass | 3 |
| Simulated pass with caution | 5 |
| Simulated conditional | 2 |
| Simulated fail | 0 |
| High-severity issues | 2 |
| Medium-severity issues | 5 |
| Low-severity issues | 1 |

## Recommended First Real Pilot Path

Best first real transfer candidate:

- Supplier B to Recipient B.
- Resource: banquet chairs or shelving units.
- Reason: Non-food, operationally concrete, easier to verify, lower compliance risk than food-adjacent workflows.

Avoid as first real transfer unless reviewed:

- Food-adjacent prepared meals.
- Any category requiring safety, legal, donation, or regulated handling assurance.

