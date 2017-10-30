<style lang="css">
.desc {
  margin-top: 20px;
  margin-bottom: 40px;
}

.pl {
  padding-left: 20px;
}
.el-table__body-wrapper {
    overflow: scroll !important;
    position: relative !important;
    -webkit-overflow-scrolling: touch !important;
}
</style>

<template>
  <div>
    <q-pull-to-refresh :handler="refreshSubmissions">
      <div class="row" v-if="submissions.length === 0">
        <q-card flat class="col-lg-8 col-md-8 col-sm-12" style="margin-top: 30px; margin-left: 43px; align-items: center;justify-content: center;display: flex;">
          <q-card-title>
                    <q-spinner-audio color="primary" :size="50"/>
                    <h4>Loading Submissions...</h4>
          </q-card-title>
      </q-card>  
      </div>
      <div class="row" v-if="submissions.length !== 0">
        <q-card color="white" class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 centered">
            <q-card-main>
                <data-tables :data="submissions" :search-def="searchDef" :action-col-def="getRowActionsDef()" action-col-label="Actions" :actions-def="actionsDef" max-height="250" height="250">
                    <el-table-column type="selection">

                    </el-table-column>

                    <el-table-column label="status" prop="Status" width="90" sortable fixed="left">
                        <template scope="scope">
                            <el-tag :type="getIconColor(scope.row)" close-transition>
                            <i class="material-icons">{{scope.row.status === 'offline' ? 'cloud_off' : 'cloud_done'}}</i>
                            </el-tag>
                        </template>
                    </el-table-column>

                   <el-table-column label="ID" prop="id_submision" sortable min-width="230">
                    </el-table-column>

                    
                    <el-table-column :label="column.label" sortable v-for="column in visibleColumns" :key="column.key" min-width="180">
                        <template scope="scope">
                           {{typeof scope.row.fullSubmission[column.key] === 'object' ? '' : scope.row.fullSubmission[column.key] }} 
                        </template>

                    </el-table-column>

                    <el-table-column :label="$t('App.created_at')" prop="Humancreated" sortable fixed="left" width="140">
                    </el-table-column>

                     <el-table-column
                      fixed="right"
                      label="Actions"
                      width="120">
                      <template scope="scope">
                        <el-button @click="handleEdit(scope)" type="text" >Edit</el-button>
                        <el-button @click="handleDelete(scope)" type="text">Delete</el-button>
                      </template>
                    </el-table-column>

                </data-tables>
            </q-card-main>
        </q-card>
      </div>
    </q-pull-to-refresh>
    <q-fixed-position corner="top-right" :offset="[18, 18]">
                    <q-fab color="red" icon="add" direction="left" push>
                        <q-fab-action color="secondary" @click="createSubmission()" icon="add"></q-fab-action>

                        <q-fab-action color="amber" @click="pullSubmissions()" icon="cloud_download"></q-fab-action>

                    </q-fab>
                </q-fixed-position>
</div>
</template>

<script>
import DataTables from 'vue-data-tables'
import _ from 'lodash'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import * as Database from 'database/Database'
import moment from 'moment'
import jsonexport from 'jsonexport'
import { Loading, QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh, QSpinnerAudio } from 'quasar'
import LocalSubmission from 'database/collections/scopes/LocalSubmission'
import FormioUtils from 'formiojs/utils'
locale.use(lang)

export default {
  async mounted () {
      if (this.$route.params.idForm === '*') {
        this.submissions = await LocalSubmission.sFind(this, {})
      } else {
         this.submissions = await LocalSubmission.sFind(this, {
            'data.formio.formId': this.$route.params.idForm
          })
      }
  },
  computed: {
    formTitle() {
      let title = ''
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : ''
      }
      return title
    }
  },
  components: {
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.pullSubmissions()
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.pullSubmissions()
    next()
  },
  data() {
    return {
      currentForm: {},
      submissions: [],
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
            name: 'CSV',
            handler: () => {
              let json = []
               _.forEach(this.submissions, function (submission) {
                  let record = submission.fullSubmission
                  record.id = submission.id_submision
                  json.push(submission.fullSubmission)
              })
              jsonexport(json, (err, csv) => {
                if (err) {
                  return console.log(err)
                }
                // If browser we have to export it like this
                this.download(csv, 'backup.csv', 'text/csv;encoding:utf-8')
                // If its cordova, we have to export like this
                // self.DATA2FILE('backup.csv', csv, function (FILE) {
                //  console.log(FILE)
                // })
                this.$message('Data Exported')
              })
            },
            icon: 'document'
          },
          {
            name: 'JSON',
            handler: () => {
              let json = []
               _.forEach(this.submissions, function (submission) {
                  let record = submission.fullSubmission
                  record.id = submission.id_submision
                  json.push(submission.fullSubmission)
              })
              this.download(JSON.stringify(json), 'backup.json', 'text/json;encoding:utf-8')
            },
            icon: 'document'
          }
        ]
      }
    }
  },
  methods: {
    handleEdit (data) {
       let self = this
       let submission = data.row
       Loading.show()
        self.$router.push(
        {
            name: 'formio_submission_update',
            params: {
              idForm: submission.formio.formId,
              idSubmission: submission.id_submision
            }
        })
     },
    handleDelete (data) {
       let self = this
       let submission = data.row
       self.$swal({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then(async () => {
                let db = await Database.get()
                let online = await db.submissions
                  .findOne().where('data._id')
                  .eq(submission.id_submision).exec()
                let offline = await db.submissions
                  .findOne().where('_id')
                  .eq(submission.id_submision).exec()

                let deleteSubmission = offline
                if (online) {
                  deleteSubmission = online
                }
                await deleteSubmission.remove()
                self.$swal(
                  'Deleted!',
                  'Your submission has been deleted.',
                  'success'
                )
              })
    },
    download: function(content, fileName, mimeType) {
      var a = document.createElement('a')
      mimeType = mimeType || 'application/octet-stream'

      if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([
          content
        ], {
          type: mimeType
        }), fileName)
      } else if (URL && 'download' in a) { // html5 A[download]
        a.href = URL.createObjectURL(new Blob([
          content
        ], {
          type: mimeType
        }))
        a.setAttribute('download', fileName)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        location.href = 'data:application/octet-stream,' + encodeURIComponent(content) // only this mime type is supported
      }
    },
    getIconColor: function (row) {
      if (row.draft)
        {
          return 'primary'
        } else if (row.status === 'offline') {
          return 'danger'
        } else {
          return 'success'
        }
    },
    DATA2FILE: function(filename, data, callback) {
      // default filename
      var defaultFileName = 'export-file.txt'

      if (filename === undefined || filename === null) {
        filename = defaultFileName
      }

      // Request the file system
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail)

      // Access to filesystem is OK
      function gotFS(fileSystem) {
        fileSystem.root.getFile(filename, {
          create: true
        }, gotFileEntry, fail) }

      // File is ready
      function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail) }

      // Write file content
      function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
          if (callback !== undefined) {
            callback(writer)
          }
        }
        writer.write(data) }

      function fail(error) {
        console.log('Error: ', error.code) }
    },
    humanizeDate(givenDate) {
      let start = moment(givenDate)
      let end = moment()
      return end.to(start)
    },
    scrollToEnd: function(ID) {
      var container = this.$el.querySelector('#container')
      container.scrollTop = container.scrollHeight
    },
    createSubmission() {
      this.$router.push({
        name: 'formio_form_submission',
        params: {
          id: this.$route.params.id,
          idForm: this.$route.params.idForm
        },
        query: {
          formPath: this.$route.query.formPath
        }
      })
    },
    getRowActionsDef() {
      let self = this
      return {
        label: self.$t('App.actions'),
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
      }
    },
    async pullSubmissions() {
      let db = await Database.get()
      this.currentForm = await db.forms.findOne()
        .where('data.path').eq(this.$route.params.idForm).exec()

      this.visibleColumns = FormioUtils.findComponents(this.currentForm.data.components, {
        'input': true,
        'tableView': true
      })

      this.visibleColumns = this.visibleColumns.slice(0, 20)
      this.$store.dispatch('getSubmissions',
        {
          currentForm: this.currentForm,
          User: this.$store.getters.getAuthUser
        })
    },
    refreshSubmissions(done) {
      this.pullSubmissions()
      setTimeout(function() {
        done()
      }, 1200)
    }
  }
}

</script>
