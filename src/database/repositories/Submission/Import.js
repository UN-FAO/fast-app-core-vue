import Formio from "formiojs";
import { APP_URL } from "config/env";
import OFFLINE_PLUGIN from "modules/Formio/components/formio/src/offlinePlugin";
import Promise from 'bluebird'
import { Loading } from 'quasar'
import store from 'config/store'
import Auth from 'modules/Auth/api/Auth'
import _debounce from 'lodash/debounce'
import PreProcess from './importPreProcess'
// import Uploader from './Uploader'

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
    // json = json.slice(0, 3);
    Promise.each(json, async function (row, index) {
      // await Uploader.sendDataToFormIO(row)
      let submission = Import.prepareSubmission(row)
      await Import.saveSubmission(submission, formio, vm)
    }).then(() => {
      let dEmit = _debounce(Import.emitNotification, 2000)
      dEmit(vm)
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
  static async saveSubmission(submission, formio, vm) {
    let processedSubmission = PreProcess.JsonSubmission(submission)
    await store.dispatch('addSubmission', {
      formSubmission: processedSubmission,
      formio: formio,
      User: Auth.user().data
    })
  }
}

export default Import
