# Reflection Brief, Evaluation and Observability Capstone

**Name:** Fady
**Date:** 2026-07-08

> Ground every answer in your own run. When a question asks for a number, file name, or line, paste
> it from your artifacts, a reviewer should be able to find it. Answers that are correct in the
> abstract but cite nothing do not meet the bar. Keep it short and specific.

***

## 0. Environment

| Field | Value |
|---|---|
| OS and version | Windows 11 |
| Python version | 3.11.9 |
| Date run | 2026-07-08 |
| Ran any system live? (which) | Yes, all 3 systems were run live against Claude 3.5 Sonnet (claude-sonnet-4-5-20250929) via Vocareum API. |

***

## 1. Validated, routed pipeline

| Evidence | Value |
|---|---|
| Passing test count | 48 |
| Routing output file | routing_decisions.json |
| auto_approve / human_review / spot_check counts | 1 / 7 / 1 |

**1a. Retry boundary.** From your perturbation run (a required field removed), paste the escalation
record. How many API calls did the system make, and why is retrying a futile case worse than
escalating it?

> ```json
>     "endorsements_absent": {
>       "count": 1,
>       "policies": [
>         "POL-2025-009"
>       ],
>       "categories": [
>         "missing_source"
>       ]
>     }
> ```
> The system made 1 API call before escalating and skipping the retry loop entirely. Retrying a futile case, where the document is actually missing the required information, just wastes tokens and latency for an outcome that will not change. Escalating right away saves resources and flags the real issue for a human to look at.

**1b. Reading the router.** Pick one `human_review` record from your routing output. Which of the
three signals (confidence, reviewer, integration) sent it to a human? If you had trusted the model's
confidence alone, what would have happened?

> Policy ID: `POL-2025-001`
> It was routed to a human because the reviewer model flagged a disagreement on the coverage limit: `"reason": "reviewer_disagreement=['coverage_limit']"`.
> The extractor model's confidence for that limit was 1.0. If we trusted the confidence score alone, the router would have automatically approved the document. That means an incorrectly extracted coverage limit would have gone straight into the database.

**1c. Where the aggregate lies.** Run the calibration snippet. Quote the one cell whose accuracy lags
its confidence, plus the overall figure. What does slicing by `policy_type × field` catch that a
single number hides?

> `umbrella      exclusions      n=2 conf=0.93 acc=0.00 brier=0.865`
> `OVERALL brier=0.291`
> A single overall Brier score of 0.291 looks fine on paper. It hides the fact that the extractor fails completely on a very specific edge case: umbrella policies on the exclusions field. Slicing the report isolates this failure, where the model has 0% accuracy despite a 93% confidence score, so we can fix the prompt for that exact scenario.

***

## 2. Schema-enforced two-pass extraction

| Evidence | Value |
|---|---|
| Passing test count | 25 |
| Document run | fixtures/documents/income_sum_mismatch.txt |
| Classified type | paystub |

**2a. Two guarantees.** Paste your discrepancy-run output. Tool use already forces valid JSON, yet the
validator still catches a bad sum. Why are these two different guarantees? Name one error each cannot
catch.

> ```json
> "consistent": false,
> "discrepancies": [
>   {
>     "field": "total_monthly_income",
>     "calculated": 9642.17,
>     "stated": 10892.17,
>     "delta": -1250.0
>   }
> ]
> ```
> The LLM's tool use only guarantees the output is formatted as valid JSON with the right data types. The Python validator guarantees the actual math adds up according to business rules.
> - Schema checks cannot catch a math error: here the base, commission, bonus, overtime, and other income each extracted correctly, but the stated total of $10,892.17 is $1,250 higher than the real sum of $9,642.17.
> - The validator cannot catch a missing required field or a broken data structure because it needs a fully parsed object before it can even run.

**2b. Refusing to fabricate.** Run on a document missing a field. Paste that field's output. Why null
instead of an invented value? Point to the schema choice that allows it.

> `"bonus_monthly": null`
> (from `income_missing_bonus.txt`, where the paystub has no bonus line)
> Guessing a value ruins data integrity and causes silent errors later. It is much safer to return null to show the data was not in the source text. The schema enables this with `bonus_monthly: float | None = Field(default=None)`, which explicitly gives the model permission to output null.

**2c. Normalization.** Quote one field where the source text and extracted value differ in format
("approximately 2,400 sq ft" to `2400`). Why normalize at extraction time rather than downstream?

> Source text: `Gross Living Area:   approximately 2,400 sq ft (above-grade finished)`
> Extracted value: `"gross_living_area_sqft": 2400`
> Cleaning up the data right at the extraction step turns messy text into standard, queryable integers immediately. If we waited to do this downstream, we would have to write fragile regex parsers in the database or backend just to strip out words like "approximately" or "sq ft". Downstream systems should not have to deal with messy text.

***

## 3. Multi-source synthesis

| Evidence | Value |
|---|---|
| Passing test count | 34 |
| Briefing file | system3_pipeline.txt |
| Section the conflict landed in | Contested |

**3a. Annotate, don't arbitrate.** Quote one conflicting-metric pair from your briefing, both values,
sources, dates. Give one way a reader is better served by the preserved conflict than by a single
reconciled number.

> `on_time_delivery_rate`
> 95.0 percent, supplier_audit (as of 2026-04-10)
> 78.0 percent, logistics (as of 2026-04-05)
>
> Averaging the two into a single number hides a real problem: our internal logistics data shows a 17% lag compared to what the supplier reports in their own audit. Keeping both values visible tells analysts they need to investigate why that gap exists. Maybe the supplier measures dispatch time while we measure confirmed arrival. That is operationally useful in a way an average is not.

**3b. Source goes dark.** Run with `--simulate-timeout`. Paste the part of the briefing showing the
failed source. How is "unreachable" handled differently from "nothing to report," and why does the run
still finish?

> `### late_shipment_count  _[missing source: timeout reading logistics]_`
> `- missing source: timeout reading logistics`
>
> "Unreachable" clearly tells the user that the system could not connect to that source, which prevents a false sense of security. "Nothing to report" implies the system checked and found zero issues. The run still finishes because the architecture degrades gracefully: if the logistics source times out, it does not block the system from synthesizing the news and quality data it already retrieved.

**3c. Dates as a guardrail.** Quote two claims about the same supplier with different dates. How does
requiring a date stop a time difference from reading as a contradiction?

> `A supplier named 'Meridian' missed payments to subcontractors (industry_news, 2024-01-01)`
> `Meridian Components had several containers stranded at anchor during the Port of Long Beach 72-hour labor strike... (industry_news, 2026-03-16)`
>
> Without dates, an analyst or a summarizing model might read these two events as happening at the same time and wrongly link the missed payments to the port strike. The dates show the financial trouble occurred two years before the shipping disruption, which prevents the system from generating a false causal connection.

***

## 4. Synthesis

**4a. One principle.** Name the single moment in your runs (system + artifact) where *evaluate the
output, don't trust the model's word* most clearly caught something a trusting design would have
shipped.

> When running System 2 against `fixtures/documents/income_sum_mismatch.txt`, the model confidently extracted all five income components correctly and produced a perfectly valid JSON object. A trusting system would have stored that data directly. But the Python validation function caught that the real sum of $9,642.17 did not match the stated total of $10,892.17, a delta of $1,250. That error would have entered the database silently.

**4b. Confidence ≠ correctness.** Pick the system where this mattered most, and explain why using
something you observed.

> I saw this in System 1. When processing policy `POL-2025-001`, the extractor assigned its `coverage_limit` extraction a perfect confidence score of 1.0. But the independent reviewer model disagreed with that exact value. Because the system did not rely on confidence alone, it caught the mistake and routed the document to a human.

**4c. Apply it.** Describe a real workflow where an LLM pulls structured results from messy input.
Which pattern, validated retry with escalation, independent review with deterministic routing, or
provenance-preserving conflict annotation, would you reach for first, and what would you instrument
to know when it broke?

> **Workflow:** Extracting a patient's medical history from unstructured physician notes.
>
> **First Pattern:** Independent review with deterministic routing. One model extracts the clinical entities (diagnoses, dates, dosages) and a second model checks them. Any disagreement routes the record to a human medical coder. This keeps hallucinations from reaching the patient database silently.
>
> **Instrumentation:** A calibration report sliced by medical specialty, for example Cardiology dosages. If the models start producing high confidence scores alongside low accuracy on a specific specialty, that slice will catch it. I would also monitor the ratio of human reviews to auto-approvals over time to detect data drift when new doctors start using shorthand the models have not seen.
