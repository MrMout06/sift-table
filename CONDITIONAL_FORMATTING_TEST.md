# Conditional formatting — experimental Sift Table v1.0.0.11

## How to use
1. Import `SiftTable.pbiviz` from the `feature/value-wrap` branch into a **test** Power BI report.
2. Add the value or measure to **Columns**. A measure used only as a colour source must still be present in that field well; you can hide its displayed column using Sift Table's column visibility controls.
3. Select the table, open **Format > Specific column**, and select the **target column**.
4. Choose **Background formatting** or **Text formatting**:
   - **Off**: no new conditional formatting.
   - **Field value (HEX)**: select **Based on**, which must return a text colour such as `#FCE8E6`. DAX measures are supported if added to Columns.
   - **Rules**: select a source field or measure, then configure **Rule 1** and optionally **Rule 2** with an operator, value and colour.
5. Configure background and text independently. The **first matching rule wins**. When there is no match, the original style is retained.

## Operators
Equals, Does not equal, Greater than, Greater than or equal, Less than, Less than or equal, Contains text, Starts with, Is blank and Is not blank.

Numeric comparison uses the **underlying number**. For a percentage measure, 75% means a rule value of `0.75`, not `75`. Dates should use `YYYY-MM-DD`. Text comparisons ignore case.

## Examples
- A **Comments** column: Background rules based on Comments: *Contains text* `Recall` -> light red; *Contains text* `NPD` -> light yellow.
- A **Scrap €** column: Background rule based on the numeric measure **[Scrap amount]**, **Greater than or equal** `1000`, colour `#FCE8E6`.
- A **Material Description** column: **Text formatting** = Field value (HEX), source **[Text colour DAX]**.

## Limits and compatibility
- Two ordered rules per channel (background and text); each can use the displayed value or another added column/measure.
- The existing **Colour from field** option still works. New background/text settings override the corresponding colour when they match.
- Group headers and the grand total retain their native styling; rules apply to data cells, not to subtotal/grand-total recalculation.
- This is a custom UI implemented inside the visual, **not** the Power BI native `fx` dialogue.
- It has not been executed inside Power BI Desktop or Service. Test formatting, row-height wrapping, filters, sorting, hidden measure sources, and scrolling before production use.
- The upstream project provides compiled JavaScript, not TypeScript source. MIT copyright/credit remains preserved.
