import FormioUtils from "formiojs/utils";
import _forEach from "lodash/forEach";
import Download from './Download'
import Promise from "bluebird";
import flatten from "flat";
import FormioExcel from "libraries/formio-excel/formioExcel";
import XLSX from "xlsx";
import Csv from "./Csv";

let Export = class {
  /**
   *
   * @param {*} param0
   */
  static async jsonTo({ output, options, data, formioForm, vm }) {
    return new Promise(async (resolve, reject) => {
      let formattedData = Export.formatSubmissions({ output, data, formioForm, vm })
      switch (output.toLowerCase()) {
        case 'csv':
          let file = await Csv.get({ json: formattedData })
          let download = await Download.file({ content: file.csv, fileName: file.name + '.' + output, mimeType: "text/csv;encoding:utf-8" });
          if (download) {
            resolve()
          }
          break;
        case 'xlsx':
          let aoa = await Csv.get({ json: formattedData, rawArray: true })
          var ws = XLSX.utils.aoa_to_sheet(aoa.result);
          var workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, ws, "SheetJS");
          var wopts = { bookType: output, bookSST: false, type: 'array' };
          var wbout = XLSX.write(workbook, wopts);
          let excel = await Download.file({ content: wbout, fileName: aoa.name + '.' + output, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          if (excel) {
            resolve()
          }
          break;
        case 'json':
          let name = "backup_" + formattedData.date + ".json";
          let json = await Download.file({ content: JSON.stringify(formattedData.data), fileName: name, mimeType: "text/json;encoding:utf-8" });
          if (json) {
            resolve()
          }
          break;
        case 'xlsx-form':
          let wbOut = FormioExcel.get({ data, formioForm, vm })
          let excelDownload = await Download.file({ content: wbOut, fileName: formioForm.title, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          if (excelDownload) {
            resolve()
          }
          break;
        default:
          let aoaOther = await Csv.get({ json: formattedData, rawArray: true })
          var wsOther = XLSX.utils.aoa_to_sheet(aoaOther.result);
          var workbookOther = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbookOther, wsOther, "SheetJS");
          var woptsOther = { bookType: output, bookSST: false, type: 'array' };
          var wboutOther = XLSX.write(workbookOther, woptsOther);
          let excelOther = await Download.file({ content: wboutOther, fileName: aoaOther.name + '.' + output, mimeType: "application/octet-stream" });
          if (excelOther) {
            resolve()
          }
          break;
      }
    })
  }

  static reCalculateValues(data, components) {
    data.forEach(d => {
      d = d.data
      // Check all components having calculated values
      components.forEach(c => {
        if (c.calculateValue) {
          let newFx = Function("data", "value", c.calculateValue + "; return value;")
          try {
            d[c.path] = newFx(d)
          }
          catch (error) {
            // console.log("There is an error on one of your calculations", error)
          }
        }
      })
    })

    return data
  }

  static formatSubmissions({ output, data, formioForm, vm }) {
    let date = new Date()
      .toJSON()
      .replace(/-/g, "_")
      .replace(/T/g, "_")
      .replace(/:/g, "_")
      .slice(0, 19);
    let json = [];
    let labels = [];

    let components = FormioUtils.findComponents(formioForm.components, { input: true })

    data = Export.reCalculateValues(data, components)

    if (!formioForm) {
      _forEach(data, function (submission) {
        json.push(flatten(submission));
      });
      return { date: date, data: json };
    }

    _forEach(data, function (submission) {
      json.push(flatten(submission));
    });

    // Get the Labels for each one of the keys and filter only the available ones.
    labels = components.reduce((labelArray, component) => {
      if (component.path.indexOf('saveasDraft') <= -1) {
        labelArray.push({ apiKey: component.path, label: vm.$t(component.label) })
      }
      return labelArray
    }, [])

    data = output && output === "csv" ? json : data;

    return { date: date, data: data, labels: labels };
  }
}
export default Export
