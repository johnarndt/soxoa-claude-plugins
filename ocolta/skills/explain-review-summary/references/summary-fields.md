# Ocolta review summary fields

Every field below comes from `get_review_summary`. Ocolta normalizes the stored Deep Review into these categories; any value it cannot recognize is returned as `unable_to_determine`, so treat that value as "inconclusive", never as an error in the user's file.

## `status`

| Value | Say | Meaning |
| --- | --- | --- |
| `completed` | "completed" | The model returned a review. The other fields describe it. |
| `unable_to_determine` | "inconclusive" | The review could not reach a supported assessment of this document. This is a normal outcome, not a fault and not a warning sign. |
| `refused` | "declined by the model" | The model declined to review the file for safety reasons. Nothing can be read from it about the document. |

A completed, inconclusive or declined result each used one review credit, under Ocolta's terms. If the user asks about a refund or retry, point them to hello@ocolta.com with the Stripe receipt (never the document).

## `reviewPriority`

How strongly the review suggests a person should look at this document soon. It orders the reviewer's queue. It is not a fraud score and not a likelihood.

| Value | Describe as |
| --- | --- |
| `low` | Nothing in the review calls for urgent human attention. Normal policy checks still apply. |
| `moderate` | Worth a human look before relying on the document. |
| `high` | Look at this file first, and verify key facts at the source before relying on it. |
| `unable_to_determine` | No priority could be set. Apply your normal review policy. |

## `confidence`

How well the review supports its own observations. Ocolta's terms: confidence "describes the model's support for a reported observation, not fraud probability or a factual conclusion about a person or document". Never turn it into a percentage or a probability.

| Value | Describe as |
| --- | --- |
| `high` | The observations are well supported by what the review could see. |
| `medium` | Reasonably supported, with some room for error. |
| `low` | Weakly supported. Treat any indicator as a question, not a finding. |
| `unable_to_determine` | No confidence level was available. |

## `fraudAssessment` and `aiGenerationAssessment`

Two separate tracks: fraud-risk indicators (signs a document may have been altered or may misrepresent something) and AI-generation indicators (signs content may have been machine-generated). One can be present while the other is not.

| Value | Say | Does not mean |
| --- | --- | --- |
| `indicators_present` | "the review reported N indicator(s) worth checking" | That the document is fake, altered or AI-generated, or that anyone acted dishonestly. Many indicators have ordinary explanations (a scanner, a portal, an e-signature service, an editor used to combine pages). |
| `no_supported_indicators` | "the review found no supported indicators" | That the document is authentic. Ocolta's own guidance: clean metadata is not proof of authenticity, and a clean file should not end the process on a material decision. |
| `unable_to_determine` | "the review could not say either way" | A warning sign. Images, scans and locked PDFs expose less evidence. |

AI-generation detection is especially unreliable. Never present `indicators_present` on that track as "this was made with AI".

## Counts

| Field | Meaning |
| --- | --- |
| `fraudIndicatorCount` | How many fraud-risk indicators the review listed. |
| `aiGenerationIndicatorCount` | How many AI-generation indicators it listed. |
| `limitationCount` | How many limits the review noted on what it could assess (for example a low-quality image, or a part it could not read). More limitations mean less of the document was fully checked. |

The counts say how many items exist, not how serious each one is. The items themselves, with evidence locations, confidence, benign explanations and next steps, are only in the full report in the Ocolta workspace or the downloaded JSON.

## `disclaimer`

Always: "This review identifies document-level signals for human follow-up. It does not prove fraud, authenticity, intent, identity, account ownership, or AI generation." Quote it verbatim at the end of every explanation.

## Reading the values together

| Pattern | Plain reading |
| --- | --- |
| `high` priority, `indicators_present`, `high` or `medium` confidence | The review found specific things worth checking and is fairly sure of what it saw. Open the full report, check each indicator against the file, then verify the key facts with the issuing institution. |
| `indicators_present` with `low` confidence | Weak signals. Read them as questions to check, not as findings. Consider ordinary explanations first. |
| `no_supported_indicators` on both tracks, `low` priority | Nothing stood out to the review. That supports moving ahead under your normal policy, but it is not proof the document is genuine; still verify material facts as your policy requires. |
| `limitationCount` above 0 with `no_supported_indicators` | Part of the document may not have been assessed, so the absence of indicators is less informative. A better copy (the original portal download) helps. |
| `status` `unable_to_determine`, or several `unable_to_determine` fields | Inconclusive. Rely on your normal review steps and source verification; do not treat it as either good or bad. |
| `status` `refused` | Nothing can be read from it. Review the document by your normal process. |

## Synthetic results

When `get_connected_purchase` returns `synthetic: true`, the connection is Ocolta's labeled reviewer fixture. Its summaries are test data with no real document behind them. Say so in every answer.
