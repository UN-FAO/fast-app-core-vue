<template>
  <div class="row">
        <div class="col-lg-12 col-md-12  col-sm-12 col-xs-12 responsiveTableContainer">
          <q-card>

            <q-card-title>

              <breadcrum
                :parent="$route.query.parent"
                :currentPageTitle="formTitle"
              />
           <q-icon slot="right" name="fa-plus-circle" @click="emitEvent('FAST:GO:CREATE')" color="primary" style="cursor:pointer; padding-right: 20px">

            </q-icon>

              <q-icon slot="right" name="more_vert" color="grey" style="cursor:pointer">
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
              <q-card-main style="padding: 0px; min-height: 150px" class="relative-position"  >

                <datatable
                  :data="submissions"
                  :form="currentForm"
                  :menuActions="['create', 'export', 'import']"
                  :tableActions="$FAST_CONFIG.HAS_REPORT ? ['read-only','edit', 'delete', 'report'] : ['edit', 'delete', 'read-only']"
                  fastMode="show"
                  v-on:refresh="refreshData"
                  v-if="!noSubmissions"
                />
                <loading :visible="noSubmissions"></loading>
            </q-card-main>
          </q-card>

         </div>

  </div>
</template>

<script>
import loading from 'components/loading';
import {
  QCard,
  QCardMain,
  QCardTitle,
  Toast,
  Loading,
  QPopover,
  QIcon,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QField,
  QOptionGroup,
  QBtn
} from 'quasar';
import datatable from 'components/dataTable/dataTable';
import breadcrum from 'components/breadcrum';
import { Form, Auth, Event, Submission } from 'fast-fastjs';
import Columns from 'components/dataTable/tableFormatter/Columns';

export default {
  async mounted() {
    this.currentForm = await Form.local().findOne({
      'data.path': this.$route.params.idForm
    });

    await this.refreshData();

    Event.listen({
      name: 'FAST:SUBMISSION:SYNCED',
      callback: this.handleDataSynced
    });
    Event.listen({
      name: 'FAST:DATA:IMPORTED',
      callback: this.handleDataImported
    });

    this.$eventHub.on('FAST:LANGUAGE:CHANGED', async (data) => {
      await this.refreshData();
    });
  },
  beforeDestroy() {
    Event.remove({
      name: 'FAST:SUBMISSION:SYNCED',
      callback: this.handleDataSynced
    });
  },
  computed: {
    formTitle() {
      let title = '';
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : '';
      }
      return this.$t(title);
    },
    breadcrum() {
      return 'Home';
    },
    noSubmissions() {
      return typeof this.submissions === 'undefined';
    }
  },
  components: {
    breadcrum,
    datatable,
    QCard,
    QCardMain,
    Toast,
    loading,
    QCardTitle,
    QPopover,
    QIcon,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QBtn,
    QField,
    QOptionGroup
  },
  data() {
    return {
      currentForm: {},
      submissions: undefined
    };
  },
  methods: {
    breadCrumClick() {
      this.$router.push({
        name: 'pageManager',
        params: {
          pageId: JSON.parse(window.atob(this.$route.query.parent)).url
        }
      });
    },
    emitEvent(event, params) {
      this.$eventHub.emit(event, params);
    },
    async createDialog() {
      Event.emit({
        name: 'FAST:EXPORT:OPENMENU',
        data: undefined,
        text: 'Triggering Open Export Menu'
      });
    },
    async handleDataImported() {
      await this.refreshData();
      Loading.hide();
      this.$swal('Imported!', 'Your submission were imported', 'success');
    },
    async handleDataSynced() {
      await this.refreshData();
      Toast.create.positive({ html: 'Your data was uploaded!' });
    },
    async refreshData() {
      let submissions = await Submission.merged().showView({
        form: this.$route.params.idForm,
        limit: 1000,
        filter: {
          'data.formio.formId': this.$route.params.idForm,
          'data.user_email': Auth.email()
        },
        select: Columns.getTableView(this.currentForm.data).map(
          (o) => 'data.' + o.path
        ),
        vm: this
      });
      this.submissions = submissions.results;
    }
  }
};
</script>
