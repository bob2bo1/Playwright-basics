import fs from 'fs';
import path from 'path';

export interface CsvRow {
  [key: string]: string;
}

export function readCsvFile(filePath: string): CsvRow[] {
  const absolutePath = path.resolve(__dirname, '..', filePath);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const lines = fileContent.trim().split('\n');

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map((h) => h.trim());
  const data: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
}
