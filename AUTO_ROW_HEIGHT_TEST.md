# Automatic row heights — experimental v1.0.0.10

Branch: `feature/value-wrap`.

## Behavior

- Wrap each column using **Format > Specific column > Wrap values**.
- Every data row now receives an individual height based on the contents of visible wrapped columns and their actual widths. One-line rows stay compact. Longer comments can occupy as many lines as required.
- The old "Maximum wrapped lines" setting is removed; the text is no longer truncated.
- The virtual scrollbar is based on prefix sums of row heights, with binary-search viewport lookup and DOM-height corrections for rendered rows.
- Heights are recalculated when the table is refreshed, filtered, sorted, resized or its visible columns change.

## Manual Power BI tests

1. Import the new `SiftTable.pbiviz` into a **test** report and verify visual version 1.0.0.10.
2. Enable **Wrap values** for Comments and MM Doc Item Text. Verify each row has its own height, short rows remain compact and all text is visible.
3. Resize the wrapped columns; verify the height adapts after releasing the resize handle.
4. Scroll through many records and back; check positions, missing rows and incorrect blank spaces.
5. Verify sorting, filtering, grouping, subtotals, pinned columns, keyboard navigation and export.

## Caveats

- This is an experimental modification of compiled/minified upstream code. TypeScript source is not available in the public upstream repository.
- Power BI Desktop and Power BI Service have not been run or validated in this environment. Test before deployment.
- Group headings retain their existing fixed-height presentation; only data rows have content-responsive height.

MIT license and original credits are retained.
