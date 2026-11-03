# XLSX export – Sift Table 1.0.0.12 (experimental)

## How to use
- Import `SiftTable.pbiviz` from branch `feature/xlsx-export` in a test Power BI report.
- The toolbar contains **XLSX** (new) and the original CSV download icon.
- Click **XLSX** in Power BI Service and accept the download confirmation. The output is `sift-table.xlsx`.

## Contents
- One Excel sheet named "Sift Table", with visible columns in display order and all currently loaded filtered rows (or selected rows if any).
- Native numeric, date/time, boolean and text cell types, with currency and percentage number formats when detected.
- Filterable header, frozen first row and preserved leading zeros for text identifiers.
- Original CSV remains available. Text starting with formula characters is saved as text, never as an Excel formula.
- Totals/group headers are not included, matching the original CSV's `exportRows()` behavior. Conditional colours are not exported.

## Limits and validation
- Office Open XML, standard ZIP package; not a renamed CSV. A 29 MiB safety limit is applied, below the Microsoft Power BI 30 MB limit.
- Source: `src/sift-xlsx-export.js`. Generated XLSX samples have been checked with openpyxl for currencies, numeric types, dates, Unicode, line breaks, leading zeros and formula-safe text.
- Not yet validated in Power BI Desktop/Service. Test both download buttons and all visual interactions before production use.
- Export is limited to rows actually supplied to the visual (the Power BI data window), subject to data load and current filters.
- MIT notice and original credits retained. Stable `stable/v1.0.0.11` is unchanged.
