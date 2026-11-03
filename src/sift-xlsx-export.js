/* Sift Table Excel export: dependency-free Office Open XML workbook writer.
 * MIT; values are taken only from rows already delivered to this visual.
 * Output is Base64 for Power BI IDownloadService.exportVisualsContent.
 */
function siftXlsxBase64(columns, rows, pixelWidths) {
  const MAX_BYTES = 29 * 1024 * 1024;
  if (!Array.isArray(columns) || !columns.length) throw new Error('No visible columns to export.');
  if (columns.length > 16384 || rows.length >= 1048576) throw new Error('Excel worksheet size limit exceeded.');
  const xmlEscape = value => String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  const cleanText = value => String(value).slice(0, 32767);
  const xHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const columnRef = number => { let out = ''; for (let n = number + 1; n > 0; n = Math.floor((n - 1) / 26)) out = String.fromCharCode(65 + (n - 1) % 26) + out; return out; };
  const lastColumn = columnRef(columns.length - 1);
  const totalRows = rows.length + 1;
  const formatFor = column => {
    if (column.kind === 'date') return /[hHsS]/.test(column.modelFormat || '') ? 3 : 2;
    if (column.kind !== 'number') return column.settings && column.settings.wrap ? 7 : 0;
    const fmt = column.settings && column.settings.format !== 'model' ? column.settings.format : column.modelFormat || '';
    if (/percent|%/i.test(fmt)) return 5;
    if (/€|EUR/i.test(fmt)) return 4;
    if (/\$|USD/i.test(fmt)) return 6;
    return 0;
  };
  const styles = columns.map(formatFor);
  const cellXml = (value, ref, style) => {
    const attr = style ? ' s="' + style + '"' : '';
    if (value === null || value === undefined) return '';
    if (value instanceof Date) {
      if (!Number.isFinite(value.getTime())) return '';
      const t = Date.UTC(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
      const serial = (t - Date.UTC(1899, 11, 30)) / 86400000;
      return '<c r="' + ref + '" s="' + (style === 3 ? 3 : 2) + '"><v>' + serial + '</v></c>';
    }
    if (typeof value === 'number') return Number.isFinite(value) ? '<c r="' + ref + '"' + attr + '><v>' + String(value) + '</v></c>' : '';
    if (typeof value === 'boolean') return '<c r="' + ref + '" t="b"><v>' + (value ? '1' : '0') + '</v></c>';
    // Explicit inlineStr blocks formula execution, including text beginning with =,+,-,@.
    return '<c r="' + ref + '"' + attr + ' t="inlineStr"><is><t xml:space="preserve">' + xmlEscape(cleanText(value)) + '</t></is></c>';
  };
  const widthXml = columns.map((c, i) => {
    const pixels = pixelWidths && Number(pixelWidths[i]);
    const width = pixels > 0 ? Math.max(10, Math.min(72, Math.round(pixels / 7))) : Math.max(13, Math.min(60, String(c.name).length + 4));
    return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + width + '" customWidth="1"/>';
  }).join('');
  const xmlRows = ['<row r="1" ht="30" customHeight="1">' + columns.map((c, i) => cellXml(cleanText(c.name), columnRef(i) + '1', 1)).join('') + '</row>'];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    xmlRows.push('<row r="' + (i + 2) + '">' + columns.map((col, ci) => cellXml(row.cells[col.index], columnRef(ci) + (i + 2), styles[ci])).join('') + '</row>');
  }
  const sheetXml = xHeader + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<dimension ref="A1:' + lastColumn + totalRows + '"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
    '<sheetFormatPr defaultRowHeight="15"/><cols>' + widthXml + '</cols><sheetData>' + xmlRows.join('') + '</sheetData>' +
    '<autoFilter ref="A1:' + lastColumn + totalRows + '"/></worksheet>';
  const stylesXml = xHeader + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="3"><numFmt numFmtId="164" formatCode="#,##0.00 &quot;€&quot;"/><numFmt numFmtId="165" formatCode="0.0%"/><numFmt numFmtId="166" formatCode="#,##0.00 &quot;$&quot;"/></numFmts>' +
    '<fonts count="2"><font><sz val="10"/><name val="Aptos"/></font><font><b/><sz val="10"/><color rgb="FF242424"/><name val="Aptos"/></font></fonts>' +
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF4B69A"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="8">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="1" borderId="0" xfId="0" applyFill="1" applyFont="1"><alignment vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="14" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="22" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment wrapText="1" vertical="top"/></xf>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  const files = [
    ['[Content_Types].xml', xHeader + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
    ['_rels/.rels', xHeader + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml', xHeader + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sift Table" sheetId="1" r:id="rId1"/></sheets></workbook>'],
    ['xl/_rels/workbook.xml.rels', xHeader + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
    ['xl/styles.xml', stylesXml],
    ['xl/worksheets/sheet1.xml', sheetXml]
  ];
  const toUtf8 = value => {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(value);
    const result = [];
    for (const ch of value) {
      let cp = ch.codePointAt(0);
      if (cp >= 0xd800 && cp <= 0xdfff) cp = 0xfffd;
      if (cp < 0x80) result.push(cp);
      else if (cp < 0x800) result.push(0xc0 | cp >> 6, 0x80 | cp & 63);
      else if (cp < 0x10000) result.push(0xe0 | cp >> 12, 0x80 | cp >> 6 & 63, 0x80 | cp & 63);
      else result.push(0xf0 | cp >> 18, 0x80 | cp >> 12 & 63, 0x80 | cp >> 6 & 63, 0x80 | cp & 63);
    }
    return Uint8Array.from(result);
  };
  const crc32 = data => {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i];
      for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  };
  const chunks = [], central = [];
  let cursor = 0, centralSize = 0;
  const little16 = v => [v & 255, (v >>> 8) & 255];
  const little32 = v => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
  for (const [name, content] of files) {
    const n = toUtf8(name), body = toUtf8(content), size = body.length, checksum = crc32(body);
    const header = Uint8Array.from([80,75,3,4,...little16(20),...little16(0),...little16(0),...little16(0),...little16(0),...little32(checksum),...little32(size),...little32(size),...little16(n.length),...little16(0)]);
    chunks.push(header, n, body);
    const entry = Uint8Array.from([80,75,1,2,...little16(20),...little16(20),...little16(0),...little16(0),...little16(0),...little16(0),...little32(checksum),...little32(size),...little32(size),...little16(n.length),...little16(0),...little16(0),...little16(0),...little16(0),...little32(0),...little32(cursor)]);
    central.push(entry, n);centralSize += entry.length + n.length;
    cursor += header.length + n.length + size;
    if (cursor + centralSize > MAX_BYTES) throw new Error('Excel file exceeds the Power BI download limit (30 MB). Try filtering the table.');
  }
  const tail = Uint8Array.from([80,75,5,6,...little16(0),...little16(0),...little16(files.length),...little16(files.length),...little32(centralSize),...little32(cursor),...little16(0)]);
  const total = cursor + centralSize + tail.length;
  if (total > MAX_BYTES) throw new Error('Excel file is too large for Power BI (30 MB).');
  const zip = new Uint8Array(total);
  let offset = 0;
  for (const chunk of [...chunks, ...central, tail]) { zip.set(chunk, offset); offset += chunk.length; }
  // Validate the completed central directory before returning any Excel file.
  // A malformed ZIP may otherwise be silently "repaired" by Microsoft Excel.
  const read16 = i => zip[i] | zip[i + 1] << 8;
  const read32 = i => (zip[i] | zip[i + 1] << 8 | zip[i + 2] << 16 | zip[i + 3] << 24) >>> 0;
  let directoryPosition = cursor;
  for (let i = 0; i < files.length; i++) {
    if (read32(directoryPosition) !== 0x02014b50) throw new Error('Invalid Excel ZIP directory entry.');
    const nameLen = read16(directoryPosition + 28);
    const extraLen = read16(directoryPosition + 30);
    const commentLen = read16(directoryPosition + 32);
    const localOffset = read32(directoryPosition + 42);
    if (localOffset >= cursor || read32(localOffset) !== 0x04034b50) throw new Error('Invalid Excel ZIP file offset.');
    directoryPosition += 46 + nameLen + extraLen + commentLen;
  }
  if (directoryPosition !== cursor + centralSize) throw new Error('Invalid Excel ZIP directory size.');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const segments = [];
  let segment = '';
  for (let i = 0; i < zip.length; i += 3) {
    const x = (zip[i] << 16) | ((zip[i + 1] || 0) << 8) | (zip[i + 2] || 0);
    segment += alphabet[(x >>> 18) & 63] + alphabet[(x >>> 12) & 63] + (i + 1 < zip.length ? alphabet[(x >>> 6) & 63] : '=') + (i + 2 < zip.length ? alphabet[x & 63] : '=');
    if (segment.length >= 8192) { segments.push(segment); segment = ''; }
  }
  segments.push(segment);
  return segments.join('');
}
if (typeof module !== 'undefined' && module.exports) module.exports = siftXlsxBase64;
