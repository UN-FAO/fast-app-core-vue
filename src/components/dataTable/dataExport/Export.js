import FormioUtils from 'formiojs/utils';
import _forEach from 'lodash/forEach';
import Download from 'fast-downloads';
import Promise from 'bluebird';
import flatten from 'flat';
import FormioExcel from 'libraries/formio-excel/formioExcel';
import FormioExport from 'formio-export';
import Csv from './Csv';

let Export = class {
  /**
   *
   * @param {*} param0
   */
  static async jsonTo({ output, options, data, formioForm, vm }) {
    return new Promise(async (resolve, reject) => {
      let formattedData = Export.formatSubmissions({
        output,
        data,
        formioForm,
        vm
      });
      switch (output.toLowerCase()) {
        case 'csv':
          let file = await Csv.get({ json: formattedData });
          let download = await Download.file({
            content: file.csv,
            fileName: file.name + '.' + output,
            mimeType: 'text/csv;encoding:utf-8'
          });
          if (download) {
            resolve();
          }
          break;
        case 'xlsx':
          let aoa = await Csv.get({ json: formattedData, rawArray: true });
          var ws = XLS.utils.aoa_to_sheet(aoa.result);
          var workbook = XLS.utils.book_new();
          XLS.utils.book_append_sheet(workbook, ws, 'SheetJS');
          var wopts = { bookType: output, bookSST: false, type: 'array' };
          var wbout = XLS.write(workbook, wopts);
          let excel = await Download.file({
            content: wbout,
            fileName: aoa.name + '.' + output,
            mimeType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          if (excel) {
            resolve();
          }
          break;
        case 'json':
          let name = 'backup_' + formattedData.date + '.json';
          let json = await Download.file({
            content: JSON.stringify(formattedData.data),
            fileName: name,
            mimeType: 'text/json;encoding:utf-8'
          });
          if (json) {
            resolve();
          }
          break;
        case 'xlsx-form':
          let wbOut = FormioExcel.get({ data, formioForm, vm });
          let excelDownload = await Download.file({
            content: wbOut,
            fileName: formioForm.title,
            mimeType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          if (excelDownload) {
            resolve();
          }
          break;
        case 'pdf-form':
          let submission = {
            _id: data[0]._id,
            data: data[0],
            owner: data[0].owner ? data[0].owner : '',
            modified: ''
          };

          let exporter = new FormioExport(formioForm, submission, options);
          let config = {
            download: false,
            filename: 'example.pdf'
          };

          exporter.toPdf(config).then(async (pdf) => {
            // get the datauri string
            pdf.save();
            resolve();
            /*
            let datauri = pdf.output('datauristring');
            let pdfForm = await Download.file({
              content: datauri,
              fileName: 'PDFFORM.pdf'
            });
            if (pdfForm) {
              resolve();
            }
            */
          });

          break;
        default:
          let aoaOther = await Csv.get({ json: formattedData, rawArray: true });
          var wsOther = XLS.utils.aoa_to_sheet(aoaOther.result);
          var workbookOther = XLS.utils.book_new();
          XLS.utils.book_append_sheet(workbookOther, wsOther, 'SheetJS');
          var woptsOther = { bookType: output, bookSST: false, type: 'array' };
          var wboutOther = XLS.write(workbookOther, woptsOther);
          let excelOther = await Download.file({
            content: wboutOther,
            fileName: aoaOther.name + '.' + output,
            mimeType: 'application/octet-stream'
          });
          if (excelOther) {
            resolve();
          }
          break;
      }
    });
  }

  static reCalculateValues(data, components) {
    data.forEach((d) => {
      d = d.data;
      // Check all components having calculated values
      components.forEach((c) => {
        if (c.calculateValue) {
          let newFx = Function(
            'data',
            'value',
            c.calculateValue + '; return value;'
          );
          try {
            d[c.path] = newFx(d);
          } catch (error) {
            // console.log("There is an error on one of your calculations", error)
          }
        }
      });
    });

    return data;
  }

  static formatSubmissions({ output, data, formioForm, vm }) {
    let date = new Date()
      .toJSON()
      .replace(/-/g, '_')
      .replace(/T/g, '_')
      .replace(/:/g, '_')
      .slice(0, 19);
    let json = [];
    let labels = [];

    let components = FormioUtils.findComponents(formioForm.components, {
      input: true
    });

    data = Export.reCalculateValues(data, components);

    if (!formioForm) {
      _forEach(data, function(submission) {
        delete submission.owner;
        json.push(flatten(submission));
      });
      return { date: date, data: json };
    }

    _forEach(data, function(submission) {
      delete submission.owner;
      json.push(flatten(submission));
    });

    // Get the Labels for each one of the keys and filter only the available ones.
    labels = components.reduce((labelArray, component) => {
      if (component.path.indexOf('saveasDraft') <= -1) {
        labelArray.push({
          apiKey: component.path,
          label: vm.$t(component.label)
        });
      }
      return labelArray;
    }, []);

    labels.push({
      apiKey: 'owner_email',
      label: vm.$t('Owner Email')
    });

    data = output && output === 'json' ? data : json;
    return { date: date, data: data, labels: labels };
  }
};
export default Export;
