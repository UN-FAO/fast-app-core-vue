import XLSX from "xlsx";
import XLSXS from "xlsx-style";
import FormioUtils from "formiojs/utils";
const FormioExcel = (() => {
  function get({ data, formioForm, vm }) {
    var workbook = XLSX.utils.book_new();
    console.log('formioForm', formioForm)
    switch (formioForm.display.toLowerCase()) {
      case 'wizard':
        if (formioForm.components) {
          formioForm.components.forEach(component => {
            if (component.type === 'panel') {
              let page = component
              let excelPage = getExcelPage({ page: component })
              excelPage['A1'].s = { fill: { fgColor: { rgb: "86BC25" } } };
              console.log('excelPage', excelPage)
              excelPage['!cols'] = []
              excelPage['!cols']['A'] = {
                hidden: true
              }
              XLSX.utils.book_append_sheet(workbook, excelPage, page.title);
            }
          })
        }
        break;
      default:
        break;
    }

    var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    var wbout = XLSXS.write(workbook, wopts);
    return s2ab(wbout)
  }

  function getExcelPage({ page }) {
    let width = getPageWidth(page)
    let formattedPage = getArrayFormattedPage(page, width)
    console.log('the amount of levels is:', formattedPage)
    var ws = XLSX.utils.aoa_to_sheet([
      ['this is a well', 'this is a well', 'this is a well'],
      [0, 0, 0]
    ]);
    return ws
  }
  function getArrayFormattedPage(component, columns = 12) {
    let children = [];
    FormioUtils.eachComponent(component.components, (c) => {
      children.push(c)
    }, true)
    console.log('children', children.length)
    if (children.length > 0) {
      children.forEach(childComponent => {
        getArrayFormattedPage(childComponent)
      });
    } else {
      return getArrayFormattedComponent(component)
    }
  }

  function getArrayFormattedComponent(component) {
    console.log('component is;......', component)
    return [0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
  function getPageWidth(page, levels = 1) {
    let children = page.components
    if (children) {
      levels = levels + 1
      return getPageWidth(children, levels)
    }
    return levels
  }

  return Object.freeze({
    get
  });
})()
export default FormioExcel
