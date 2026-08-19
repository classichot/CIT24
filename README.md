# CIT24

**AI-assisted Thai Corporate Tax Operating System — not a PND50 form generator.**

> Upload your accounting records once. CIT24 creates the provision, ภ.ง.ด.51, ภ.ง.ด.50 and a defensible evidence trail — and remembers every tax position for next year.

CIT24 converts Trial Balance, General Ledger, financial statements and supporting documents into an explainable, reviewable and traceable Thai corporate tax position under sections 65, 65 bis and 65 ter of the Revenue Code.

```
UPLOAD → MAP → RULE ENGINE → TAX ADJUSTMENT LEDGER → PROVISION / ภ.ง.ด.51 / ภ.ง.ด.50 → REVIEW → AUDIT DEFENCE
```

## Architectural principle

**Two engines, never mixed.**

1. **AI Evidence Engine** — extracts, classifies, detects and explains.
2. **Deterministic Tax Calculation Engine (`CIT24-CALC`)** — applies approved formulas and versioned rules.

A language model never calculates or silently changes a tax position. Click any amount for one-click traceability:

**Return field → tax computation line → adjustment note → GL transactions → source document → legal rule → approval history.**

## MVP

Ordinary Thai non-BOI companies using the standard ภ.ง.ด.51 estimation method (section 67 bis (1)):

- TB / GL / document ingestion with mapping assistant
- Top recurring Thai tax rules (s.65 ter library, not a generic “non-deductible” bucket)
- Tax Adjustment Ledger with versioning (approved records are never overwritten)
- Automatic Reversal Guardian and Corporate Tax Memory
- Current-tax provision, ภ.ง.ด.51 penalty-risk simulator, ภ.ง.ด.50 field mapping
- Review, approval, period lock, evidence-linked workpapers, Thai/English UI
- Complete append-only audit trail

Phase 2: deferred tax (included here as an enterprise preview), BOI allocation, multi-entity, ERP connectors.  
Phase 3: direct e-filing (only after RD interface validation), listed/financial workflows, full TP24 / GMT24 / RISK24 / PIT24 integration.

## Modes

- **Corporate** — single-entity tax close
- **Advisory** — multi-client workspace
- **Audit defence** — RD request tracker and evidence room

## Prototype

Seeded demo entity: **Siam Precision Parts Co., Ltd.** (TIN 0105548093271), FY2026 continuous close through 31 July.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo: `kanit@7l-advisory.com` / `demo1234`

Design follows the Modernist system in `design-ref/` (Archivo, 0px radius, 2px rules, accent `#ec3013`).
