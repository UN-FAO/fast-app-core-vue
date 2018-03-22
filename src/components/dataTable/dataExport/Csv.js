import jsonexport from "jsonexport";
import Papa from "papaparse";
import Promise from "bluebird"
let Csv = class {
  static async get(exported) {
    return new Promise((resolve, reject) => {
      jsonexport(exported.data, (err, csv) => {
        if (err) {
          reject(err)
          return console.log(err);
        }
        let labelsRow = [];
        let parserCsv = Papa.parse(csv);
        let columns = parserCsv.data[0];
        columns.forEach(c => {
          let newLabel = "";
          let innerLabels = c.split(".");
          innerLabels.forEach((innerLabel, idx) => {
            if (isNaN(innerLabel)) {
              let correspondingLabel = exported.labels.find(label => {
                return label.apiKey === innerLabel;
              });
              let matchingLabel =
                (correspondingLabel && correspondingLabel.label) || innerLabel;
              newLabel = newLabel + matchingLabel;
            } else {
              if (idx === innerLabels.length - 1) {
                newLabel = newLabel + "." + innerLabel;
              } else {
                newLabel = newLabel + "." + innerLabel + ".";
              }
            }
          });
          labelsRow.push(newLabel);
        });
        let newCSV = Papa.unparse(
          { fields: labelsRow, data: parserCsv.data },
          { header: true, delimiter: ";" }
        );
        let name = "backup_" + exported.date + ".csv";
        resolve({ csv: newCSV, name: name })
      });
    })
  }
}
export default Csv
