/** MicroVault Global Mini Checker — local only; no network, uploads or analytics. */
export function analyzeCsv(text, maxRows = 50000) {
  if (typeof text !== "string" || !text.trim()) throw new Error("Choose a non-empty CSV file.");
  let bytes = 0;
  for (const char of text) {
    const cp = char.codePointAt(0);
    bytes += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
    if (bytes > 2097152) throw new Error("The CSV file exceeds the 2 MB limit.");
  }
  const clean = text.replace(/^\uFEFF/, "");
  if (clean.includes("\0")) throw new Error("This appears to be a binary file, not a CSV.");
  let inQuotes = false;
  const candidateCounts = { ",": 0, ";": 0, "\t": 0 };
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (ch === '"') {
      if (inQuotes && clean[i+1] === '"') { i++; continue; }
      inQuotes = !inQuotes;
    }
    if (!inQuotes && (ch === "\n" || ch === "\r")) break;
    if (!inQuotes && Object.prototype.hasOwnProperty.call(candidateCounts,ch)) candidateCounts[ch]++;
    if (i > 50000) break;
  }
  let delimiter = Object.entries(candidateCounts).sort((a,b) => b[1]-a[1])[0][0];
  if (candidateCounts[delimiter] === 0) delimiter = ",";
  const rows = [], current = [];
  let value = "", quoted = false, atStart = true;
  const pushRecord = () => {
    current.push(value);
    if (current.some(s => s.length) || rows.length === 0) {
      if (rows.length > maxRows) throw new Error("Too many CSV rows. Use a file with up to 50,000 data rows.");
      rows.push([...current]);
    }
    current.length = 0; value = ""; atStart = true;
  };
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (quoted) {
      if (ch === '"') {
        if (clean[i+1] === '"') { value += '"'; i++; }
        else quoted = false;
      } else value += ch;
    } else if (ch === '"' && atStart) { quoted = true; atStart = false; }
    else if (ch === delimiter) { current.push(value); value = ""; atStart = true; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && clean[i+1] === "\n") i++;
      pushRecord();
    } else if (ch === '"' && !atStart) {
      throw new Error("Invalid quote inside an unquoted CSV field.");
    } else { value += ch; atStart = false; }
  }
  if (quoted) throw new Error("The CSV contains an unclosed quoted field.");
  if (current.length || value.length) pushRecord();
  if (!rows.length || rows[0].length < 1) throw new Error("The CSV does not contain a header.");
  const headers = rows[0];
  const records = rows.slice(1);
  if (!records.length) throw new Error("The CSV needs at least one data row.");
  const seen = new Map();
  let missing = 0, duplicates = 0, widthWarnings = 0;
  const flaggedRows = [], previewMissing = [];
  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    if (row.length !== headers.length) widthWarnings++;
    for (let j=0; j < headers.length; j++) {
      if ((row[j] ?? "").trim() === "") {
        missing++;
        if (previewMissing.length < 12) previewMissing.push({ row: i + 2, column: j + 1 });
      }
    }
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      duplicates++;
      if (flaggedRows.length < 20) flaggedRows.push({ row: i + 2, matches: seen.get(key) });
    } else seen.set(key,i+2);
  }
  return {
    rows: records.length, columns: headers.length, missingCells: missing,
    identicalExtraRows: duplicates, irregularWidthRows: widthWarnings,
    delimiter: delimiter === "\t" ? "tab" : delimiter === ";" ? "semicolon" : "comma",
    duplicateExamples: flaggedRows, missingExamples: previewMissing,
    notes: [
      "Exact duplicate rows are indicators, not proof of duplicate orders or erroneous payments.",
      "This overview includes no original CSV field values.",
      "Manual verification is required before editing business records."
    ]
  };
}
