import Formio from "formiojs";
import OFFLINE_PLUGIN from "modules/Formio/components/formio/src/offlinePlugin";
import Promise from 'bluebird'
import { Loading } from 'quasar'
import PreProcess from './importPreProcess'
// import Uploader from './Uploader'
import Submission from 'libraries/fastjs/repositories/Submission/SubmissionRepository'
import Event from 'libraries/fastjs/Wrappers/Event'
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
    let formio = Import.getFormIOInstance(vm)
    Loading.show({ message: 'Importing ' + totalSubmissions + ' submissions' })
    // json = json.slice(151, 200);
    Promise.each(json, async function (row, index) {
      // await Uploader.sendDataToFormIO(row)
      let submission = Import.prepareSubmission(row)
      await Import.saveSubmission(submission, formio, vm)
    }).then(() => {
      Event.emit({ name: "FAST:DATA:IMPORTED", data: { imported: true }, text: 'Data was imported' })
    })
      .catch(error => {
        Loading.hide(error)
        vm.$swal(vm.$t("Import Error!"), vm.$t("Your submission could not be Imported. Please check the format of your Json file."), "error");
      })
  }

  static emitNotification(vm) {
    vm.$eventHub.emit("FAST-DATA_IMPORTED");
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
    let data = row.data ? row.data : row
    let formSubmission = {
      data: data,
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
        vm.form.data.path,
        undefined,
        false
      ),
      "offline"
    );
    let APP_URL = vm.$FAST_CONFIG.APP_URL
    let formUrl = APP_URL + "/" + vm.form.data.path;
    let formio = new Formio(formUrl);
    return formio
  }
  /**
   *
   * @param {*} vm
   */
  static async saveSubmission(submission, formio, vm) {
    let processedSubmission = PreProcess.JsonSubmission(submission)
    await Submission.add({ submission: processedSubmission, formio: formio })
  }
}

export default Import
