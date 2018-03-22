import _flattenDeep from "lodash/flattenDeep";
import FormioUtils from "formiojs/utils";
import _forEach from "lodash/forEach";
import Download from './Download'
import flatten from "flat";
import Csv from "./Csv";
import Promise from "bluebird";
let Export = class {
  static async jsonTo({ output, data, formioForm, vm }) {
    return new Promise(async (resolve, reject) => {
      let formattedData = Export.formatSubmissions({ output, data, formioForm, vm })
      switch (output.toLowerCase()) {
        case 'csv':
          let file = await Csv.get(formattedData)
          let download = await Download.file({ content: file.csv, fileName: file.name, mimeType: "text/csv;encoding:utf-8" });
          if (download) {
            resolve()
          }
          break;
        case 'json':

          break;
        default:
          break;
      }
    })
  }

  static formatSubmissions({ output, data, formioForm, vm }) {
    let json = [];
    let labels = [];
    let allKeys = [];
    let date = new Date()
      .toJSON()
      .replace(/-/g, "_")
      .replace(/T/g, "_")
      .replace(/:/g, "_")
      .slice(0, 19);

    if (!formioForm) {
      _forEach(data, function (submission) {
        json.push(flatten(submission.data));
      });
      return { date: date, data: json };
    }
    _forEach(data, function (submission) {
      let record = submission.data;
      record.id = submission._id;
      json.push(flatten(record));
      allKeys.push(Object.keys(record));
    });

    allKeys = Array.from(new Set(_flattenDeep(allKeys)));

    allKeys.forEach(key => {
      let component = FormioUtils.getComponent(
        formioForm.components,
        key
      );

      let label = component ? component.label : null;
      if (label) {
        labels.push({ apiKey: key, label: vm.$t(label) });
      }
    });

    data = output && output === "csv" ? json : data;

    return { date: date, data: data, labels: labels };
  }
}
export default Export
