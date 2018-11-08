import Promise from 'bluebird';
import Download from 'fast-downloads';
import AnyExporter from 'fast-submission2any';
import FormioExport from 'formio-export';
import { Translation } from 'fast-fastjs';
import _mapValues from 'lodash/mapValues';

let Export = class {
  /**
   *
   * @param {*} param0
   */
  static async jsonTo({ fileName, output, options, data, formioForm, vm }) {
    let translations = await Export.getTranslations();
    let language = localStorage.getItem('defaultLenguage')
      ? localStorage.getItem('defaultLenguage')
      : 'en';
    let mimeType;

    if (output !== 'pdf-form') {
      var exportedFile = await AnyExporter.to({
        output,
        data: data,
        formioForm,
        translations,
        language
      });
    }

    return new Promise(async (resolve, reject) => {
      switch (output.toLowerCase()) {
        case 'csv':
          mimeType = 'text/csv;encoding:utf-8';
          break;
        case 'json':
          mimeType = 'text/json;encoding:utf-8';
          break;
        case 'xlsx-form':
        case 'pdf-form':
          let submission = {
            _id: data[0]._id,
            data: data[0],
            owner: data[0].owner ? data[0].owner : '',
            modified: ''
          };

          let exporter = new FormioExport(formioForm, submission, {
            filename: fileName + '.pdf'
          });
          let pdf = await exporter.toPdf();
          exportedFile = pdf.output('arraybuffer');
          mimeType = 'application/pdf;encoding:utf-8';
          break;
        default:
          mimeType =
            output === 'xlsx'
              ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              : 'application/octet-stream';
          break;
      }
      output = output === 'pdf-form' ? 'pdf' : output;

      let download = await Download.file({
        content: exportedFile,
        fileName: fileName + '.' + output,
        mimeType: mimeType
      });
      if (download) {
        resolve();
      }
    });
  }

  static async getTranslations() {
    let localTranslations = await Translation.local().get();
    localTranslations =
      localTranslations[0] && localTranslations[0].data
        ? localTranslations[0].data
        : {};
    localTranslations = _mapValues(localTranslations, function(language) {
      let a = language;
      language = {};
      language.translation = a;
      return language;
    });

    return localTranslations;
  }
};
export default Export;
