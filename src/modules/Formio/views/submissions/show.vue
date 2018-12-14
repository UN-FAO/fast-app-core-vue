<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 responsiveTableContainer">
      <q-card>
        <q-card-title>
          <breadcrum
            v-bind:class="$getDirection()"
            :parent="$route.query.parent"
            :currentPageTitle="formTitle"
          />
          <q-icon
            slot="right"
            name="fa-plus-circle"
            @click="goToCreateView()"
            color="primary"
            style="cursor:pointer; padding-right: 20px"
          ></q-icon>
          <q-icon slot="right" name="more_vert" color="grey" style="cursor:pointer">
            <q-popover ref="popover">
              <q-list link class="no-border" dense separator no-border>
                <q-item @click="$refs.popover.close(), createDialog()">
                  <q-item-side icon="fa-download"/>
                  <q-item-main :label="$t('Export')"/>
                </q-item>
                <!--
                <q-item @click="$refs.popover.close()">
                  <q-item-side icon="fa-upload"/>
                  <q-item-main :label="$t('Import')"/>
                </q-item>
                -->
              </q-list>
            </q-popover>
          </q-icon>
        </q-card-title>
        <q-card-main style="padding: 0px; min-height: 150px" class="relative-position">
          <datatable
            :data="submissions"
            :form="currentForm"
            :menuActions="['create', 'export', 'import']"
            :tableActions="$FAST_CONFIG.HAS_REPORT ? ['read-only','edit', 'delete', 'report'] : ['edit', 'delete', 'read-only']"
            fastMode="show"
            v-on:refresh="refreshData"
            v-if="!noSubmissions"
          >
            <!--
            <template slot="col-custom-content" scope="scope" v-if="formTitle === 'Scripts'">
              <q-btn color="primary" @click="executeScript(scope.row._id)">
                {{$t('Execute')}}
              </q-btn>
            </template>
            -->
          </datatable>
          <loading :visible="noSubmissions"></loading>
        </q-card-main>
      </q-card>
    </div>

    <sweet-modal ref="resultModal" title="Results">
      <q-input
        :min-rows="5"
        v-model="scriptResult.stdout"
        disable
        type="textarea"
        float-label="Std Output"
      />
      <q-input
        :min-rows="5"
        v-model="scriptResult.valout"
        disable
        type="textarea"
        float-label="Value Output"
      />
      <q-input
        :min-rows="5"
        v-model="scriptResult.consoleout"
        disable
        type="textarea"
        float-label="Console Output"
      />

      <q-btn color="primary" slot="button" @click="saveOutput">{{ $t('Save Output') }}</q-btn>
    </sweet-modal>
  </div>
</template>

<style>
.sweet-modal {
  max-height: 90% !important;
}

.sweet-modal > .sweet-title {
  margin-top: 20px;
}
</style>


<script>
import loading from "components/loading";
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
  QInput,
  QBtn
} from "quasar";
import { Fluent } from "fast-fluent";
import { SweetModal } from "sweet-modal-vue";
import datatable from "components/dataTable/dataTable";
import breadcrum from "components/breadcrum";
import { Form, Event, Submission, Auth } from "fast-fastjs";
import createSubmission from "components/createSubmission";
import RExecutor from "../../components/Rexecutor/Rexecutor";

export default {
  async mounted() {
    this.currentForm = await Form.local()
      .where("data.path", "=", this.$route.params.idForm)
      .first();

    await this.refreshData();

    Event.listen({
      name: "FAST:SUBMISSION:SYNCED",
      callback: this.handleDataSynced
    });
    Event.listen({
      name: "FAST:DATA:IMPORTED",
      callback: this.handleDataImported
    });

    this.$eventHub.on("FAST:LANGUAGE:CHANGED", async data => {
      await this.refreshData();
    });
  },
  beforeDestroy() {
    Event.remove({
      name: "FAST:SUBMISSION:SYNCED",
      callback: this.handleDataSynced
    });
  },
  computed: {
    formTitle() {
      let title = "";
      if (this.currentForm) {
        title = this.currentForm.data ? this.currentForm.data.title : "";
      }
      return this.$t(title);
    },
    breadcrum() {
      return "Home";
    },
    noSubmissions() {
      return typeof this.submissions === "undefined";
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
    QOptionGroup,
    QInput,
    SweetModal
  },
  data() {
    return {
      currentForm: {},
      submissions: undefined,
      scriptResult: {
        valout: "",
        stdout: "",
        consoleout: ""
      }
    };
  },
  methods: {
    async executeScript(submissionId) {
      this.$swal.showLoading();

      const Script = Fluent.model({
        properties: {
          name: "Script",
          config: {
            remote: {
              path: "script"
            }
          }
        }
      });

      const submission = await Script()
        .remote()
        .where("_id", "=", submissionId)
        .first();
      this.scriptResult.script = submission;

      const fullScript = RExecutor.getFullScript({
        token: Auth.user().x_jwt_token,
        submission,
        formioUrl: this.$FAST_CONFIG.APP_URL
      });

      const { stdout, valout, consoleout } = await RExecutor.executeScript({
        fullScript,
        openCpuUrl: this.$FAST_CONFIG.OPEN_CPU_URL
      });

      this.scriptResult.dateExecuted = new Date().toISOString();
      this.scriptResult.stdout = stdout;
      this.scriptResult.valout = valout;
      this.scriptResult.consoleout = consoleout;

      this.$swal.close();
      this.$refs.resultModal.open();
    },
    async saveOutput() {
      this.$refs.resultModal.close();
      this.$swal.showLoading();

      const ScriptLog = Fluent.model({
        properties: {
          name: "ScriptLog",
          config: {
            remote: {
              path: "scriptlog"
            }
          }
        }
      })();

      try {
        await ScriptLog.remote().insert({ data: { ...this.scriptResult } });
      } catch (e) {
        console.log(e);
      }

      this.$swal.close();
    },
    async goToCreateView() {
      const route = await createSubmission.withData({
        email: Auth.email(),
        appUrl: this.$FAST_CONFIG.APP_URL,
        path: this.$route.params.idForm,
        parent: this.$route.query.parent,
        data: {}
      });

      this.$router.push(route);
    },
    breadCrumClick() {
      this.$router.push({
        name: "pageManager",
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
        name: "FAST:EXPORT:OPENMENU",
        data: {},
        text: "Triggering Open Export Menu"
      });
    },
    async handleDataImported() {
      await this.refreshData();
      Loading.hide();
      this.$swal("Imported!", "Your submission were imported", "success");
    },
    async handleDataSynced() {
      await this.refreshData();
      Toast.create.positive({ html: "Your data was uploaded!" });
    },
    async refreshData() {
      let path = this.$route.params.idForm;
      let submissions = await Submission({ path }).showView({
        limit: 50000,
        owner: Auth.user()._id
      });
      this.submissions = submissions;
    }
  }
};
</script>
