# Excel export diagnostic build — v1.0.0.14

## Why this release exists
The actual Power BI Service XLSX downloaded on 3 November 2026 still contains ZIP central-directory entries with only **40 bytes** of fixed metadata, exactly like our buggy v1.0.0.12 writer. The corrected writer in the GitHub v1.0.0.13 source uses the required **46 bytes**. Power BI is therefore very likely still executing a prior imported visual bundle.

The uploaded workbook was analyzed locally only. **No business data was uploaded to GitHub.** Its 6 XML parts and CRCs were intact, and rebuilding only the ZIP structure allowed openpyxl to load its 69 data rows.

## How to identify the running version
- The Excel button visibly displays **XLSX 1.0.0.14**.
- The downloaded file is **sift-table-v1.0.0.14.xlsx**, possibly prefixed by Power BI's visual ID.
- If the button still says only XLSX, or the downloaded name ends with `sift-table.xlsx` rather than `sift-table-v1.0.0.14.xlsx`, **an outdated visual bundle is still running**. Do not keep testing an old XLSX.
- An additional internal ZIP directory validation now aborts the export if its offsets or entry sizes are wrong, instead of sending Excel a broken ZIP.

## Refresh the visual package
1. Open a **copy** of your .pbix in Power BI Desktop.
2. Enable Developer mode if Power BI prompts for it, then import `SiftTable.pbiviz` from this branch using the Visualization pane's ellipsis > **Import a visual from a file**.
3. Right-click the custom visual icon in the Visualizations pane > **About** and check that the package version is 1.0.0.14.
4. Navigate to another report page and back, or reopen Power BI Desktop, to recreate the visual instance. In a test report, add a *fresh* Sift Table visual if needed, as a check for visual-instance caching.
5. Republish to Power BI Service and reopen the report (a hard refresh may be needed).
6. Confirm the toolbar button says **XLSX 1.0.0.14**, then export and open the new version-named XLSX.

If the old button persists, test a new visual instance in the copied report. Do not delete the existing working report visual before confirming the new package.

## Scope
The XLSX writer still retains dates, native numbers and text, the CSV fallback, per-column conditional formatting, and auto-height wrapped rows. The `main` and `stable/v1.0.0.11` branches remain unchanged.

Microsoft guidance: https://learn.microsoft.com/en-us/power-bi/developer/visuals/import-visual
