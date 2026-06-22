# Lumina — V1 Vertical-Slice Spec

**Status:** design only (no code, schemas, or migrations) · **Depends on:**
[Architecture Freeze](./lumina-architecture-freeze.md)

## Purpose

Before building breadth, prove **every frozen invariant end-to-end on a single security**. The
slice is deliberately one ticker wide and full-stack deep: price capture, fundamentals
normalization, validation, certification, a live research-grade Shariah screen, and a reproducible
audit trail. If the slice holds, the architecture is sound and breadth is mechanical. If it breaks,
it breaks cheaply, here, before scale.

This spec is the contract the first implementation must satisfy. It is not code.

---

## Scope

**In:** one S&P 500 security (reference example below uses a single CIK/ticker), one trading day of
prices from two sources, one annual EDGAR filing with XBRL, the handful-to-broad set of normalized
financial facts, one AAOIFI-compatible research-grade screen, and the full trust spine
(bitemporality, provenance, validation, confidence, certification, evidence, decision).

**Out (deferred to breadth/V2):** the full universe, restatement intelligence, full statement
reconstruction, paid vendors, additional methodologies, counterfactual *product*, scholar workflow,
object storage / PostgreSQL migration.

---

## The slice, end to end

```
  ┌─ Prices ────────────────────────────────────────────────────────────────┐
  │ Stooq (A) ─┐                                                              │
  │ Yahoo (B) ─┴─► CAS (raw, hashed, WORM) ─► validate/reconcile ─► bitemporal│
  │                                                price (curated) ─► certify │
  └──────────────────────────────────────────────────────────────────────────┘
  ┌─ Fundamentals ───────────────────────────────────────────────────────────┐
  │ EDGAR filing + XBRL ─► CAS (raw) ─► normalize (broad facts) ─► validate ─► │
  │                          bitemporal financial facts (curated) ─► certify   │
  └──────────────────────────────────────────────────────────────────────────┘
  ┌─ Classification ─────────────────────────────────────────────────────────┐
  │ EDGAR SIC (+ business description, captured) ─► versioned classification   │
  └──────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
  ┌─ Intelligence layer ─────────────────────────────────────────────────────┐
  │ Methodology Registry: "AAOIFI-compatible v0.1" (governed config, provisional)│
  │   evidence bundle (pins fact versions + classification + methodology version)│
  │   ─► L-METRIC (ratios under base def) ─► L-JUDGE (PASS/FAIL/WATCHLIST/COND) │
  │   ─► decision validation ─► decomposed confidence ─► RESEARCH_GRADE cert    │
  │   ─► Decision Ledger entry + Evidence Ledger bundle                          │
  └──────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
         as-of query  ·  reproducibility (determinism) check  ·  audit trail
```

---

## Stage-by-stage requirements

### 1. Price capture (two sources)

- Fetch one trading day of OHLCV for the chosen security from **Stooq (Tier B reference)** and
  **Yahoo (Tier C advisory)** through the **vendor-independent adapter contract**.
- Persist each raw response to **CAS**: content-hashed, WORM, with capture timestamp and source
  identity. Capture is the irreversible act — it happens before any processing.
- **Reconcile** the two sources (capture-now / reconcile-later is allowed; here we reconcile in the
  slice to exercise the path). Discrepancies are recorded, not silently resolved.
- Produce a **bitemporal** curated price record: `valid_time` = the market day, `knowledge_time` =
  when captured. Append-only.

**Proves:** multi-source capture, tiering, adapter contract, CAS/WORM, bitemporality, reconciliation.

### 2. Fundamentals (broad normalized facts)

- Fetch one annual filing + its **XBRL** for the security from **EDGAR**; persist raw to CAS.
- **Normalize a broad set of financial facts** (per decision D1 — broad concept coverage, shallow
  depth; *not* a methodology-specific extraction). The Shariah screen will later consume from this
  general fact layer, never reach into XBRL itself.
- Each fact is **bitemporal** and carries provenance to its **filing version** (so a future
  restatement produces a new fact + a new downstream decision, never an overwrite).
- Validate facts (structural validity, basic invariants); fail-closed on anomalies.

**Proves:** EDGAR capture, broad normalization, fact-layer reuse, filing-version provenance,
bitemporal facts, validation.

### 3. Classification

- Derive sector/business-activity classification from **EDGAR SIC** (primary); capture the business
  description as secondary signal (no NLP in V1).
- Store as a **versioned, bitemporal, methodology-independent** classification record. It is an
  input to screening, never owned by the methodology.

**Proves:** classification subsystem is replaceable and methodology-independent.

### 4. Certification (data)

- Run the certification gate over the curated price + fact + classification records. On pass, emit a
  **`dataset_version`** (data certification). Fail-closed otherwise.

**Proves:** dataset versioning + certification gate, fail-closed.

### 5. Methodology registration (governed config)

- Register **"AAOIFI-compatible v0.1"** in the **Methodology Registry** as a **versioned, governed,
  content-hashed plugin definition** — declaring screen set, base definition (`base = total
  assets`), thresholds, required-input manifest, classification dependency, and status taxonomy.
- All values are **provisional, clearly marked non-authoritative**, and stored as config. **No
  threshold or mapping appears in engine code** (decision D3). Governance (defining the methodology)
  is separate from execution (running it).

**Proves:** methodology-as-governed-config; governance ⟂ execution; no hardcoding.

### 6. Screening execution (L-METRIC → L-JUDGE)

- Assemble an **Evidence Bundle**: the exact versions of the facts consumed, the classification
  record version, the input validation + confidence results, and the `methodology_version` — hashed
  to a **Merkle root**.
- Compute **L-METRIC** (ratios under the methodology's base definition) — deterministic, auditable
  measurements, not conclusions.
- Apply thresholds → **L-JUDGE** status ∈ {PASS, FAIL, WATCHLIST (near-boundary), CONDITIONAL
  (insufficient evidence)}. Conservative / fail-closed.

**Proves:** three-tier facts model; deterministic, evidence-backed screening.

### 7. Decision validation + confidence

- **Decision validation:** required inputs present, evidence complete, classification present,
  metric computation deterministic, threshold application correct, status internally consistent →
  fail-closed to CONDITIONAL/quarantine on any failure.
- **Decomposed confidence:** inherit Source-Trust × Data-Quality from the evidence inputs (the
  ceiling), then reduce by evidence completeness, methodology confidence (research-grade < formal;
  SIC-based classification is coarse), and **boundary proximity** (a metric near its threshold is a
  fragile result). Persist all sub-scores + model version.

**Proves:** decision validation; confidence bounded by inputs; boundary-proximity dimension.

### 8. Shariah certification (research-grade) + ledgers

- Emit a **RESEARCH_GRADE** Shariah certification (decision D2) that **references the data
  `dataset_version`** (separate-but-chained). Explicitly not a formal religious ruling.
- Append the decision to the **Decision Ledger** (`security · methodology_id · methodology_version ·
  status · valid_time · knowledge_time · confidence · evidence_bundle_ref · validator_ref ·
  certification_ref · decision_type = ACTUAL`) and the bundle to the **Evidence Ledger**.

**Proves:** graded certification, chaining, append-only decision + evidence ledgers.

---

## Acceptance criteria (the slice passes iff all hold)

1. **Reproducibility / determinism:** re-running the engine over the stored evidence bundle yields
   the **identical** L-METRIC values and L-JUDGE status.
2. **As-of query:** "what did we believe about this security's status on date *D*, under
   `AAOIFI-compatible v0.1`?" returns the correct decision from the bitemporal ledger, for both
   *as-we-believed-then* and *as-we-believe-now-about-then*.
3. **No overwrite:** every revision (a re-fetch, a corrected fact) appends; no prior record is
   mutated or deleted. Verifiable from the ledger history.
4. **Provenance closure:** from the final decision, every input is traceable back through evidence
   bundle → certified fact → curated record → raw CAS payload (with hash + capture time + source).
5. **Fail-closed:** with a required input withheld, the screen yields **CONDITIONAL**, never a
   default PASS, and certification is denied.
6. **Governance ⟂ execution:** changing a threshold in the methodology config (not code) changes the
   outcome on re-run; no code edit is required to alter thresholds/mappings.
7. **Tiering effect:** the Tier-C (Yahoo) source cannot, on its own, support a higher certification
   grade than its tier permits.
8. **Storage abstraction:** all reads/writes go through the storage interface; grepping the slice
   for SQLite-specific calls outside the storage adapter returns nothing.
9. **Layer boundary:** no Shariah judgment is written into any Core fact table; judgments live only
   in the Decision/Evidence ledgers.

---

## Explicit non-goals for the slice

- No breadth (one security only).
- No restatement handling beyond *demonstrating* that a new filing version would append a new
  decision (the path exists; the scenario is not exercised at scale).
- No second methodology, no counterfactual product surface (the recompute mechanism exists, the UX
  does not).
- No object-storage / PostgreSQL migration (only abstraction-readiness is required).
- No formal certification, no scholar workflow.

---

## After the slice

Once the slice passes all acceptance criteria, breadth becomes mechanical: widen capture to the
S&P 500 universe, broaden the normalized fact set, and let the same trust spine carry it. The
architecture, not the volume, is what the slice de-risks.
