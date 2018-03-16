<template>
    <div class="row" style="color:black">

        <div style="width:100%">
            <q-select filter separator autofocus-filter v-model="selectForm" :options="formList" stack-label="Search your form" filter-placeholder="Search for the country" style="border-bottom: 1px solid grey; width: 50%" clearable />

            <q-card-main>

                <h1 class="_control-label-title">{{formTitle}}</h1>
                <q-data-table
                :data="submissions"
                :config="config"
                :columns="columns"
                v-if="currentForm && currentForm.data.title !== ''">
                </q-data-table>
            </q-card-main>

            <!-- This should be extracted to its own component -->
            <q-inner-loading :visible="typeof submissions === 'undefined'">
                <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
            </q-inner-loading>
            <!--Until Here      -->
        </div>

        <!-- This should be extracted to its own component -->
        <q-fixed-position corner="top-right" :offset="[18, 18]">
            <q-fab color="red" icon="add" direction="down" push>
                <q-btn color="primary" round @click='createSubmission()'> <i class="material-icons edit" style="font-size: 1.7em;">add</i>
                    <q-tooltip>{{$t('New Submission')}}</q-tooltip>
                </q-btn>

                <q-btn color="positive" round small @click='exportCSV()'> <i class="material-icons edit" style="font-size: 1.3em;">file_download</i><span style="font-size: 0.6em;">CSV</span>
                    <q-tooltip>{{$t('Export CSV')}}</q-tooltip>
                </q-btn>
                <q-btn color="positive" round small @click='exportJson()'> <i class="material-icons edit" style="font-size: 1.3em;">file_download</i><span style="font-size: 0.6em;">JSON</span>
                    <q-tooltip>{{$t('Export Json')}}</q-tooltip>
                </q-btn>

                <q-fab-action color="secondary" @click="importSubmission()" icon="fa-upload">
                    <q-tooltip>
                        {{$t('Import Submissions')}}
                    </q-tooltip>
                </q-fab-action>

            </q-fab>
        </q-fixed-position>
        <!--Until Here      -->
    </div>
</template>
<script>
import {
  QDataTable,
  QField,
  QInput,
  QCheckbox,
  QSelect,
  QSlider,
  QIcon,
  QCollapsible,
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QFab,
  QBtn,
  QFabAction,
  QFixedPosition,
  QPullToRefresh,
  QSpinnerAudio,
  QTransition,
  Platform,
  QInnerLoading,
  QTooltip
} from "quasar";
import _forEach from "lodash/forEach";
import _map from "lodash/map";
import jsonexport from "jsonexport";
import flatten from "flat";
import Submission from "database/models/Submission";
import Form from "database/models/Form";
import FormioUtils from "formiojs/utils";
import Promise from "bluebird";
import Papa from "papaparse";
import Import from "database/repositories/Submission/Import";
import _flattenDeep from "lodash/flattenDeep";
import FormioJS from "formiojs";
import Auth from "modules/Auth/api/Auth";
import Config from "database/repositories/Configuration/Configuration";
export default {
  async mounted() {
    this.updateLocalSubmissions();

    this.$eventHub.on("lenguageSelection", async data => {
      await this.updateLocalSubmissions();
    });
  },
  asyncData: {
    formList: {
      get() {
        return Form.sAll();
      },
      transform(result) {
        let forms = result.reduce((filtered, form) => {
          if (form.data.tags.indexOf("visible") > -1) {
            filtered.push({ label: form.data.title, value: form.data.path });
          }
          return filtered;
        }, []);
        return forms;
      }
    }
  },
  asyncComputed: {
    currentForm: {
      get() {
        if (this.selectForm && this.selectForm !== "") {
          return Form.local().findOne({
            "data.path": this.selectForm
          });
        } else {
          return { data: { title: "" } };
        }
      }
    },
    submissions: {
      async get() {
        if (this.currentForm.data.title === "") {
          return [];
        }
        let form = this.currentForm.data;

        FormioJS.setToken(Auth.user().x_jwt_token);
        let formUrl = await Config.getLocal();
        formUrl = formUrl.APP_URL + "/" + form.path;

        let formio = new FormioJS(formUrl);

        FormioJS.clearCache();

        let select = this.columns.reduce((reducer, column) => {
          reducer = reducer + ",data." + column.field;
          return reducer;
        }, "_id");

        let remoteSubmissions = await formio.loadSubmissions({
          params: {
            // "data.deleted": false,
            limit: "100",
            select: select
          }
        });
        remoteSubmissions = remoteSubmissions.map(s => {
          let data = s.data;
          data._id = s._id;
          return data;
        });
        return remoteSubmissions;
      },
      watch() {
        this.currentForm;
      }
    }
  },
  computed: {
    formTitle() {
      let title = "";
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : "";
      }
      return this.$t(title);
    },
    columns() {
      if (!this.currentForm || this.currentForm.data.title === "") {
        return [
          {
            label: "Longitude",
            field: "longitude",
            filter: true,
            sort: true
          },
          {
            label: "Another",
            field: "another",
            filter: true,
            sort: true
          }
        ];
      }
      this.visibleColumns = FormioUtils.findComponents(
        this.currentForm.data.components,
        {
          input: true,
          tableView: true
        }
      );
      this.visibleColumns = this.visibleColumns.slice(0, 20);
      let columns = [];
      this.visibleColumns = this.visibleColumns.filter(c => {
        return !!(c.label !== "");
      });
      this.visibleColumns.forEach((column, index) => {
        // let self = this;
        let visibleColum = {
          label: this.$t(column.label),
          field: column.key,
          filter: true,
          sort: true
        };
        columns.push(visibleColum);
      });
      console.log("columnscolumns", columns);
      return columns;
    }
  },
  components: {
    QDataTable,
    QField,
    QInput,
    QCheckbox,
    QSelect,
    QSlider,
    QBtn,
    QIcon,
    QTooltip,
    QCollapsible,
    QInnerLoading,
    QTransition,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QFab,
    QFabAction,
    QFixedPosition,
    QPullToRefresh,
    QSpinnerAudio
  },
  data() {
    return {
      cols: [
        {
          label: "Date of survey",
          field: "date",
          filter: true,
          sort: true
        },
        {
          label: "Data to be collected:",
          field: "dataCollected",
          filter: true,
          sort: true
        },
        {
          label: "Location name",
          field: "locationName",
          filter: true,
          sort: true
        },
        {
          label: "Latitude",
          field: "latitude",
          filter: true,
          sort: true
        },
        {
          label: "Longitude",
          field: "longitude",
          filter: true,
          sort: true
        },
        {
          label: "Another",
          field: "another",
          filter: true,
          sort: true
        }
      ],
      formList: [],
      config: {
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        rowHeight: "70px",
        responsive: true,
        pagination: {
          rowsPerPage: 100,
          options: [10, 30, 50, 100]
        },
        messages: {
          noData: this.$t("No data available to show."),
          noDataAfterFiltering: this.$t(
            "No results. Please refine your search terms."
          )
        },
        // (optional) Override default labels. Useful for I18n.
        labels: {
          columns: this.$t("Columns"),
          allCols: this.$t("All Columns"),
          rows: this.$t("Rows"),
          selected: {
            singular: this.$t("item selected."),
            plural: this.$t("items selected.")
          },
          clear: this.$t("clear"),
          search: this.$t("Search"),
          all: this.$t("All")
        }
      },
      pagination: true,
      rowHeight: 50,
      bodyHeightProp: "maxHeight",
      bodyHeight: 500,
      selectedRows: [],
      visibleColumns: [],
      selectForm: null
    };
  },
  beforeDestroy() {
    this.$eventHub.off("FAST-DATA_SYNCED");
    this.$eventHub.off("FAST-DATA_IMPORTED");
    this.$eventHub.off("lenguageSelection");
  },
  methods: {
    exportCSV() {
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
        this.download(newCSV, name, "text/csv;encoding:utf-8");
      });
    },
    exportJson() {
      let exported = this.loadExportData("json");
      let name = "backup_" + exported.date + ".json";
      this.download(
        JSON.stringify(exported.data),
        name,
        "text/json;encoding:utf-8"
      );
    },
    loadExportData(type) {
      let self = this;
      let json = [];
      let dataExport;
      let labels = [];
      let allKeys = [];

      dataExport =
        this.selectedRows.length === 0 ? this.submissions : this.selectedRows;
      _forEach(dataExport, function(submission) {
        let record = submission.fullSubmission;
        record.id = submission.id_submision;
        json.push(flatten(record));
        allKeys.push(Object.keys(record));
      });

      allKeys = Array.from(new Set(_flattenDeep(allKeys)));

      allKeys.forEach(key => {
        let component = FormioUtils.getComponent(
          self.currentForm.data.components,
          key
        );

        let label = component ? component.label : null;
        if (label) {
          labels.push({ apiKey: key, label: self.$t(label) });
        }
      });

      let orderedJsonOut = _map(dataExport, "fullSubmission");

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
    handleReport(data) {
      let self = this;
      let submission = data.row;
      self.$router.push({
        name: "formio_submission_report",
        params: {
          idForm: submission.formio.formId,
          idSubmission: submission.id_submision
        }
      });
    },
    handleDelete(props) {
      let rows = this.selectedRows;
      let self = this;
      if (rows.length === 0) {
        self.$swal({
          title: this.$t("No row selected"),
          text: this.$t("You must select at least one row to delete"),
          type: "error"
        });
        return;
      }
      self
        .$swal({
          title: this.$t("Are you sure?"),
          text: this.$t("You won't be able to revert this!"),
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: this.$t("Yes, delete it!"),
          cancelButtonText: this.$t("Cancel")
        })
        .then(async () => {
          Promise.each(rows, async submission => {
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
          }).then(async () => {
            await this.updateLocalSubmissions();
            self.$swal(
              this.$t("Deleted!"),
              this.$t("Your submission has been deleted."),
              "success"
            );
          });
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
        // Loading.hide();
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
          // Loading.hide();
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
    handleSelectionChange(number, rows) {
      this.selectedRows = rows.map(r => {
        return r.data;
      });
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
        Import.fromJsonFile(file, this);
      }
    },
    async updateLocalSubmissions(done) {
      if (done) {
        done();
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
