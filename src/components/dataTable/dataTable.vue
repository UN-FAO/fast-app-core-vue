<template>
<div class="tableContainer" v-if="show">
    <q-data-table
      :data="data"
      :config="config"
      :columns="columns"
      @selection="handleSelectionChange"
      @rowclick="handleRowClick"
    >
        <template :slot="'col-' + col.field" scope='scope' v-for="col in columns">
            <q-btn
              flat
              color="black"
              @click="editCell(scope)"
              v-bind:key="col.field"
              v-if="fastMode === 'editGrid' && col.field.indexOf('val') >= 0"
            >
                {{scope.data ? scope.data : '-'}}
            </q-btn>
            <span v-bind:key="col.field" v-else>
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
            <i
              class="material-icons"
              style="color: red;font-size: x-large; cursor: pointer;"
              v-if="scope.row.syncError && scope.row.syncError !=='Unauthorized' "
              @click="displayError(scope.row.syncError)"
            >block</i>
            <i class="material-icons" style="color: red;font-size: x-large; cursor: pointer;"
              v-if="scope.row.syncError && scope.row.syncError ==='Unauthorized' "
              @click="displayError(scope.row.syncError)">block</i>
        </template>

        <template slot="selection">
            <q-btn v-if="tableActions && tableActions.includes('review')" color="primary" flat @click='handleReview({readOnly:false})'>
                <q-icon name="remove_red_eye" />
                <q-tooltip>{{$t('Review')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="tableActions && tableActions.includes('read-only')" color="primary" flat @click='handleReview({readOnly:true})'>
                <q-icon name="remove_red_eye" />
                <q-tooltip>{{$t('Read Only')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="tableActions && tableActions.includes('edit')" color="primary" flat @click='goToEditView()'>
                <q-icon name="edit" />
                <q-tooltip>{{$t('Edit')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="tableActions && tableActions.includes('report')" color="primary" flat @click='handleReport()'>
                <q-icon name="assignment" />
                <q-tooltip>{{$t('Report')}}</q-tooltip>
            </q-btn>

            <q-btn flat v-if="tableActions && tableActions.includes('delete')" color="grey" @click="handleDelete()">
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

    <export-menu render="outside" :actions="menuActions" />
</div>
</template>

<script>
import _get from 'lodash/get';
import _camelCase from 'lodash/camelCase';
import Promise from 'bluebird';
import exportMenu from './exportMenu';
import Export from './dataExport/Export';
import Columns from './tableFormatter/Columns';
import { QTooltip, QBtn, QDataTable, QChip, QIcon } from 'quasar';
import { Import, Submission, Auth } from 'fast-fastjs';
import ErrorFormatter from 'components/dataTable/submission/errorFormatter';

export default {
  components: {
    QIcon,
    QTooltip,
    QBtn,
    QDataTable,
    QChip,
    exportMenu
  },
  name: 'datatable',
  props: {
    data: {
      required: true
    },
    form: {
      required: true
    },
    tableActions: {
      required: false,
      type: Array,
      default: () => {
        [];
      }
    },
    menuActions: {
      required: false,
      type: Array,
      default: () => {
        [];
      }
    },
    fastMode: {
      required: false,
      type: String,
      default: false
    }
  },
  mounted() {
    this.$eventHub.on('FAST:EXPORT', (params) => {
      this.exportTo(params);
    });
    this.$eventHub.on('FAST:IMPORT', (type) => {
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
    this.$eventHub.off('FAST:LANGUAGE:CHANGED');
  },
  watch: {
    data: function(data) {},
    form: function(data) {},
    tableActions: function(data) {},
    menuActions: function(data) {}
  },
  methods: {
    isOnlineSubmission(_id, _lid) {
      return !_lid && _id.indexOf('_local') < 0;
    },
    async exportTo(params) {
      this.$swal({
        title: 'Exporting...',
        text: this.$t(
          'Wait until the file is ready. This can take a couple minutes...'
        ),
        showCancelButton: false,
        onOpen: async () => {
          this.$swal.showLoading();
          let data = [];
          data = this.selectedRows.length === 0 ? this.data : this.selectedRows;
          let submissions = await this.getFullSubmissions(data, params.options);
          let date = new Date()
            .toJSON()
            .replace(/-/g, '')
            .replace(/T/g, '_')
            .replace(/:/g, '')
            .slice(0, 15);

          let fileName = _camelCase(this.form.data.title) + '_' + date;

          await Export.jsonTo({
            fileName: fileName,
            output: params.format,
            options: params.options,
            data: submissions,
            formioForm: this.form.data,
            vm: this
          });
          this.$swal(
            this.$t('Exported!'),
            this.$t('The file has been exported. File name:') +
              '<br><strong>' +
              fileName +
              '</strong>',
            'success'
          );
        }
      });
    },
    handleSelectionChange(number, rows) {
      this.selectedRows = rows.map((r) => {
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
          'data.user_email': Auth.email()
        },
        dataExport: true
      };

      if (options && options.includes('ownerEmail')) {
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
      sub = sub.filter((s) => {
        return ids.includes(s._id);
      });
      return sub;
    },
    async handleReview({ readOnly }) {
      let rows = this.selectedRows;
      if (rows.length > 1) {
        this.$swal({
          title: this.$t('Review for multiple rows'),
          text: this.$t("You can't review more than one row"),
          type: 'error'
        });
        return;
      }
      let submission = this.selectedRows[0];
      this.$router.push({
        name: 'formio_submission_update',
        query: {
          mode: readOnly ? 'read-only' : 'online-review',
          parent: !readOnly
            ? btoa(
                JSON.stringify({
                  isInternal: true,
                  url: 'alldata',
                  title: this.$t('All Data')
                })
              )
            : this.$route.query.parent
        },
        params: {
          idForm: this.form.data.path,
          idSubmission: submission._id
        }
      });
    },
    async handleOnlineEdit(submission, formId) {
      this.$router.push({
        name: 'formio_submission_update',
        query: {
          mode: 'online',
          parent: this.$route.query.parent
        },
        params: {
          idForm: formId,
          idSubmission: submission._id
        }
      });
    },
    handleReport() {
      let rows = this.selectedRows;

      if (rows.length > 1) {
        this.$swal({
          title: this.$t('Report for multiple rows'),
          text: this.$t("You can't see the report more than one row"),
          type: 'error'
        });
        return;
      }
      let submission = this.selectedRows[0];

      this.$router.push({
        name: 'formio_submission_report',
        params: {
          idForm: this.form.data.path,
          idSubmission: submission._lid || submission._id
        },
        query: {
          parent: this.$route.query.parent
        }
      });
    },
    handleDelete() {
      let rows = this.selectedRows;
      let self = this;
      if (rows.length === 0) {
        this.$swal({
          title: this.$t('No row selected'),
          text: this.$t('You must select at least one row to delete'),
          type: 'error'
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
        cancelButtonText: this.$t('Cancel')
      }).then(async () => {
        Promise.each(rows, async (submission) => {
          if (
            submission._id &&
            submission._id.indexOf('local') < 0 &&
            !submission._lid
          ) {
            await Submission.remote().remove(
              null,
              submission._id,
              this.form.data.path
            );
          } else {
            await Submission.local().findAndRemove({
              _id: submission._id
            });
          }
        })
          .then(async () => {
            this.$emit('refresh');
            self.$swal(
              this.$t('Deleted!'),
              this.$t('Your submission has been deleted.'),
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            this.$swal(
              this.$t('Error!'),
              this.$t("Can't delete online submission."),
              'error'
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
          'aria-label': this.$t('Upload your JSON File')
        }
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
        confirmButtonText: 'OK'
      });
    },
    goToCreateView() {
      let formId =
        _get(this.form, 'data.properties["fast-create-view"]') ||
        this.form.data.path;

      this.$router.push({
        name: 'formio_form_submission',
        params: {
          idForm: formId
        },
        query: {
          parent: this.$route.query.parent
        }
      });
    },
    goToEditView() {
      let rows = this.selectedRows;
      if (rows.length > 1) {
        this.$swal({
          title: this.$t('Edit Multiple Rows'),
          text: this.$t("You can't edit more than one row"),
          type: 'error'
        });
        return;
      }
      let submission = this.selectedRows[0];
      let formId =
        _get(this.form, 'data.properties["fast-edit-view"]') ||
        this.form.data.path;
      if (submission.status === 'online' && !submission._lid) {
        this.handleOnlineEdit(submission, formId);
        return;
      }
      let submissionId = submission._lid || submission._id;
      this.$router.push({
        name: 'formio_submission_update',
        params: {
          idForm: formId,
          idSubmission: submissionId
        },
        query: {
          parent: this.$route.query.parent
        }
      });
    },
    async editCell(data) {
      const value = await this.$swal({
        // The title must be replced by a compound ID from FORM.io dg property
        title: data.col.label,
        input: 'text',
        inputPlaceholder: 'Enter amount for ' + data.col.label,
        inputValue: data.data,
        showCancelButton: true
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
    }
  },
  computed: {
    columns() {
      return Columns.get({
        form: this.form.data,
        data: this.data,
        fastMode: this.fastMode,
        vm: this
      });
    }
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
          options: [10, 30, 50, 100, 200]
        },
        messages: {
          noData: this.$t('No data available to show.'),
          noDataAfterFiltering: this.$t(
            'No results. Please refine your search terms.'
          )
        },
        // (optional) Override default labels. Useful for I18n.
        labels: {
          columns: this.$t('Columns'),
          allCols: this.$t('All Columns'),
          rows: this.$t('Rows'),
          selected: {
            singular: this.$t('item selected.'),
            plural: this.$t('items selected.')
          },
          clear: this.$t('Clear Selection'),
          search: this.$t('Search'),
          all: this.$t('All')
        },
        selection: this.fastMode !== 'editGrid' ? 'multiple' : false
      },
      selectedRows: [],
      clickedRow: null,
      visibleColumns: []
    };
  }
};
</script>




