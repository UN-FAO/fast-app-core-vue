import XlsxPopulate from 'xlsx-populate';
import { Translation } from 'fast-fastjs';
import isEqual from 'lodash.isequal';

export default async function(file) {
  const workbook = await XlsxPopulate.fromDataAsync(file);
  const sheet = workbook.sheet(0);
  const usedCols = sheet.usedRange()._numColumns;
  const usedRows = sheet.usedRange()._numRows;
  const remoteTranslations = await Translation.remote().limit(99999).get();
  
  for (let i = 3; i <= usedRows; i += 1) {
    const translations = {};
    const label = String(sheet.column(1).cell(i).value());
    translations['label'] = label;

    for (let j = 2; j <= usedCols; j += 1) {
      if (sheet.column(j).cell(i).value() !== undefined) {
        translations[sheet.column(j).cell(1).value()] = String(sheet.column(j).cell(i).value());
      }
    }

    const previousTranslation = remoteTranslations.find(element => element.data.label === label);

    if (previousTranslation !== undefined && !isEqual(previousTranslation.data, translations)) {
      await Translation.updateLabel(label, translations);
    }
  }
}
