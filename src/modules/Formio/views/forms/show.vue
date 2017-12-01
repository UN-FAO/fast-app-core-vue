<template>
  <div class="row" style="background:#f3f3f5">
    <div>
      <q-card color="white" style="bottom: unset;margin-top: 30px;" class="col-lg-10 col-lg-offset-1 col-md-offset-1 col-md-10 col-sm-10 col-sm-offset-1 col-xs-offset-0 col-xs-12  centered relative-position">
        <q-card-main>
          <q-transition appear enter="fadeIn" leave="fadeOut">

            <data-tables :data="submissions" :search-def="searchDef" :action-col-def="getRowActionsDef()" action-col-label="Actions"
              :actions-def="actionsDef" max-height="250" height="250" v-if="typeof submissions !== 'undefined'" @selection-change="handleSelectionChange">

              <el-table-column type="selection" width="55" fixed="left">
              </el-table-column>

              <el-table-column label="status" prop="Status" width="90" sortable fixed="left">
                <template scope="scope">
                  <el-tag :type="getIconColor(scope.row)" close-transition>
                    <i class="material-icons">{{scope.row.status === 'offline' ? 'cloud_off' : 'cloud_done'}}</i>
                  </el-tag>
                  <i class="material-icons" style="color: red;font-size: x-large;" v-if="scope.row.syncError && scope.row.syncError !=='Unauthorized' ">error_outline</i>
                  <i class="material-icons" style="color: red;font-size: x-large;" v-if="scope.row.syncError && scope.row.syncError ==='Unauthorized' ">lock</i>
                </template>
              </el-table-column>

              <!--
              <el-table-column label="ID" prop="id_submision" sortable min-width="230">
              </el-table-column>
              -->

              <el-table-column :label="column.label" sortable v-for="column in visibleColumns" :key="column.key" min-width="180">
                <template scope="scope">
                  {{typeof scope.row.fullSubmission[column.key] === 'object' ? '' : scope.row.fullSubmission[column.key] }}
                </template>

              </el-table-column>

              <el-table-column :label="$t('translations.app_created_at')" prop="Humancreated" sortable fixed="left" width="140">
              </el-table-column>

              <el-table-column fixed="right" label="Actions" width="120">
                <template scope="scope">
                  <el-button @click="handleEdit(scope)" type="text">Edit</el-button>
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
    <q-fixed-position corner="top-right" :offset="[18, 18]">
      <q-fab color="red" icon="add" direction="left" push>
        <q-fab-action color="secondary" @click="createSubmission()" icon="add"></q-fab-action>

        <q-fab-action color="amber" @click="pullSubmissions()" icon="cloud_download"></q-fab-action>

        <q-fab-action color="success" @click="updateLocalSubmissions()" icon="fa-refresh"></q-fab-action>
      </q-fab>
    </q-fixed-position>
  </div>
</template>

<script>
import DataTables from "vue-data-tables";
import _forEach from "lodash/forEach";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import moment from "moment";
import jsonexport from "jsonexport";
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
  QInnerLoading
} from "quasar";
import LocalSubmission from "database/collections/scopes/LocalSubmission";
import LocalForm from "database/collections/scopes/LocalForm";
import FormioUtils from "formiojs/utils";
locale.use(lang);

export default {
  async mounted() {
    if (this.$route.params.idForm === "*") {
      this.submissions = await LocalSubmission.sFind(this, {});
    } else {
      this.submissions = await LocalSubmission.sFind(this, {
        "data.formio.formId": this.$route.params.idForm
      });
    }

    this.currentForm = await LocalForm.findOne({
      "data.path": this.$route.params.idForm
    });

    console.log("local form", this.currentForm);

    this.$eventHub.on("FAST-DATA_SYNCED", async data => {
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
    QSpinnerAudio
  },
  data() {
    return {
      deleteRows: [],
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
            name: "CSV",
            handler: () => {
              let json = [];
              var self = this;
              _forEach(self.submissions, function(submission) {
                let record = submission.fullSubmission;
                record.id = submission.id_submision;
                json.push(submission.fullSubmission);
              });
              jsonexport(json, (err, csv) => {
                if (err) {
                  return console.log(err);
                }
                let date = new Date()
                  .toJSON()
                  .replace(/-/g, "_")
                  .replace(/T/g, "_")
                  .replace(/:/g, "_")
                  .slice(0, 19);

                let name = "backup_" + date + ".csv";
                // If browser we have to export it like this
                self.download(csv, name, "text/csv;encoding:utf-8");
                // If its cordova, we have to export like this
                // self.DATA2FILE('backup.csv', csv, function (FILE) {
                //  console.log(FILE)
                // })
                self.$message("Data Exported");
              });
            },
            icon: "document"
          },
          {
            name: "JSON",
            handler: () => {
              let json = [];
              var self = this;
              _forEach(self.submissions, function(submission) {
                let record = submission.fullSubmission;
                record.id = submission.id_submision;
                json.push(submission.fullSubmission);
              });
              let date = new Date()
                .toJSON()
                .replace(/-/g, "_")
                .replace(/T/g, "_")
                .replace(/:/g, "_")
                .slice(0, 19);

              let name = "backup_" + date + ".json";
              self.download(
                JSON.stringify(json),
                name,
                "text/json;encoding:utf-8"
              );
            },
            icon: "document"
          },
          {
            name: "DELETE",
            handler: () => {
              this.handleDelete(this.deleteRows);
            },
            icon: "delete"
          }
        ]
      }
    };
  },
  methods: {
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
      /*
      if (rows.length > 1) {
        self.$swal({
          title: "Multiple rows selected",
          text: "You cannot delete more than one row",
          type: "error"
        });
        return;
      }
      */
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
            let online = await LocalSubmission.findOne({
              "data._id": submission.id_submision
            });

            let offline = await LocalSubmission.findOne({
              _id: submission.id_submision
            });

            let deleteSubmission = offline;
            if (online) {
              deleteSubmission = online;
            }
            await LocalSubmission.remove(deleteSubmission);
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
        fileContent = "data:" + mimeType + "," + content;
        encodedUri = encodeURI(fileContent);
        link = document.createElement("a");
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
      if (row.draft) {
        return "primary";
      } else if (row.status === "offline") {
        return "danger";
      } else {
        return "success";
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
      this.deleteRows = rows;
    },
    getRowActionsDef() {
      let self = this;
      return {
        label: self.$t("translations.app_actions"),
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
    async updateLocalSubmissions() {
      if (this.$route.params.idForm === "*") {
        this.submissions = await LocalSubmission.sFind(this, {});
      } else {
        this.submissions = await LocalSubmission.sFind(this, {
          "data.formio.formId": this.$route.params.idForm
        });
        console.log("Data was synced, trying to update", this.submissions);
      }
    },
    async pullSubmissions() {
      this.$store.dispatch("getSubmissions", {
        currentForm: this.currentForm,
        vm: this
      });
    },
    refreshSubmissions(done) {
      this.pullSubmissions();
      setTimeout(function() {
        done();
      }, 1200);
    }
  }
};
</script>
