<template>
<div class="row FormioContainer">
    <q-card class="col-xl-10 col-lg-10  col-md-12 col-sm-12 col-lg-offset-1 col-md-offset-1 col-xl-offset-1" style="position:inherit !important;">

         <div class="row" style="color:black">

    <div style="width:100%" class="relative-position">

      <q-card-main>
        <q-card-title>
           <breadcrum
                :parent="$route.query.parent"
                :currentPageTitle="this.$t('All Data')"
              />
          <q-select
        filter
        separator
        autofocus-filter
        v-model="selectedForm"
        :options="formList"
        stack-label="Select your form"
        filter-placeholder="Search for the form"
        style="border-bottom: 1px solid grey; width: 50%"
        clearable
      />
          <span v-if="formTitle !== ''">Form:</span> {{formTitle}}
          <q-icon v-if="formTitle !== ''" slot="right" name="more_vert" color="grey" style="cursor:pointer">
              <q-popover ref="popover">
                <q-list link class="no-border" dense separator no-border>

                  <q-item @click="$refs.popover.close(), createDialog()">
                    <q-item-side icon="fa-download"  />
                    <q-item-main :label="$t('Export')" />
                  </q-item>

                  <q-item @click="$refs.popover.close()">
                    <q-item-side icon="fa-upload"  />
                    <q-item-main :label="$t('Import')" />
                  </q-item>

                </q-list>
              </q-popover>
            </q-icon>
        </q-card-title>

        <datatable
          :data="submissions"
          :form="currentForm"
          :menuActions="['create', 'export']"
          :tableActions="['review']"
          fastMode="show-admin"
          v-if="currentForm && currentForm.data.title !== '' && submissions"
        />
      </q-card-main>

      <q-inner-loading :visible="loading">
        <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
      </q-inner-loading>

    </div>
  </div>

    </q-card>

</div>

</template>

<script>
import {
  QCard,
  QSelect,
  QCardMain,
  QInnerLoading,
  QSpinnerAudio,
  QCardTitle,
  QItemSide,
  QItemMain,
  QPopover,
  QIcon,
  QList,
  QItem
} from 'quasar';
import { Form, Submission, Auth, Event } from 'fast-fastjs';
import FormioUtils from 'formiojs/utils';
import datatable from 'components/dataTable/dataTable';
import Columns from 'components/dataTable/tableFormatter/Columns';
import breadcrum from 'components/breadcrum';
export default {
  async mounted() {
    this.$eventHub.on('FAST:LANGUAGE:CHANGED', async (data) => {
      await this.updateLocalSubmissions();
    });
    this.selectedForm = this.$route.query && this.$route.query.form;
  },
  methods: {
    async createDialog() {
      Event.emit({
        name: 'FAST:EXPORT:OPENMENU',
        data: undefined,
        text: 'Triggering Open Export Menu'
      });
    }
  },
  asyncData: {
    formList: {
      get() {
        return Form.local().find();
      },
      transform(result) {
        let forms = result.reduce((filtered, form) => {
          if (
            form.data &&
            form.data.tags &&
            form.data.tags.indexOf('visible') > -1
          ) {
            filtered.push({
              label: form.data.title,
              value: form.data.path
            });
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
        if (this.selectedForm && this.selectedForm !== '') {
          return Form.local().findOne({
            'data.path': this.selectedForm
          });
        } else {
          return {
            data: {
              title: ''
            }
          };
        }
      },
      transform(result) {
        return result;
      },
      watch() {
        this.selectedForm;
      }
    },
    submissions: {
      async get() {
        if (this.currentForm.data && this.currentForm.data.title === '') {
          return null;
        }
        this.loading = true;
        let queryParams = {
          form: this.currentForm.data && this.currentForm.data.path,
          limit: 1000,
          select: Columns.getTableView(this.currentForm.data).map(
            (o) => 'data.' + o.path
          ),
          vm: this
        };

        queryParams.filter =
          Auth.hasRole('Reviewer') && !Auth.hasRole('Administrator')
            ? [
                {
                  element: 'data.country',
                  query: 'in',
                  value: Auth.user().data.countries
                }
              ]
            : null;

        let submissions = await Submission.remote().showView(queryParams);
        this.loading = false;
        return submissions;
      },
      transform(submissions) {
        return submissions && submissions.results ? submissions.results : [];
      },
      watch() {
        this.currentForm;
      }
    }
  },
  computed: {
    formTitle() {
      let title = '';
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : '';
      }
      return this.$t(title);
    },
    columns() {
      if (!this.currentForm || this.currentForm.data.title === '') {
        return [
          {
            label: 'Longitude',
            field: 'longitude',
            filter: true,
            sort: true
          },
          {
            label: 'Another',
            field: 'another',
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
      this.visibleColumns = this.visibleColumns.slice(0, 7);
      let columns = [];
      this.visibleColumns = this.visibleColumns.filter((c) => {
        return !!(c.label !== '');
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
      columns.push({
        label: 'Review',
        field: 'review',
        filter: false,
        sort: false
      });
      return columns;
    }
  },
  components: {
    breadcrum,
    datatable,
    QSelect,
    QCard,
    QCardMain,
    QInnerLoading,
    QSpinnerAudio,
    QCardTitle,
    QItemSide,
    QItemMain,
    QPopover,
    QIcon,
    QList,
    QItem
  },
  data() {
    return {
      loading: false,
      formList: [],
      selectedForm: null
    };
  },
  beforeDestroy() {
    this.$eventHub.off('FAST-DATA_SYNCED');
    this.$eventHub.off('FAST-DATA_IMPORTED');
    this.$eventHub.off('FAST:LANGUAGE:CHANGED');
  }
};
</script>
