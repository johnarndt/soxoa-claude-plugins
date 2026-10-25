---
name: evaluate-ai-output
description: Review an AI result against its original sources and declared acceptance criteria, recording omissions, false positives, conflicts, and limits of the evidence.
---

# Evaluate AI output

Produce a source-grounded assessment of an existing AI result. This skill reviews supplied work; it does not run paid inference, change a benchmark, or edit the underlying product.

## Inputs

Use the authorized original sources, the unchanged raw result, the intended task and scope, and any acceptance criteria fixed before the result was seen. Record source revisions and result identity with available filenames, versions, dates, or hashes. If a required input is missing, review the supported portion and name the missing input and its effect on the verdict.

When criteria are absent, propose explicit criteria before scoring. Label them as a new prospective definition. Do not present a newly chosen definition as the historical benchmark.

## Review

1. Inventory the complete source set and requested scope. Separate sources actually inspected from unavailable or unreadable material. A selected page or trade cannot establish whole-document coverage.
2. Preserve the raw result. Put normalization and reviewer corrections in separate records. Converting equivalent units or labels is acceptable; inserting a missing answer is a correction and must remain visible.
3. Build a claim ledger: claim, source revision and location, expected basis, observed result, disposition, and short evidence note. Use supported, contradicted, omitted, unresolved, or outside scope. Keep source conflicts distinct from model mistakes.
4. Verify material claims against the source itself. A plausible citation or matching total is insufficient. Check that cited pages and regions exist and contain the asserted evidence. For counted instances, inspect uniqueness and ownership; repeated marks cannot count as different objects. Preserve distinctions such as openings versus components and quantities versus specifications.
5. Audit coverage in both directions: every required source fact should have a disposition, and every material output claim should have support. Identify unsupported additions, substituted items, omitted groups, duplicate counts, and false claims that evidence is absent.
6. Keep unknown values unknown. A missing price is not zero; an unresolved specification is not permission to substitute a familiar value. Report incomplete totals as incomplete.
7. Apply the declared criteria without averaging away a mandatory failure. Report any narrow subpass with its exact scope. If quantitative metrics are appropriate, define numerator, denominator, exclusions, and adjudication of ambiguous cases. Record automated delivery cost and latency only when measured records exist, distinguishing them from review labor.

If a scorer is involved, inspect whether wrong citations, contradictory duplicate claims, or repeated instances can pass. Use separate synthetic copies for any authorized negative checks. Preserve earlier results and explain every criteria revision. Evaluator answers and annotated gold material must stay out of any subsequent inference inputs.

## Deliverable and stopping condition

Return a bounded verdict, the claim ledger, the highest-impact omissions and false positives, unresolved source conflicts, criteria/version notes, and the next evidence needed. State who or what performed the review and any independence limitations. Stop when the declared scope has a supported disposition or a specific evidence gap prevents one. Do not manufacture a percentage from incomplete ground truth, call a development example held-out, or claim expert certification.

Package status: this Claude skill draft has not been behaviorally tested in Claude. Its method was derived from historical source-review work; that provenance does not validate this package.
