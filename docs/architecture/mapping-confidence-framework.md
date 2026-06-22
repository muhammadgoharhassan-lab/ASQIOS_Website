# Lumina — Mapping Confidence Framework

**Status:** design review (no code/schema) · **Hardens:** the canonical boundary (stage 3 of the
[fact lifecycle](./vertical-slice-spec.md)) · **Depends on:**
[Architecture Freeze](./lumina-architecture-freeze.md) ·
[Global-Readiness Audit](./global-readiness-audit.md) · **Date:** 2026-06-22

## Why this exists

The canonical boundary concentrates **all** cross-taxonomy semantic risk into the mapping layer:
every methodology consumes canonical concepts, so mapping quality propagates into validation,
certification, evidence bundles, the intelligence substrate, Shariah decisions, future factor
models, and research outputs. A bare `mapping_confidence` scalar is the exact opaque judgment Lumina
avoids elsewhere. This framework makes a **mapping a first-class governed artifact** — parallel to a
methodology — with decomposed confidence, fail-closed gating, and bitemporal reproducibility.

**No Architecture Freeze reopen.** Everything reuses frozen primitives (methodology-registry
governed-artifact pattern, decomposed STS×DQS, validation engine, bitemporality, evidence bundles,
fail-closed). Adopted as additive invariants **MC-1…MC-10**.

---

## Part 1 — Mapping Confidence Model (decomposed, not a scalar)

**Artifact fields:** `mapping_id · source_taxonomy(@version) · source_concept · canonical_concept ·
mapping_version · transformation(identity|unit|sign|aggregation|formula) · accounting_standard ·
confidence_score · confidence_reason · approval_status · valid_interval · knowledge_interval ·
evidence_ref · author · approver`.

`confidence_score` is **derived (weakest-link) from six sub-factors**; `confidence_reason` stores the
decomposition (not prose):

1. **Semantic equivalence** — identity > subset/superset > approximation > derived.
2. **Definitional authority** — accounting-standard text / official taxonomy doc > analyst judgment >
   heuristic/inferred.
3. **Transformation complexity** — 1:1 > unit/sign > aggregation of N concepts > formula-derived.
4. **Cross-standard stability** — same meaning across standards / taxonomy versions?
5. **Dimensional cleanliness** — clean total vs requires axis/member disambiguation.
6. **Review depth / corroboration** — independent reviewer agreement; cross-taxonomy / sample-filing
   corroboration.

`confidence_score = weakest_link(sub-factors)`, bounded `[0,1]`, always explainable — a mapping is no
better than its worst dimension.

| Example | Score | Decomposition |
|---|---|---|
| Revenue | 0.99 | identity · standard-defined · 1:1 · stable · clean total |
| Operating Income | 0.95 | near-identity, minor cross-standard definitional variance |
| Adjusted Earnings | 0.70 | issuer-defined approximation · analyst basis · unstable |
| Custom Derived Metric | 0.50 | formula-derived · heuristic basis · high transformation complexity |

> **MC-1** mapping = governed artifact · **MC-2** confidence is decomposed.

## Part 2 — Confidence Classification

Half-open bands (no overlap): **A `[0.95,1.00]` · B `[0.85,0.95)` · C `[0.70,0.85)` · D `[0,0.70)`**.

| Band | Disposition |
|---|---|
| **Tier A** | Certifiable without a human gate (after standard approval) |
| **Tier B** | Certifiable only with **recorded human approval** |
| **Tier C** | Usable only with explicit review; **caps downstream certification grade**; generates warnings |
| **Tier D** | **Blocked from certified pipelines (fail-closed)** — quarantined; sandbox-only; explicit override + justification to use at all |

Any mapping not in `APPROVED/ACTIVE` status is un-certifiable **regardless of score**.

## Part 3 — Governance (mappings treated like methodologies)

A **Mapping Registry** parallel to the Methodology Registry, reusing the same governed-artifact
primitives. Status lifecycle:
`DRAFT → PROPOSED → UNDER_REVIEW → APPROVED → ACTIVE → DEPRECATED → SUPERSEDED → RETIRED`
(plus `REJECTED`, `QUARANTINED`).

- **Review** — reviewer examines evidence + decomposed confidence + validation results;
  **author ≠ approver**.
- **Approval** — tier-appropriate authority signs off per `mapping_version`; identity + knowledge_time
  + evidence refs recorded; higher tiers require higher authority.
- **Versioning** — any change → new `mapping_version` (semver + content hash); immutable, never edited
  in place.
- **Retirement** — concept/taxonomy no longer valid → `RETIRED` with effective_date; history
  preserved.
- **Supersession** — v1 superseded-by v2 with effective_date + recorded link → triggers an **impact
  set** re-evaluation (new decisions appended; old remain queryable) — identical machinery to
  methodology change-events.

> **MC-7** evidence mandatory · **MC-8** author ≠ approver.

## Part 4 — Evidence Requirements (Mapping Evidence Record — content-addressed, mandatory)

Every `mapping_version` retains an immutable evidence record justifying source→canonical:

- **Basis types:** accounting-standard citation (e.g. ASC 606 / IFRS 15 for revenue); official
  taxonomy element documentation snapshot (label/definition/references linkbase, content-addressed);
  analyst rationale (who/when/why); prior-mapping lineage (derived-from / consistent-with an approved
  mapping); corroboration (second-taxonomy cross-check, sample-filing reconciliation over N filings).
- **Retained:** the decomposed confidence rubric + sub-scores, reviewer/approver identities +
  timestamps, citations, sample-validation results, the canonical-concept definition version.
- **Fail-closed:** an `APPROVED` mapping with no evidence basis is itself a validation failure — you
  cannot certify a mapping you cannot justify.

## Part 5 — Certification Impact (mapping confidence → DQS, not STS)

- **STS unaffected** — source trust (EDGAR authoritative) is independent of *our* transformation.
- **DQS reduced** — mapping is our derivation: `DQS(canonical) = DQS(raw) × mapping_confidence`
  (weakest-link). Overall fact confidence = `STS × DQS ≤ mapping_confidence`.
- **Dataset certification** — grade bounded by the **lowest mapping tier** among certified facts; a
  Tier D mapping blocks institutional certification (caps at experimental).
- **Research / Shariah certification** — inherit through the evidence bundle; decision confidence ≤
  `min(input fact confidences) ≤ min(input mapping confidences)`.

**Can a low-confidence mapping reduce certification confidence? Yes — by design.**
**Should certification be blocked below thresholds? Yes:** formal/institutional ⇒ Tier A (Tier B with
approval); research-grade ⇒ Tier C floor; **Tier D blocked everywhere.**

> **MC-3** DQS flow · **MC-4** tier-gated certification.

## Part 6 — Validation Engine Integration (graph checks, fail-closed)

Mappings form a versioned `source → canonical` graph; the existing validation engine runs declarative
checks at registration (publish gate) **and** continuously on new taxonomy versions / filings:

| Check | Action |
|---|---|
| **Conflicting** — same `(taxonomy@version, source_concept)` → two ACTIVE canonical targets | block |
| **Circular** — cycles in the derived-concept DAG | block |
| **Many-to-one** — aggregation must be declared, non-overlapping, sum-coherent | flag double-counting |
| **One-to-many** — ambiguity | block unless resolved by dimensions |
| **Taxonomy version drift** — concept semantics changed across versions | drift warning → re-review |
| **Deprecated concepts** — source deprecated but mapped ACTIVE | warn / retire |
| **Orphan concepts** — concept in real filings with no ACTIVE mapping | **quarantine the fact (fail-closed)** — never silently drop |
| **Coverage** — methodology required inputs lack ACTIVE, tier-sufficient mappings | block methodology (Part 8) |

> **MC-9** graph validation gates publication.

## Part 7 — Bitemporal Requirements

- **valid_time** — period the mapping is semantically correct (taxonomy-version applicability +
  accounting-standard period).
- **knowledge_time** — when we recorded / approved / changed it.
- **Lineage** — concept→Revenue mapped **v1** (knowledge 2025); changed **v2** (knowledge 2027). The
  2025 decision **pinned `mapping_version` v1 in its evidence bundle** → reproducible forever; new
  2027 facts use v2; a 2027 re-evaluation appends a new decision while the old remains. Both
  *as-we-believed-then* and *as-we-believe-now-about-then* supported. Supersession → impact-set
  re-evaluation (same engine as methodology changes).

> **MC-6** mappings bitemporal + pinned in evidence bundles.

## Part 8 — Methodology Safety (never silently consume weak mappings)

- Each canonical fact in the evidence bundle carries its `mapping_version` + confidence/tier.
- A methodology's governed config declares a **minimum mapping tier per required input** (e.g.
  AAOIFI-compatible: Revenue / Debt / Cash ≥ Tier B).
- On a low-confidence input: **confidence propagated** (decision ≤ weakest input) · **warning
  generated** · **certification reduced** (capped by lowest tier) · **execution gated**:
  - ≥ declared minimum (A/B) → run normally.
  - Tier C where allowed → run but **cannot be a clean full-confidence PASS** → CONDITIONAL or
    PASS-with-low-confidence + warning; cap certification.
  - **Tier D, or below the declared minimum → block / fail-closed to CONDITIONAL** (insufficient
    trustworthy evidence). Never a silent PASS on a Tier D input.
- Defaults: institutional ≥ Tier B · research ≥ Tier C · **Tier D always blocked**.

> **MC-5** per-input minimum mapping tier, fail-closed.

## Part 9 — Global Expansion Impact (+ one material finding)

For the Shariah-critical canonical inputs (Revenue, TotalAssets, Cash, InterestBearingDebt,
NonPermissibleIncome):

| Taxonomy | Revenue / Assets / Cash | Debt / Non-permissible income | Analyst review |
|---|---|---|---|
| US-GAAP (EDGAR) | Tier A | A/B | low |
| IFRS / ESEF | Tier A | A/B (presentation flexibility) | low |
| JP-GAAP (EDINET) | A/B | B/C (granularity, EN docs) | moderate |
| **SOCPA / Saudi** (IFRS-endorsed) | A/B | **B/C** | **Islamic-finance items: required** |
| China CAS | B | B/C–C (CAS divergence, ZH docs, licensing) | high |

**Material finding (Shariah-sensitive).** Under Saudi/GCC, **Islamic-finance instruments** — sukuk,
murabaha / ijara receivables, takaful — must **not** be naively IFRS-mapped to canonical
`InterestBearingDebt` / `NonPermissibleIncome`. A sukuk is *not* conventional interest-bearing debt;
murabaha income is *not* conventional interest. These mappings **default to lower confidence and
mandatory analyst review, never auto-certify** — precisely where the methodology is most sensitive,
so the Part 8 fail-closed gates then protect the decision.

> **MC-10** Islamic-finance mappings default low + mandatory review.

## Part 10 — Final Recommendation

| Deliverable | Outcome |
|---|---|
| 1. Mapping Confidence Framework | decomposed six-factor, weakest-link, explainable |
| 2. Confidence Classification | Tier A/B/C/D half-open; A auto, B/C review, D blocked |
| 3. Governance Model | Mapping Registry parallel to methodologies; full lifecycle; author ≠ approver |
| 4. Evidence Requirements | mandatory content-addressed Mapping Evidence Record; no evidence ⇒ no cert |
| 5. Certification Integration | mapping confidence → DQS (not STS); weakest-link caps; D blocked |
| 6. Validation Integration | graph checks (conflict/cycle/orphan/drift/m:1/1:m), fail-closed |
| 7. Bitemporal Design | valid + knowledge time; evidence pins `mapping_version`; supersession → impact re-eval |
| 8. Methodology Safety Rules | per-input minimum tier; propagate / warn / reduce / block; D always blocked |
| 9. Global Expansion Impact | high for US-GAAP/IFRS/Saudi core; review for JP-GAAP/China; **Islamic-finance flagged** |
| 10. Architecture changes | **none that reopen the freeze** — adopt MC-1…MC-10 as additive hardening |

The only **material risk** discovered (Islamic-finance instrument mappings) is mitigated by MC-5 +
MC-10 — no structural change.

---

## MC invariants (additive to the freeze)

- **MC-1** Mapping is a first-class governed artifact in a Mapping Registry (parallel to methodologies).
- **MC-2** Mapping confidence is **decomposed** (six factors), weakest-link, always explainable.
- **MC-3** Mapping confidence flows into **DQS** (not STS); overall fact confidence ≤ mapping confidence.
- **MC-4** Certification is tier-gated: A auto · B/C require approval and cap grade · **D blocked**.
- **MC-5** Methodologies declare a **minimum mapping tier per required input**; sub-threshold ⇒
  fail-closed to CONDITIONAL, never silent PASS.
- **MC-6** Mappings are bitemporal and pinned in evidence bundles; supersession triggers impact-set
  re-evaluation.
- **MC-7** A content-addressed **Mapping Evidence Record** is mandatory; no evidence ⇒ cannot certify.
- **MC-8** Author ≠ approver; tier-appropriate approval authority.
- **MC-9** Validation graph checks gate publication and run continuously; orphans quarantine facts.
- **MC-10** Islamic-finance instrument mappings default to low confidence + mandatory analyst review.
