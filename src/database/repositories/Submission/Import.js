import Formio from "formiojs";
import { APP_URL } from "config/env";
import OFFLINE_PLUGIN from "modules/Formio/components/formio/src/offlinePlugin";
import Promise from 'bluebird'
import { Loading } from 'quasar'

let Import = class {
  /**
   *
   * @param {*} file
   * @param {*} vm
   */
  static fromJsonFile(file, vm) {
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        let json;
        try {
          json = JSON.parse(e.target.result);
        } catch (ex) {
          throw new Error("The Json file could not be parsed");
        }
        Import.parseJson(json, vm)
      };
    })(file);
    reader.readAsText(file);
  }
  /**
   *
   * @param {*} json
   * @param {*} vm
   */
  static async parseJson(json, vm) {
    let totalSubmissions = json.length
    Loading.show({ message: 'Importing ' + totalSubmissions + ' submissions' })
    Promise.each(json, async function (row, index) {
      Loading.show({ message: 'Importing submission ' + (index + 1) + ' out of ' + totalSubmissions })
      let submission = Import.prepareSubmission(row)
      await Import.saveSubmission(submission, vm)
    }).then(() => {
      Loading.hide()
    })
  }
  /**
   *
   * @param {*} row
   */
  static prepareSubmission(row) {
    if (row.id || row._id) {
      delete row.id;
      delete row._id;
    }
    let formSubmission = {
      data: row,
      redirect: false,
      syncError: false,
      draft: true,
      trigger: "importSubmission"
    };
    return formSubmission
  }
  /**
   *
   * @param {*} vm
   */
  static getFormIOInstance(vm) {
    Formio.deregisterPlugin("offline");
    Formio.registerPlugin(
      OFFLINE_PLUGIN.getPlugin(
        vm.currentForm.data.path,
        undefined,
        false,
        vm.$eventHub
      ),
      "offline"
    );
    let formUrl = APP_URL + "/" + vm.currentForm.data.path;
    let formio = new Formio(formUrl);
    return formio
  }
  /**
   *
   * @param {*} vm
   */
  static async saveSubmission(submission, vm) {
    let formio = Import.getFormIOInstance(vm)
    formio.saveSubmission(submission, vm);
    return new Promise((resolve, reject) => {
      vm.$eventHub.on("FAST-DATA_IMPORTED", () => {
        resolve()
      })
    })
  }
}

export default Import
