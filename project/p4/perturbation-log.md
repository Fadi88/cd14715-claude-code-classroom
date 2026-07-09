# Perturbation Log

For each system, make one deliberate change to an input or configuration, predict the outcome, run
it, and record what actually happened. See the starters in the Instructions, or design your own (your
own experiment earns more credit).

***

### System 1, Validated, routed pipeline

- **Change I made (file + what I changed):** I created `data/policies/POL-2025-999.txt` (a copy of `POL-2025-001.txt`) and deleted the `Policyholder:` line entirely to see how the system handles a missing required field.
- **Command I ran:** `.venv\Scripts\policy-extractor pipeline data/policies/ --routing-out routing_decisions_perturbed.json`
- **What I predicted:** I expected the extractor to retry, fail to find a source for the missing field, and escalate with a "missing_source" error.
- **What actually happened (paste the key output line):** `"policy_id": "POL-2025-999", "decision": "human_review", "reason": "reviewer_disagreement=['coverage_limit']"`. It did not escalate. The model hallucinated a value for the missing field, then the reviewer disagreed with it, sending it to human review instead of escalation.
- **How this differs from the unperturbed run:** A document with a genuinely missing endorsements field (POL-2025-009 in the baseline run) escalates immediately: `"endorsements_absent": {"count": 1, "categories": ["missing_source"]}`. The hallucination happened on a different field than the one I removed, which shows the model does not always detect that the source is absent.

***

### System 2, Schema-enforced two-pass extraction

- **Change I made (file + what I changed):** I ran the extractor against `fixtures/documents/income_sum_mismatch.txt`, a paystub where the stated total income is $10,892.17 but the line items only sum to $9,642.17.
- **Command I ran:** `.venv\Scripts\mortgage-extract fixtures/documents/income_sum_mismatch.txt`
- **What I predicted:** The schema would accept the data because it is valid JSON with the right types, but the mathematical validator would catch that the component sum does not match the stated total.
- **What actually happened (paste the key output line):** `"consistent": false, "discrepancies": [{"field": "total_monthly_income", "calculated": 9642.17, "stated": 10892.17, "delta": -1250.0}]`
- **How this differs from the unperturbed run:** Valid documents like `appraisal_informal_sqft.txt` return `"consistent": true` and an empty discrepancies array, and the command exits with code 0.

***

### System 3, Multi-source synthesis

- **Change I made (file + what I changed):** I ran the pipeline with the `--simulate-timeout` flag to artificially block retrieval of the logistics data source.
- **Command I ran:** `.venv\Scripts\python.exe -m supply_chain_risk meridian --data-root data --simulate-timeout`
- **What I predicted:** The pipeline would finish but mark the logistics metrics as unreachable instead of dropping them silently.
- **What actually happened (paste the key output line):** `### late_shipment_count  _[missing source: timeout reading logistics]_` and `- missing source: timeout reading logistics`. The briefing completed with all other sections intact.
- **How this differs from the unperturbed run:** The normal run reads the logistics CSV and surfaces the real values in the briefing, for example `average_lead_time_days: 12.0 days` and `late_shipment_count: 11.0 shipments`. The timeout run marks both as missing source instead.
