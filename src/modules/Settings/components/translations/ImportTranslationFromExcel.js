import XlsxPopulate from 'xlsx-populate';

export default async function(file) {
  console.log(file);

  const workbook = await XlsxPopulate.fromDataAsync(file);

  console.log(workbook);
}
