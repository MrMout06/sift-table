# Word wrapping — experimental fork build

Version: **1.0.0.9** (fork-only), branch `feature/value-wrap`.

## Configure

1. Import the branch's `SiftTable.pbiviz` file into a **test** Power BI report.
2. Choose the Sift Table visual, open **Format > Specific column**.
3. Select a column (for example `Comments`) and enable **Wrap values**.
4. Open **Format > Values** and set **Maximum wrapped lines (1-8)** (default: 3).

## Design constraints

- Rows have a common height when at least one visible column has wrapping enabled. The height is increased to accommodate the configured maximum line count; it is **not** independently auto-sized per row.
- Text longer than that maximum is clamped. A consistent row height preserves the original virtual-scroll position calculations.
- All original columns default to wrapping disabled, so existing layouts retain their original density.
- This fork modifies a compiled, minified JavaScript bundle because the upstream repository does not include the TypeScript source.
- **Not validated in Power BI Desktop/Service yet.** Test selection, sorting, column resizing, virtual scrolling, totals and filters before production deployment.

MIT license and original credits are retained.
