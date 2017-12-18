<template>
    <div>
        <div ref="formIO" class="formContainer">
        </div>
    </div>
</template>
<script>
import _debounce from "lodash/debounce";
import _isEmpty from "lodash/isEmpty";
import _cloneDeep from "lodash/cloneDeep";
import _map from "lodash/map";
import Formio from "formiojs";
import FormioForm from "formiojs/form";
import FormioWizard from "formiojs/wizard";
import FormioUtils from "formiojs/utils";
import OFFLINE_PLUGIN from "./src/offlinePlugin";
import GPS from "./src/gps";
import Lenguage from "./src/lenguage";
// import SMS from './src/sms'

export default {
  name: "formio",
  props: {
    formioURL: {
      required: true
    },
    submission: {
      required: false
    },
    hashField: {
      required: false
    },
    formioToken: {
      required: false
    },
    localDraft: {
      required: false
    },
    readOnly: {
      required: false
    }
  },
  mounted() {
    Formio.setToken(this.formioToken);
    Lenguage.listen(this);
    GPS.listen(this);
    // SMS.listen(this)
    document.addEventListener("saveAsDraft", this.saveAsLocalDraft);
    this.save = _debounce(this.save, 100);
    this.renderForm();
  },
  beforeDestroy() {
    Lenguage.off(this);
    document.removeEventListener("saveAsDraft", this.saveAsLocalDraft);
  },
  data: () => {
    return {
      formIO: null,
      jsonForm: null,
      jsonSubmission: undefined,
      offlineModePlugin: null,
      loading: true,
      saved: false,
      removedValues: []
    };
  },
  watch: {
    submission: function(value) {
      this.jsonSubmission = value;
      this.renderForm();
    },
    language: function() {
      this.renderForm();
    }
  },
  computed: {
    formId() {
      return this.formioURL.split("/").pop();
    },
    baseURL() {
      return "https://" + this.formioURL.split("/")[2] + "/";
    },
    formioPath() {
      return this.jsonForm ? this.jsonForm.path : "";
    }
  },
  methods: {
    /**
         * Refresh when pulled Down
         * @return {[type]} [description]
         */
    refreshForm() {
      this.renderForm();
    },
    triggerDestroy() {
      this.$destroy();
    },
    /**
         * [renderForm description]
         * @return {[type]} [description]
         */
    renderForm() {
      if (this.submission && this.submission.data !== "register") {
        this.jsonSubmission = this.submission;
      }
      let submissionNotLoaded =
        this.jsonSubmission &&
        typeof this.jsonSubmission === "undefined" &&
        this.jsonSubmission.data !== "register";
      // Wait until submission is present (if needed)
      if (submissionNotLoaded) {
        return;
      }
      // Offline plugin functionallity
      this.registerOfflinePlugin();
      // Solving problem of multiple classes added to the element
      // YES! its a pork around
      let x = document.getElementsByClassName("formio-form");
      [].forEach.call(x, function(el) {
        el.classList.remove("formio-form");
        el.classList.add("formio-form");
      });
      this.mountFormIOForm();
    },
    /**
         * [loadExternalResources description]
         * @param  {[type]} Components [description]
         * @return {[type]}            [description]
         */
    loadExternalResources(Components) {
      // return OFFLINE_PLUGIN.externalResources(Components)
    },
    /**
         * [setTranslations description]
         * @param {[type]} Components [description]
         */
    setTranslations(Components) {
      let comps = FormioUtils.findComponents(Components, {
        tag: "p"
      });
      _map(comps, comp => {
        if (this.$t(comp.content) !== comp.content) {
          comp.content = this.$t(comp.content);
        }
      });
      return Components;
    },
    /**
     * [getCurrentForm description]
     * @return {[type]} [description]
     */
    getCurrentForm() {
      return this.jsonForm;
    },
    /**
      * [registerOfflinePlugin description]
      * @return {[type]} [description]
      */
    registerOfflinePlugin() {
      // Get the Plugin
      this.offlineModePlugin = OFFLINE_PLUGIN.getPlugin(
        this.formId,
        this.getCurrentForm,
        this.storeForm,
        this.hashField,
        false,
        this.$eventHub
      );
      // De register if there was a previous registration
      Formio.deregisterPlugin("offline");
      // Register the plugin for offline mode
      Formio.registerPlugin(this.offlineModePlugin, "offline");
    },
    /**
     * [saveAsDraft description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    saveAsLocalDraft(e) {
      let formSubmission = {
        data: this.getCurrentData(),
        redirect: true,
        draft: true,
        syncError: false,
        trigger: "saveAsLocalDraft"
      };
      this.save(formSubmission);
      this.$swal(
        "Draft Saved!",
        "Your submission has been saved! You can continue editing later",
        "success"
      );
    },
    getCurrentData() {
      return this.formIO.data;
    },
    /**
     * [autoSaveAsDraft description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    autoSaveAsDraft() {
      let formSubmission = {
        data: this.getCurrentData(),
        redirect: false,
        draft: true,
        syncError: false,
        trigger: "autoSaveAsDraft"
      };
      this.save(formSubmission);
    },
    /**
     * [removeDuplicatedPagination description]
     * @return {[type]} [description]
     */
    removeDuplicatedPagination() {
      let x = document.getElementsByClassName("pagination");
      [].forEach.call(x, function(el, index) {
        if (index !== x.length - 1) {
          el.remove();
        }
      });
    },
    /**
     * [createLocalDraft description]
     * @return {[type]} [description]
     */
    createLocalDraft() {
      let formSubmission = {
        data: this.getCurrentData(),
        redirect: "Update",
        draft: true,
        trigger: "createLocalDraft"
      };
      this.save(formSubmission);
    },
    /**
     * [save description]
     * @param  {[type]} formSubmission [description]
     * @return {[type]}                [description]
     */
    save(formSubmission) {
      if (this.jsonSubmission) {
        formSubmission._id = this.jsonSubmission.data._id
          ? this.jsonSubmission.data._id
          : this.jsonSubmission._id;
      }
      let formio = new Formio(this.formioURL);
      formio.saveSubmission(formSubmission);
    },
    /**
     * [setSubmission description]
     * @param {[type]} savedSubmission [description]
     */
    setSubmission(onlineJsonForm, savedSubmission) {
      this.formIO.submission =
        this.jsonSubmission &&
        this.jsonSubmission.data &&
        this.jsonSubmission.data.data
          ? { data: this.jsonSubmission.data.data }
          : { data: {} };
      // If we are creating a wizard
      if (onlineJsonForm.display === "wizard") {
        this.formIO.data =
          this.jsonSubmission &&
          this.jsonSubmission.data &&
          this.jsonSubmission.data.data
            ? this.jsonSubmission.data.data
            : {};
      } else {
        // If we have a savedSubmission (Staying on the same page after submit)
        this.formIO.submission = savedSubmission
          ? { data: savedSubmission.data }
          : this.formIO.submission;
      }
    },
    /**
     * [createFormioInstance description]
     * @param  {[type]} onlineJsonForm [description]
     * @param  {[type]} translations   [description]
     * @return {[type]}                [description]
     */
    createFormioInstance(onlineJsonForm, translations) {
      let readOnly = this.readOnly;
      // Create the formIOForm Instance (Renderer)
      if (onlineJsonForm.display === "wizard") {
        if (_isEmpty(this.formIO)) {
          translations.readOnly = readOnly;
          this.formIO = new FormioWizard(this.$refs.formIO, translations);
        }
      } else {
        if (_isEmpty(this.formIO)) {
          translations.readOnly = readOnly;
          this.formIO = new FormioForm(this.$refs.formIO, translations);
        }
      }
    },
    /**
      * [mountFormIOForm description]
      * @return {[type]} [description]
      */
    async mountFormIOForm(savedSubmission) {
      // Optional parameter (If we want to stay on
      // the same page after submission)
      savedSubmission = savedSubmission || null;

      // Create FormIOJS plugin instace (Manipulation)
      let formio = new Formio(this.formioURL);

      formio.loadForm().then(async onlineJsonForm => {
        let translations = await OFFLINE_PLUGIN.getLocalTranslations();

        this.createFormioInstance(onlineJsonForm, translations);
        // If we are creating a new record triggers the creation
        // to go directly to edit (an have autosave functionality)
        if (
          this.jsonSubmission &&
          this.jsonSubmission.data === false &&
          this.$route.name === "formio_form_submission"
        ) {
          this.createLocalDraft();
          return;
        }
        // Set Submission if we are Updating
        this.setSubmission(onlineJsonForm, savedSubmission);

        // Clone the original object to avoid changes
        let cloneJsonForm = _cloneDeep(onlineJsonForm);

        // Load data stored locally
        cloneJsonForm.components = this.loadExternalResources(
          onlineJsonForm.components
        );

        // Translate the form
        cloneJsonForm.components = this.setTranslations(
          _cloneDeep(onlineJsonForm.components)
        );

        let components = FormioUtils.findComponents(cloneJsonForm.components, {
          input: true,
          type: "number"
        });

        _map(components, function(c) {
          c.defaultValue = "default";
        });

        // Define the form to display
        this.formIO.setForm(cloneJsonForm);

        // When the submission has been added the form is mounted
        this.$eventHub.$emit("formio.mounted", this.formIO);

        this.formIO.language = localStorage.getItem("defaultLenguage")
          ? localStorage.getItem("defaultLenguage")
          : "en";

        // Define all the Listeners for the different FORM.io Events
        let events = this.formIO.eventListeners;

        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === "formio.render").length < 1) {
          this.formIO.on("render", render => {
            this.loading = false;
            this.$eventHub.$emit("formio.render", {
              render: render,
              formio: this.formIO
            });
          });
        }

        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === "formio.error").length < 1) {
          this.formIO.on("error", error => {
            this.$eventHub.$emit("formio.error", {
              error: error,
              formio: this.formIO
            });
          });
        }
        let timeoutId;

        this.formIO.on("change", change => {
          this.removeDuplicatedPagination();
          if (this.localDraft) {
            this.saved = false;
            var draftStatus = new CustomEvent("draftStatus", {
              detail: { data: false, text: "Draft not Saved" }
            });
            document.dispatchEvent(draftStatus);
            // AutoSave functionality
            // If a timer was already started, clear it.
            if (timeoutId) clearTimeout(timeoutId);

            // Set timer that will save comment when it fires.
            timeoutId = setTimeout(() => {
              this.autoSaveAsDraft();
              this.saved = true;
            }, 700);
          }
          this.$eventHub.$emit("formio.change", {
            change: change,
            formio: this.formIO
          });
        });

        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === "formio.nextPage").length < 1) {
          this.formIO.on("nextPage", nextPage => {
            this.$eventHub.$emit("formio.nextPage", {
              nextPage: nextPage,
              formio: this.formIO
            });
          });
        }

        // Add error event listener only if we do not have it
        if (events.filter(e => e.type === "formio.prevPage").length < 1) {
          this.formIO.on("prevPage", prevPage => {
            this.$eventHub.$emit("formio.prevPage", {
              prevPage: prevPage,
              formio: this.formIO
            });
          });
        }

        // Ad submit event listener only if its not present before
        if (events.filter(e => e.type === "formio.submit").length < 1) {
          /**
           * This function manages how the form is
           * submitted for Offline behaivor
           * @param  {[type]} 'submit'    [description]
           * @param  {[type]} (submission [description]
           * @return {[type]}             [description]
           */
          this.formIO.on("submit", submission => {
            this.$swal({
              title: "Are you sure?",
              text:
                "Submission will be sent when Online. The previous data collected for this submission will be updated",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, send it!"
            }).then(async () => {
              let formSubmission = {
                data: this.getCurrentData()
              };
              formSubmission.draft = false;
              formSubmission.redirect = true;
              formSubmission.trigger = "formioSubmit";
              formSubmission.syncError = false;
              this.save(formSubmission);
              this.$swal("Sent!", "Your submission has been sent!", "success");
            });
          });
        }
      });
    }
  }
};
</script>
