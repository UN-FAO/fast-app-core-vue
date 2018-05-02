<template>
  <div class="tableContainer" v-if="show">
    <q-data-table :data="data" :config="config" :columns="columns" @selection="handleSelectionChange" @rowclick="handleRowClick">
      <template :slot="'col-' + col.field" scope='scope' v-for="col in columns">
                    <q-btn flat color="black" @click="editCell(scope)" v-bind:key="col.field" v-if="fastMode === 'editGrid' && col.field.indexOf('val') >= 0" >
                        {{scope.data ? scope.data : '-'}}
                    </q-btn>
                    <span  v-bind:key="col.field" v-else>
                    {{scope.data}}
                    </span>
</template>

<template slot="col-status" scope="scope">
  <div v-if="scope.row.status === 'offline' && scope.row.draft">
    <i class="material-icons tag--grey">description</i>
    <q-tooltip>{{$t('Draft')}}</q-tooltip>
  </div>
  <div v-else-if="scope.row.status === 'offline'">
    <i class="material-icons tag--offline">description</i>
    <q-tooltip>{{$t('Offline submission')}}</q-tooltip>
  </div>
   <div v-else-if="isOnlineSubmission(scope.row._id, scope.row._lid)">
    <i class="material-icons tag--green">cloud_done</i>
    <q-tooltip>{{$t('Online Submission')}}</q-tooltip>
  </div>
  <div v-else>
    <i class="material-icons tag--green">cloud_download</i>
    <q-tooltip>{{$t('Synced Submission')}}</q-tooltip>
  </div>
  <i class="material-icons" style="color: red;font-size: x-large; cursor: pointer;" v-if="scope.row.syncError && scope.row.syncError !=='Unauthorized' " @click="displayError(scope.row.syncError)">block</i>
  <i class="material-icons" style="color: red;font-size: x-large; cursor: pointer;" v-if="scope.row.syncError && scope.row.syncError ==='Unauthorized' " @click="displayError(scope.row.syncError)">block</i>
</template>

<template slot="selection" slot-scope="props">

  <q-btn v-if="tableActions.includes('review')" color="primary"  flat  @click='handleReview(props)'>
    <q-icon name="remove_red_eye" />
    <q-tooltip>{{$t('Review')}}</q-tooltip>
  </q-btn>
  <q-btn v-if="tableActions.includes('edit')" color="primary" flat   @click='goToEditView(props)'>
    <q-icon name="edit" />
    <q-tooltip>{{$t('Edit')}}</q-tooltip>
  </q-btn>
  <q-btn v-if="tableActions.includes('report')" color="primary" flat  @click='handleReport(props)'>
  <q-icon name="assignment" />
    <q-tooltip>{{$t('Report')}}</q-tooltip>
  </q-btn>

   <q-btn flat v-if="tableActions.includes('delete')" color="grey" @click="handleDelete(props)">
    <q-icon name="delete" />
    <q-tooltip>{{$t('Delete')}}</q-tooltip>
  </q-btn>
</template>

<template slot='col-deleted' scope='scope'>
  <q-chip icon="fa-ban" small color="red" v-if="scope.row.deleted && scope.row.deleted === true">
  </q-chip>

  <q-chip icon="fa-check" small color="green" v-else>
  </q-chip>
</template>
        </q-data-table>

     <export-menu render="outside" :actions="menuActions"/>
</div>
</template>

<script>
import _get from 'lodash/get';
import Promise from 'bluebird';
import exportMenu from './exportMenu';
import Export from './dataExport/Export';
import Columns from './tableFormatter/Columns';
import { QTooltip, QBtn, QDataTable, QChip, QIcon } from 'quasar';
import Import from 'libraries/fastjs/repositories/Submission/Import';
import Submission from 'libraries/fastjs/database/models/Submission';
import ErrorFormatter from 'components/dataTable/submission/errorFormatter';
import Auth from 'libraries/fastjs/repositories/Auth/Auth';
import to from 'await-to-js';

export default {
  components: {
    QIcon,
    QTooltip,
    QBtn,
    QDataTable,
    QChip,
    exportMenu,
  },
  name: 'datatable',
  props: {
    data: {
      required: true,
    },
    form: {
      required: true,
    },
    tableActions: {
      required: true,
      type: Array,
      default: [],
    },
    menuActions: {
      required: true,
      type: Array,
      default: [],
    },
    fastMode: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.$eventHub.on('FAST:EXPORT', params => {
      this.exportTo(params);
    });
    this.$eventHub.on('FAST:IMPORT', type => {
      this.importSubmission();
    });
    this.$eventHub.on('FAST:GO:CREATE', () => {
      this.goToCreateView();
    });
  },
  beforeDestroy() {
    this.$eventHub.off('FAST:EXPORT');
    this.$eventHub.off('FAST:GO:CREATE');
    this.$eventHub.off('FAST:IMPORT');
    this.$eventHub.off('FAST-DATA_SYNCED');
    this.$eventHub.off('FAST-DATA_IMPORTED');
    this.$eventHub.off('lenguageSelection');
  },
  watch: {
    data: function(data) {},
    form: function(data) {},
    tableActions: function(data) {},
    menuActions: function(data) {},
  },
  methods: {
    isOnlineSubmission(_id, _lid) {
      return !_lid && _id.indexOf('_local') < 0;
    },
    async exportTo(params) {
      this.$swal({
        title: 'Exporting...',
        text: this.$t(
          'Wait until the file is ready. This can take a couple minutes...',
        ),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          let data = [];
          data = this.selectedRows.length === 0 ? this.data : this.selectedRows;
          let submissions = await this.getFullSubmissions(data, params.options);
          await Export.jsonTo({
            output: params.format,
            options: params.options,
            data: submissions,
            formioForm: this.form.data,
            vm: this,
          });
          this.$swal('Exported!', 'The file has been exported.', 'success');
        },
      });
    },
    handleSelectionChange(number, rows) {
      this.selectedRows = rows.map(r => {
        return r.data;
      });
    },
    handleRowClick(row) {
      this.clickedRow = row;
    },
    async getFullSubmissions(submissions, options) {
      let query = {
        limit: 50000,
        form: this.form.data.path,
        filter: {
          'data.formio.formId': this.form.data.path,
          'data.user_email': Auth.userEmail(),
        },
        dataExport: true,
      };

      if (options.includes('ownerEmail')) {
        query.populate = ['owner'];
      }
      let sub = await Submission.merged().showView(query);

      // Get all Ids in the selection
      let ids = submissions.reduce((acc, s) => {
        if (s._id) {
          acc.push(s._id);
        }
        return acc;
      }, []);

      // Filter the ids
      sub = sub.filter(s => {
        return ids.includes(s._id);
      });
      return sub;
    },
    async handleReview(data) {
      let rows = this.selectedRows;
      if (rows.length > 1) {
        this.$swal({
          title: this.$t('Review for multiple rows'),
          text: this.$t("You can't review more than one row"),
          type: 'error',
        });
        return;
      }
      let submission = this.selectedRows[0];
      let err;

      await this.$swal({
        title: 'Loading...',
        text: this.$t(
          'Getting the submission. This can take a couple seconds...',
        ),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          [err, submission] = await to(this.loadSubmission(submission._id));

          if (err) {
            this.$swal.close();
          }
          this.$swal.close();
          this.$router.push({
            name: 'formio_submission_update',
            params: {
              idForm: this.form.data.path,
              idSubmission: submission.content._id,
              fullSubmision: {
                data: submission.content.data,
                _id: submission.content._id,
              },
              formio: submission.formio,
              FAST_EDIT_MODE: 'online-review',
            },
          });
        },
      });
    },
    async handleOnlineEdit(submission, formId) {
      let loadedSubmission = await this.loadSubmission(submission._id);
      this.$router.push({
        name: 'formio_submission_update',
        params: {
          idForm: formId,
          idSubmission: submission._id,
          fullSubmision: {
            data: loadedSubmission.content.data,
            _id: submission._id,
          },
          formio: loadedSubmission.formio,
          FAST_EDIT_MODE: 'online',
        },
      });
    },
    async loadSubmission(_id) {
      this.loading = true;
      let err;
      let submission;

      [err, submission] = await to(
        Submission.remote().find({
          form: this.form.data.path,
          filter: [
            {
              element: '_id',
              query: '=',
              value: _id,
            },
          ],
          limit: 1,
        }),
      );

      if (err) {
        this.$swal.close();
        this.$swal(
          this.$t('Conexion error'),
          this.$t("We couldn't get the submission from the server"),
          'error',
        );
        throw new Error('Submission was not retreived');
      }

      this.loading = false;
      return {
        content: submission[0],
      };
    },
    handleReport() {
      let rows = this.selectedRows;
      console.log('rows', rows);
      if (rows.length > 1) {
        this.$swal({
          title: this.$t('Report for multiple rows'),
          text: this.$t("You can't see the report more than one row"),
          type: 'error',
        });
        return;
      }
      let submission = this.selectedRows[0];
      console.log('submission', submission);
      this.$router.push({
        name: 'formio_submission_report',
        params: {
          idForm: this.form.data.path,
          idSubmission: submission._lid || submission._id,
        },
      });
    },
    handleDelete() {
      let rows = this.selectedRows;
      let self = this;
      if (rows.length === 0) {
        this.$swal({
          title: this.$t('No row selected'),
          text: this.$t('You must select at least one row to delete'),
          type: 'error',
        });
        return;
      }
      this.$swal({
        title: this.$t('Are you sure?'),
        text: this.$t("You won't be able to revert this!"),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('Yes, delete it!'),
        cancelButtonText: this.$t('Cancel'),
      }).then(async () => {
        Promise.each(rows, async submission => {
          let deleteSubmission = await Submission.local().find({
            filter: {
              _id: submission._id,
            },
          });

          if (deleteSubmission.length === 0) {
            throw new Error('cannot delete an online submission');
          }
          await Submission.local().findAndRemove({
            _id: deleteSubmission[0]._id,
          });
        })
          .then(async () => {
            this.$emit('refresh');
            self.$swal(
              this.$t('Deleted!'),
              this.$t('Your submission has been deleted.'),
              'success',
            );
          })
          .catch(error => {
            console.log(error);
            this.$swal(
              this.$t('Error!'),
              this.$t("Can't delete online submission."),
              'error',
            );
          });
      });
    },
    async importSubmission() {
      const file = await this.$swal({
        title: this.$t('Select your JSON file'),
        input: 'file',
        inputAttributes: {
          accept: '.json',
          'aria-label': this.$t('Upload your JSON File'),
        },
      });
      if (file) {
        Import.fromJsonFile(file, this);
      }
    },
    displayError(error) {
      let errorString = ErrorFormatter.format(error);
      this.$swal({
        title: error.name,
        type: 'info',
        html: errorString,
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonText: 'OK',
      });
    },
    goToCreateView() {
      let formId = this.form.data.path;
      if (
        this.form.data &&
        this.form.data.properties &&
        this.form.data.properties['create-view']
      ) {
        formId = this.form.data.properties['create-view'];
      }
      this.$router.push({
        name: 'formio_form_submission',
        params: {
          idForm: formId,
        },
      });
    },
    goToEditView(props) {
      let rows = this.selectedRows;
      if (rows.length > 1) {
        this.$swal({
          title: this.$t('Edit Multiple Rows'),
          text: this.$t("You can't edit more than one row"),
          type: 'error',
        });
        return;
      }
      let submission = this.selectedRows[0];
      let formId =
        _get(this.form, 'data.properties["edit-view"]') || this.form.data.path;
      if (submission.status === 'online' && !submission._lid) {
        this.handleOnlineEdit(submission, formId);
        return;
      }
      let submissionId = submission._lid || submission._id;
      this.$router.push({
        name: 'formio_submission_update',
        params: {
          idForm: formId,
          idSubmission: submissionId,
        },
      });
    },
    async editCell(data) {
      const value = await this.$swal({
        // The title must be replced by a compound ID from FORM.io dg property
        title: data.col.label,
        input: 'text',
        inputPlaceholder: 'Enter amount for ' + data.col.label,
        inputValue: data.data,
        showCancelButton: true,
      });

      if (value) {
        this.data[data.row.__index][data.col.field] = value;
        /* this.rerender()
        let autoSave = new CustomEvent("autoSaveDraft", {
          detail: {
            data: {
              trigger: 'editGrid'
            },
            text: "Autosave Requested"
          }
        });
        document.dispatchEvent(autoSave);
        */
      }
    },
  },
  computed: {
    columns() {
      return Columns.get({
        form: this.form.data,
        data: this.data,
        fastMode: this.fastMode,
        vm: this,
      });
    },
  },
  data() {
    return {
      show: true,
      config: {
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        rowHeight: '50px',
        responsive: false,
        pagination: {
          rowsPerPage: 10,
          options: [10, 30, 50, 100],
        },
        messages: {
          noData: this.$t('No data available to show.'),
          noDataAfterFiltering: this.$t(
            'No results. Please refine your search terms.',
          ),
        },
        // (optional) Override default labels. Useful for I18n.
        labels: {
          columns: this.$t('Columns'),
          allCols: this.$t('All Columns'),
          rows: this.$t('Rows'),
          selected: {
            singular: this.$t('item selected.'),
            plural: this.$t('items selected.'),
          },
          clear: this.$t('Clear Selection'),
          search: this.$t('Search'),
          all: this.$t('All'),
        },
        selection: this.fastMode !== 'editGrid' ? 'multiple' : 0,
      },
      selectedRows: [],
      clickedRow: null,
      visibleColumns: [],
    };
  },
};
</script>




