<style lang='css'>
  .desc {
    margin-top: 20px;
    margin-bottom: 40px;
  }

  .pl {
    padding-left: 20px;
  }
</style>

<template>
    <q-pull-to-refresh :handler="refreshSubmissions">
        <q-card>
            <q-card-title class="bg-primary text-white">
                {{ $t("App.submissions_for") }} : {{formTitle}}
            </q-card-title>
            <q-card-separator />
            <q-card-main>
                <q-fixed-position corner="top-right" :offset="[18, 18]">
                    <q-fab color="red" icon="add" direction="left" push>
                        <q-fab-action color="secondary" @click="createSubmission()" icon="add"></q-fab-action>

                        <q-fab-action color="amber" @click="pullSubmissions()" icon="cloud_download"></q-fab-action>

                    </q-fab>
                </q-fixed-position>
                <data-tables :data="submissions" :search-def="searchDef" :action-col-def="getRowActionsDef()" action-col-label="Actions" :actions-def="actionsDef">
                    <el-table-column type="expand">

                        <template scope="props">
                            <p class="caption" id="Fields">Fields</p>
                            <div class="list striped">
                                <div class="item" v-for="(value, key, index) in props.row">
                                    <!--This is the row of the table -->
                                    <div v-if="!Array.isArray(value)" class="item-content">
                                        <strong>{{key}}</strong> : <span class="label bg-primary text-white">{{value}}</span>
                                    </div>
                                    <div v-else class="item-content">
                                        <strong>{{key}}</strong> : <a @click="scrollToEnd(key)"><span
                          class="label  bg-secondary text-white">Multiple values, will be displayed down</span> </a>
                                    </div>

                                </div>
                            </div>
                            <!--This is the table inside the table (When elements are arrays) -->
                            <div v-for="(value, key, index) in props.row">
                                <p></p>
                                <div v-if="Array.isArray(value)">
                                    <a @click="scrollToEnd('Fields')">
                                        <p class="caption" :id="key">{{key}}</p>
                                    </a>
                                    <div class="list striped" v-for="(gridValue, gridKey) in value">
                                        <div class="item">

                                            <strong>{{key}}</strong> : <span class="label  bg-secondary text-white">{{gridKey + 1}}</span>
                                        </div>

                                        <div class="item" v-for="(rowValue, rowKey) in gridValue">
                                            <strong>{{rowKey}}</strong> : <span class="label bg-primary text-white">{{rowValue}}</span>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </template>

                    </el-table-column>

                    <el-table-column label="status" prop="status" width="90" sortable>
                        <template scope="scope">
                            <el-tag :type="scope.row.status === 'offline' ? 'danger' : 'success'" close-transition>
                            <i class="material-icons">{{scope.row.status === 'offline' ? 'cloud_off' : 'cloud_done'}}</i>
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column :label="$t('App.submission_id')" prop="id_submision" sortable>
                    </el-table-column>

                    <el-table-column :label="$t('App.created_at')" prop="Humancreated" sortable>
                    </el-table-column>

                </data-tables>
            </q-card-main>
        </q-card>
    </q-pull-to-refresh>

</template>
<script>
import DataTables from 'vue-data-tables'
import _ from 'lodash'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import * as Database from 'database/Database'
import moment from 'moment'
import jsonexport from 'jsonexport'
import Auth from 'modules/Auth/api/Auth'
import {QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh} from 'quasar'
locale.use(lang)

export default {
  computed: {
    formTitle () {
      console.log('this.currentForm.title => ', this.currentForm)
      let title = ''
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : ''
      }
      return title
    }
  },
  components: {
    DataTables, QCard, QCardTitle, QCardSeparator, QCardMain, QFab, QFabAction, QFixedPosition, QPullToRefresh
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.pullSubmissions()
      vm.subscribeToSubmissions()
      // vm.$forceUpdate();
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.pullSubmissions()
    this.subscribeToSubmissions()
    // this.$forceUpdate();
    next()
  },
  beforeDestroy: function () {
    this.subs.forEach(sub => sub.unsubscribe())
  },
  data () {
    return {
      currentForm: {},
      submissions: [],
      subs: [],
      searchDef: {
        colProps: {
          span: 9
        }
      },
      actionsDef: {
        colProps: {
          span: 14
        },
        def: [{
          name: '',
          handler: () => {
            let self = this
            var download = function (content, fileName, mimeType) {
              var a = document.createElement('a')
              mimeType = mimeType || 'application/octet-stream'

              if (navigator.msSaveBlob) { // IE10
                navigator.msSaveBlob(new Blob([content], {
                  type: mimeType
                }), fileName)
              } else if (URL && 'download' in a) { // html5 A[download]
                a.href = URL.createObjectURL(new Blob([content], {
                  type: mimeType
                }))
                a.setAttribute('download', fileName)
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              } else {
                location.href = 'data:application/octet-stream,' + encodeURIComponent(content) // only this mime type is supported
              }
            }
            
            jsonexport(this.submissions, function (err, csv) {
              if (err) return console.log(err)

              // If browser we have to export it like this
              download(csv, 'backup.csv', 'text/csv;encoding:utf-8')

              // If its cordova, we have to export like this
              // self.DATA2FILE('backup.csv', csv, function (FILE) {
              //  console.log(FILE)
              // })
              self.$message('Data Exported')
            })
          },
          icon: 'document'
        }]
      }
    }
  },
  methods: {
    DATA2FILE: function (filename, data, callback) {
      // default filename
      var defaultFileName = 'export-file.txt'
 
      if (filename === undefined || filename === null) {
        filename = defaultFileName
      }
 
      // Request the file system
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail)
 
      // Access to filesystem is OK
      function gotFS (fileSystem) {
        fileSystem.root.getFile(filename, {create: true}, gotFileEntry, fail)
      }
 
      // File is ready
      function gotFileEntry (fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail)
      }
 
      // Write file content
      function gotFileWriter (writer) {
        writer.onwriteend = function (evt) {
          console.log('finished writing')
          if (callback !== undefined) {
            callback(writer)
          }
        }
        writer.write(data)
      }
 
      function fail (error) {
        console.log('Error: ', error.code)
      }
    },
    humanizeDate (givenDate) {
      let start = moment(givenDate)
      let end = moment()
      return end.to(start)
    },
    scrollToEnd: function (ID) {
      // console.log("scroling to", ID)
      var container = this.$el.querySelector('#container')
      container.scrollTop = container.scrollHeight
    },
    createSubmission () {
      this.$router.push({
        name: 'formio_form_submission',
        params: {
          id: this.$route.params.id,
          idForm: this.$route.params.idForm
        },
        query: {formPath: this.$route.query.formPath}
      })
    },
    async subscribeToSubmissions () {
      this.subs.forEach(sub => sub.unsubscribe())
      let self = this
      const db = await Database.get()
      this.subs.push(
        db.submissions
          // .select('-projectId')
          .find({
            'data.formio.formId': this.$route.params.idForm
          })
          .$
          .subscribe(submissions => {
            console.log('Initial submissions', submissions)
            submissions = _.map(submissions, function (submission) {
              submission = _.clone(submission)
              submission.data.data.created = submission.data.created
              submission.data.data.Humancreated = self.humanizeDate(submission.data.created)
              submission.data.data.id_submision = submission.data._id ? submission.data._id : submission._id
              submission.data.data.local = !submission.data._id
              submission.data.data.id_submision_state = submission.data.sync ? submission.data.data.id_submision : submission.data.data.id_submision + '(Offline)'
              submission.data.data.status = submission.data.sync === false ? 'offline' : 'online'
              return submission.data
            })

            let userEmail = Auth.user().data.email || Auth.user().email
            console.log('After adding the required data', submissions)
            submissions = _.filter(submissions, function (o) {
              return (
                (o.owner && o.owner === Auth.user()._id) ||
                  (o.user_email && o.user_email === userEmail)
              )
            })
            submissions = _.map(submissions, 'data')
            submissions = _.orderBy(submissions, ['created'], ['desc'])
            console.log('After filters', submissions)
            this.submissions = submissions
          })
      )
    },
    getRowActionsDef () {
      let self = this
      let idForm = this.$route.params.idForm
      let formPath = this.$route.query.formPath

      return {
        label: self.$t('App.actions'),
        def: [{
          type: 'text',
          handler (submission) {
            self.$router.push(
              {
                name: 'formio_submission_update',
                params: {
                  idForm: idForm,
                  idSubmission: submission.id_submision
                },
                query: {formPath: formPath}
              })
          },
          icon: 'edit'
        },
        {
          async handler (submission) {
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

            self.$swal({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then(async () => {
              await deleteSubmission.remove()
              self.$swal(
                'Deleted!',
                'Your submission has been deleted.',
                'success'
              )
            })
          },
          type: 'text',
          icon: 'delete2'

        }]
      }
    },
    async pullSubmissions () {
      let db = await Database.get()

      this.currentForm = await db.forms.findOne()
        .where('data.name').eq(this.$route.params.idForm).exec()
      this.$store.dispatch('getSubmissions',
        {
          currentForm: this.currentForm,
          User: this.$store.getters.getAuthUser
        })
    },
    refreshSubmissions (done) {
      this.pullSubmissions()
      setTimeout(function () {
        done()
      }, 1200)
    }
  }
}
</script>
