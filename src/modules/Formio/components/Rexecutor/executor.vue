<template>
  <div
    style='font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace !important;'
  >Write your custom R script
    <editor v-model="content" @init="editorInit" lang="r" theme="chrome" width="100%" height="50vh"></editor>

    <q-btn loader @click="executeScript">Execute script
      <!--
                      Notice slot="loading". This is optional.
                      If missing, the default theme spinner will be used.
      -->
      <span slot="loading">Loading...</span>
    </q-btn>
    <q-btn @click="stdout = ''; valout=''; consoleout=''">Clear output</q-btn>
    <q-btn color="primary" @click="submitForm">Submit</q-btn>
    <q-input :min-rows="5" v-model="stdout" disable type="textarea" float-label="Std Output"/>
    <q-input :min-rows="5" v-model="valout" disable type="textarea" float-label="Value Output"/>
    <q-input
      :min-rows="5"
      v-model="consoleout"
      disable
      type="textarea"
      float-label="Console Output"
    />
  </div>
</template>
<script>
import { QBtn, QInput } from "quasar";
import { Event } from "fast-fastjs";
import RExecutor from './Rexecutor';

export default {
  name: "rexecutor",
  components: {
    QBtn,
    QInput,
    editor: require("vue2-ace-editor")
  },
  props: {
    submission: {
      required: true
    },
    openCpuUrl: {
      required: true
    },
    formioUrl: {
      required: true
    },
    token: {
      required: true
    }
  },
  watch: {
    openCpuUrl: function(url) {},
    formioUrl: function(url) {},
    token: function(url) {},
    submission: function(submission) {
      if (submission) {
        let data = JSON.parse(submission);
        this.onSubmissionChange(data);
      }
    }
  },
  data() {
    return {
      content: "",
      response: null,
      stdout: null,
      valout: null,
      consoleout: null,
      firstLoad: true
    };
  },
  methods: {
    submitForm() {
      Event.emit({
        name: "FAST:SUBMISSION:SUBMIT",
        data: {
          isScript: true,
          script: this.getUserTypedScript(),
          field: "script"
        },
        text: "Submitting"
      });
    },
    editorInit: function() {
      require("brace/ext/language_tools"); // language extension prerequsite...
      require("brace/mode/r");
      require("brace/snippets/r");
      require("brace/theme/chrome");
    },
    onSubmissionChange(data) {
      let variables = data.variables;

      let rScript = this.getInitialText();
      if (variables) {
        variables.forEach(variable => {
          if (variable.name && variable.path && variable.name !== "") {
            let fullUrl =
              "'" + this.formioUrl + "/" + variable.path + "/submission'";
            rScript = rScript + variable.name + "_url <- " + fullUrl + " ; \n";
          }
        });
      }
      rScript = rScript + this.getExampleText();

      if (this.firstLoad && data.script) {
        this.content = rScript + data.script;
        this.firstLoad = false;
      } else {
        this.content = rScript + this.getUserTypedScript();
      }
    },
    getInitialText() {
      return RExecutor.getInitialText();
    },
    getExampleText() {
      return RExecutor.getExampleText();
    },
    getFullScript() {
      return RExecutor.getFullScript({
        token: this.token,
        submission: this.submission,
        formioUrl: this.formioUrl,
        content: this.content
      });
    },
    getUserTypedScript() {
      return this.content.substring(
        this.content.indexOf("!!#") + 4,
        this.content.length
      );
    },
    async executeScript() {
      const { stdout, valout, consoleout } = await RExecutor.executeScript({
        fullScript: this.getFullScript(),
        openCpuUrl: this.openCpuUrl
      });

      this.stdout = stdout;
      this.valout = valout;
      this.consoleout = consoleout;
    }
  }
};
</script>
