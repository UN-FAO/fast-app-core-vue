import FormioUtils from "formiojs/utils";
import _forEach from "lodash/forEach";
import Download from './Download'
import Promise from "bluebird";
import flatten from "flat";
import Csv from "./Csv";

let Export = class {
  /**
   *
   * @param {*} param0
   */
  static async jsonTo({ output, data, formioForm, vm }) {
    return new Promise(async (resolve, reject) => {
      let formattedData = Export.formatSubmissions({ output, data, formioForm, vm })
      console.log('formattedData', formattedData.labels)
      switch (output.toLowerCase()) {
        case 'csv':
          let file = await Csv.get({ json: formattedData })
          let download = await Download.file({ content: file.csv, fileName: file.name, mimeType: "text/csv;encoding:utf-8" });
          if (download) {
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
        default:
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
          let newFx = Function("data", "value", c.calculateValue + "return value;")
          try {
            d[c.path] = newFx(d)
          }
          catch (error) {
            console.log("There is an error on one of your calculations", error)
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
        json.push(flatten(submission.data));
      });
      return { date: date, data: json };
    }

    _forEach(data, function (submission) {
      let record = submission.data;
      record.id = submission._id;
      json.push(flatten(record));
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
