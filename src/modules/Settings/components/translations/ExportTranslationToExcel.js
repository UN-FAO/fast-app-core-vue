import { Translation } from 'fast-fastjs';
import XlsxPopulate from 'xlsx-populate';
import Download from 'fast-downloads';

const MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const buildWorkbook = (workbook, translations, languages) => {
  const sheet = workbook.sheet(0);
  let colCount = 2;
  let rowCount = 3;

  sheet.name('Translations');

  const locations = {}
  const labels = translations.label;

  for (const language of languages) {
    sheet.cell(1, colCount).value(language.code);
    const cell = sheet.cell(2, colCount);
    cell.value(language.label);
    locations[language.code] = cell.columnNumber();
    colCount = colCount + 1;
  }

  for (const label in labels) {
    sheet.cell(rowCount, 1).value(label);

    for (const code in translations) {
      if (translations[code].hasOwnProperty(label)) {
        sheet.cell(rowCount, locations[code]).value(translations[code][label]);
      }
    }

    rowCount = rowCount + 1;
  }
};

export default async function(languages) {
  let translations = await Translation.getFormTranslations();

  translations = languages ? { [languages.code]: translations[languages.code], label: translations.label } : translations;
  languages = languages ? [{ code: languages.code, label: languages.name }] : await Translation.supportedLanguages();

  const workbook = await XlsxPopulate.fromBlankAsync();

  await buildWorkbook(workbook, translations, languages);

  const blob = await workbook.outputAsync();

  await Download.file({
    content: blob,
    fileName: 'translations.xlsx',
    mimeType: MIME_TYPE
  });

  return true;
}
