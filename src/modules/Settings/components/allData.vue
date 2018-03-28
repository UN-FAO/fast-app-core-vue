<template>
  <div class="row" style="color:black">
    <div class="section-title pageTitle" style="margin:auto">
      {{ $t("All Data") }}
    </div>

    <div style="width:100%;color:grey">
      <hr>
    </div>

    <div style="width:100%" class="relative-position">
      <q-select filter separator autofocus-filter v-model="selectForm" :options="formList" stack-label="Select your form" filter-placeholder="Search for the form" style="border-bottom: 1px solid grey; width: 50%" clearable />

      <q-card-main>

        <h1 class="_control-label-title"><span v-if="formTitle !== ''">Form:</span> {{formTitle}}</h1>

        <datatable
          :data="submissions"
          :form="currentForm"
          :menuActions="['create', 'export']"
          :tableActions="['review']"
          fastMode="show-admin"
          v-if="currentForm && currentForm.data.title !== ''"
        />
      </q-card-main>

      <q-inner-loading :visible="loading">
        <q-spinner-audio size="50px" color="primary"></q-spinner-audio>
      </q-inner-loading>

    </div>
  </div>
</template>

<script>
import { QSelect, QCardMain, QInnerLoading, QSpinnerAudio } from "quasar";
import Form from "database/models/Form";
import FormioUtils from "formiojs/utils";
import datatable from "components/dataTable/dataTable";
import Submission from "database/models/Submission";
export default {
  async mounted() {
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
        if (this.selectForm && this.selectForm !== "") {
          return Form.local().findOne({
            "data.path": this.selectForm
          });
        } else {
          return {
            data: {
              title: ""
            }
          };
        }
      }
    },
    submissions: {
      async get() {
        if (this.currentForm.data.title === "") {
          return [];
        }
        this.loading = true;
        let sub = await Submission.remote().find({
          form: this.currentForm.data,
          select: this.columns.map(o => {
            return "data." + o.field;
          }),
          limit: 50000
        });

        sub = sub.map(s => {
          let data = s.data;
          data._id = s._id;
          return data;
        });
        this.loading = false;
        return sub;
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
      this.visibleColumns = this.visibleColumns.slice(0, 7);
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
      columns.push({
        label: "Review",
        field: "review",
        filter: false,
        sort: false
      });
      return columns;
    }
  },
  components: {
    datatable,
    QSelect,
    QCardMain,
    QInnerLoading,
    QSpinnerAudio
  },
  data() {
    return {
      loading: false,
      formList: [],
      selectForm: this.$route.query.form
    };
  },
  beforeDestroy() {
    this.$eventHub.off("FAST-DATA_SYNCED");
    this.$eventHub.off("FAST-DATA_IMPORTED");
    this.$eventHub.off("lenguageSelection");
  }
};
</script>
