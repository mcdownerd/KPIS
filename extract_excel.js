import XLSX from 'xlsx';
import fs from 'fs';

const workbook = XLSX.readFile("./KPI's 2025 .xlsx", { cellFormula: true, cellStyles: true });

const result = {};

workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    result[sheetName] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: null });

    // Also extract formulas for each cell
    const formulas = {};
    for (const cell in sheet) {
        if (sheet[cell] && sheet[cell].f) {
            formulas[cell] = sheet[cell].f;
        }
    }
    result[sheetName + "_formulas"] = formulas;
});

fs.writeFileSync('excel_data.json', JSON.stringify(result, null, 2));
console.log('Excel data extracted to excel_data.json');
