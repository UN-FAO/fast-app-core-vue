<template>
  <div class="row" style="background:#f3f3f5">
    <div>
      <q-card color="white" style="bottom: unset;margin-top: 30px;" class="col-lg-10 col-lg-offset-1 col-md-offset-1 col-md-10 col-sm-10 col-sm-offset-1 col-xs-offset-0 col-xs-12  centered relative-position">

          <q-card-main>
        <h1 class="_control-label-title">Collected Data</h1>
          <q-transition appear enter="fadeIn" leave="fadeOut">

            <data-tables :data="submissions" :search-def="searchDef" :action-col-def="getRowActionsDef()" action-col-label="Actions"
              :actions-def="actionsDef" max-height="250" height="250" v-if="typeof submissions !== 'undefined'" @selection-change="handleSelectionChange">

              <el-table-column type="selection" width="55" fixed="left">
              </el-table-column>

              <el-table-column label="status" prop="Status" width="90" sortable fixed="left">
                <template scope="scope">
                  <el-tag :type="getIconColor(scope.row)" close-transition>
                    <i class="material-icons">{{scope.row.status === 'offline' ? 'description' : 'check_circle'}}</i>
                  </el-tag>
                  <i class="material-icons" style="color: red;font-size: x-large; cursor: pointer;" v-if="scope.row.syncError && scope.row.syncError !=='Unauthorized' " @click="displayError(scope.row.syncError)">block</i>
                  <i class="material-icons" style="color: red;font-size: x-large; cursor: pointer;" v-if="scope.row.syncError && scope.row.syncError ==='Unauthorized' " @click="displayError(scope.row.syncError)">lock</i>
                </template>
              </el-table-column>

              <!--
              <el-table-column label="ID" prop="id_submision" sortable min-width="230">
              </el-table-column>
              -->

              <el-table-column :label="$t(column.label)" sortable v-for="column in visibleColumns" :key="column.key" min-width="180">
                <template scope="scope">
                  {{typeof scope.row.fullSubmission[column.key] === 'object' ? '' : scope.row.fullSubmission[column.key] }}
                </template>
              </el-table-column>

              <el-table-column :label="$t('Updated at')" prop="HumanUpdated" sortable fixed="left" width="140">
              </el-table-column>

              <el-table-column fixed="right" label="Actions" width="120">
                <template scope="scope">
                  <!--<el-button @click="handleEdit(scope)" type="text">{{$t('Edit')}}</el-button>-->
                    <el-button @click="handleEdit(scope)" type="text"><i class="material-icons edit">edit</i></el-button>
                </template>
              </el-table-column>

            </data-tables>
          </q-transition>
        </q-card-main>
        <q-inner-loading :visible="typeof submissions === 'undefined'">
          <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
        </q-inner-loading>
      </q-card>
    </div>
    <q-fixed-position corner="bottom-right" :offset="[18, 18]">
      <q-fab color="red" icon="add" direction="up" push>

        <q-fab-action color="secondary" @click="importSubmission()" icon="fa-upload">
          <q-tooltip>
             {{$t('Import Submissions')}}
          </q-tooltip>
        </q-fab-action>

            <q-fab-action color="primary" @click="createSubmission()" icon="add">
          <q-tooltip>
             {{$t('New Submission')}}
          </q-tooltip>
        </q-fab-action>

      </q-fab>
    </q-fixed-position>
  </div>
</template>

<script>
import DataTables from "vue-data-tables";

import _forEach from "lodash/forEach";
import _map from "lodash/map";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import moment from "moment";
import jsonexport from "jsonexport";
import flatten from "flat";
import {
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QFab,
  QFabAction,
  QFixedPosition,
  QPullToRefresh,
  QSpinnerAudio,
  QTransition,
  Platform,
  QInnerLoading,
  QTooltip
} from "quasar";
import Submission from "database/models/Submission";
import Form from "database/models/Form";
import FormioUtils from "formiojs/utils";

import Papa from "papaparse";
import ImportSubmission from 'database/repositories/Submission/ImportSubmission'
locale.use(lang);

export default {
  async mounted() {
    if (this.$route.params.idForm === "*") {
      this.submissions = await Submission.local().sFind(this, {});
    } else {
      this.submissions = await Submission.local().sFind(this, {
        "data.formio.formId": this.$route.params.idForm
      });
    }

    this.currentForm = await Form.local().findOne({
      "data.path": this.$route.params.idForm
    });

    this.$eventHub.on("FAST-DATA_SYNCED", async data => {
      await this.updateLocalSubmissions();
    });

    this.$eventHub.on("FAST-DATA_IMPORTED", async data => {
      await this.updateLocalSubmissions();
    });

    this.visibleColumns = FormioUtils.findComponents(
      this.currentForm.data.components,
      {
        input: true,
        tableView: true
      }
    );

    this.visibleColumns = this.visibleColumns.slice(0, 20);
  },
  computed: {
    formTitle() {
      let title = "";
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : "";
      }
      return title;
    }
  },
  components: {
    QInnerLoading,
    QTransition,
    DataTables,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QFab,
    QFabAction,
    QFixedPosition,
    QPullToRefresh,
    QSpinnerAudio,
    QTooltip
  },
  data() {
    return {
      selectedRows: [],
      currentForm: {},
      submissions: undefined,
      visibleColumns: [],
      searchDef: {
        colProps: {
          span: 9
        }
      },
      actionsDef: {
        colProps: {
          span: 14
        },
        def: [
          {
            name: "JSON",
            handler: () => {
              let exported = this.loadExportData("json");
              let name = "backup_" + exported.date + ".json";
              this.download(
                JSON.stringify(exported.data),
                name,
                "text/json;encoding:utf-8"
              );
            },
            icon: "document",
            buttonProps: {
              type: "text",
              size: "large"
            }
          },
          {
            name: "CSV",
            handler: (selection, something) => {
              let exported = this.loadExportData("csv");
              jsonexport(exported.data, (err, csv) => {
                if (err) {
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
                        (correspondingLabel && correspondingLabel.label) ||
                        innerLabel;
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
                this.download(newCSV, name, "text/csv;encoding:utf-8");
              });
            },
            icon: "document",
            buttonProps: {
              type: "text",
              size: "large"
            }
          },
          {
            name: this.$t("DELETE"),
            handler: () => {
              this.handleDelete(this.selectedRows);
            },
            icon: "delete",
            buttonProps: {
              type: "text",
              size: "large"
            }
          }
        ]
      }
    };
  },
  beforeDestroy() {
    this.$eventHub.off("FAST-DATA_SYNCED");
  },
  methods: {
    loadExportData(type) {
      let self = this;
      let json = [];
      let dataExport;
      let labels = [];
      dataExport =
        this.selectedRows.length === 0 ? this.submissions : this.selectedRows;
      _forEach(dataExport, function(submission) {
        let record = submission.fullSubmission;
        record.id = submission.id_submision;
        const ordered = {};
        Object.keys(record)
          .sort()
          .forEach(function(key) {
            ordered[key] = record[key];
          });

        Object.keys(record).forEach(key => {
          let component = FormioUtils.getComponent(
            self.currentForm.data.components,
            key
          );
          let label = component ? component.label : null;
          if (label) {
            labels.push({ apiKey: key, label: self.$t(label) });
          }
        });
        json.push(flatten(ordered));
      });

      let orderedJsonOut = _map(
        _map(dataExport, "fullSubmission"),
        submission => {
          const ordered = {};
          Object.keys(submission)
            .sort()
            .forEach(function(key) {
              ordered[key] = submission[key];
            });
          return ordered;
        }
      );
      dataExport = type && type === "csv" ? json : orderedJsonOut;

      let date = new Date()
        .toJSON()
        .replace(/-/g, "_")
        .replace(/T/g, "_")
        .replace(/:/g, "_")
        .slice(0, 19);

      return { date: date, data: dataExport, labels: labels };
    },
    handleEdit(data) {
      let self = this;
      let submission = data.row;
      self.$router.push({
        name: "formio_submission_update",
        params: {
          idForm: submission.formio.formId,
          idSubmission: submission.id_submision
        }
      });
    },
    handleDelete(rows) {
      let self = this;
      if (rows.length === 0) {
        self.$swal({
          title: "No row selected",
          text: "You must select at least one row to delete",
          type: "error"
        });
        return;
      }
      self
        .$swal({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(async () => {
          _forEach(rows, async submission => {
            let online = await Submission.local().findOne({
              "data._id": submission.id_submision
            });

            let offline = await Submission.local().findOne({
              _id: submission.id_submision
            });

            let deleteSubmission = offline;
            if (online) {
              deleteSubmission = online;
            }
            await Submission.local().remove(deleteSubmission);
            await this.updateLocalSubmissions();
          });

          self.$swal(
            "Deleted!",
            "Your submission has been deleted.",
            "success"
          );
        });
    },
    download: function(content, fileName, mimeType) {
      if (Platform.is.cordova) {
        this.cordovaDownload(content, fileName, mimeType);
      } else {
        this.browserDownload(content, fileName, mimeType);
      }
    },
    browserDownload(content, fileName, mimeType) {
      var a = document.createElement("a");
      mimeType = mimeType || "application/octet-stream";
      var self = this;
      let successDownload = function() {
        self.$swal("Exported!", "The file has been exported.", "success");
      };

      if (navigator.msSaveBlob) {
        // IE10
        navigator.msSaveBlob(
          new Blob([content], {
            type: mimeType
          }),
          fileName
        );
        successDownload();
      } else if (URL && "download" in a) {
        // html5 A[download]
        a.href = URL.createObjectURL(
          new Blob([content], {
            type: mimeType
          })
        );
        a.setAttribute("download", fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        successDownload();
      } else {
        let fileContent = "data:" + mimeType + "," + content;
        let encodedUri = encodeURI(fileContent);
        let link = document.createElement("a");
        link.id = "_downloadedFile";
        if (link.download !== undefined) {
          link.href = encodedUri;
          link.download = fileName;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
        } else {
          window.open(encodedUri);
        }
        successDownload();
      }
    },
    cordovaDownload(content, fileName, mimeType) {
      let self = this;
      var logOb;
      window.resolveLocalFileSystemURL(
        cordova.file.externalDataDirectory,
        function(dir) {
          dir.getFile(
            fileName,
            {
              create: true
            },
            function(file) {
              logOb = file;
              writeLog(content);
            }
          );
        }
      );

      function writeLog(output) {
        if (!logOb) return;
        logOb.createWriter(function(fileWriter) {
          fileWriter.seek(fileWriter.length);
          var blob = new Blob([output], {
            type: mimeType
          });
          fileWriter.write(blob);
          self.$swal(
            "Exported!",
            "The file has been exported to: " +
              cordova.file.externalDataDirectory +
              fileName,
            "success"
          );
        });
      }
    },
    getIconColor: function(row) {
      if (row.draft && row.draft === true) {
        return "grey";
      } else if (row.status === "offline") {
        return "offline";
      } else {
        return "green";
      }
    },
    humanizeDate(givenDate) {
      let start = moment(givenDate);
      let end = moment();
      return end.to(start);
    },
    scrollToEnd: function(ID) {
      var container = this.$el.querySelector("#container");
      container.scrollTop = container.scrollHeight;
    },
    createSubmission() {
      this.$router.push({
        name: "formio_form_submission",
        params: {
          id: this.$route.params.id,
          idForm: this.$route.params.idForm
        },
        query: {
          formPath: this.$route.query.formPath
        }
      });
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows;
    },
    getRowActionsDef() {
      let self = this;
      return {
        label: self.$t("Actions"),
        def: [
          /* TODO
            Uncomment this and finish when CORS are available
            to have PDF export of the submission
            {
              type: 'text',
              handler(submission) {
                let id = submission.id_submision
                var formio = new Formio('https://dghnmpjfioshlsx.form.io/welcome/submission/' + id + '?token=ASUiwa0aEMZI7LZNBPlfXiMG3ub5TO')
                formio.getDownloadUrl().then(function(url) {
                  var link = document.createElement('a')
                  link.href = url
                  link.download = url.substr(url.lastIndexOf('/') + 1)
                  link.click()
                })
              },
              icon: 'document'
            },
            */
        ]
      };
    },
    async importSubmission() {
      const file = await this.$swal({
        title: this.$t("Select your JSON file"),
        input: "file",
        inputAttributes: {
          accept: ".json",
          "aria-label": this.$t("Upload your JSON File")
        }
      });
      if (file) {
        ImportSubmission.fromJsonFile(file, this)
      }
    },
    async updateLocalSubmissions() {
      if (this.$route.params.idForm === "*") {
        this.submissions = await Submission.local().sFind(this, {});
      } else {
        this.submissions = await Submission.local().sFind(this, {
          "data.formio.formId": this.$route.params.idForm
        });
      }
    },
    async pullSubmissions() {
      this.$store.dispatch("getSubmissions", {
        currentForm: this.currentForm,
        vm: this
      });
    },
    displayError(error) {
      let errorString =
        '<div style="overflow-x:auto;"><table class="restable"><thead> <tr><th scope="col">' +
        this.$t("Label") +
        '</th><th scope="col">' +
        this.$t("Code") +
        '</th><th scope="col">' +
        this.$t("Module") +
        "</th></tr></thead><tbody>";

      error.details.forEach(detail => {
        let component = FormioUtils.getComponent(
          this.currentForm.data.components,
          detail.path[0]
        );
        let label = component ? this.$t(component.label) + ": " : "";
        errorString = errorString + "<tr>";
        errorString =
          errorString +
          "<td data-label=" +
          this.$t("Label") +
          ">" +
          label +
          "</td>";
        errorString =
          errorString +
          "<td data-label=" +
          this.$t("Code") +
          ">" +
          detail.message +
          "</td>";
        errorString =
          errorString +
          "<td data-label=" +
          this.$t("Module") +
          ">" +
          detail.message +
          "</td>";
        errorString = errorString + "</tr>";
      });
      errorString = errorString + "</tbody></table></div>";

      this.$swal({
        title: error.name,
        type: "info",
        html: errorString,
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonText: "OK"
      });
    }
  }
};
</script>



