# Fix XLSX Excel recovery warning — v1.0.0.13

The v1.0.0.12 workbook generator emitted a malformed ZIP central directory: every directory entry lacked the 2-byte internal attributes and 4-byte external attributes fields. Consequently, the local file offset was written at the wrong position. Some Excel installations recovered the workbook but displayed a repair warning.

Version 1.0.0.13 adds those 6 missing bytes per entry, restores the proper 46-byte central directory header and keeps the existing XLSX contents unchanged. Test with `node tests/xlsx-archive.test.cjs`.

A defective sample reproduced the issue using Python `zipfile` and `openpyxl` (both rejected the ZIP). With the correction, ZIP integrity tests passed and `openpyxl` successfully read native numeric, currency, date, leading-zero text and multiline values. Microsoft Excel Desktop still needs confirmation on a freshly exported XLSX in Power BI Service.

Version `stable/v1.0.0.11` is not modified.
