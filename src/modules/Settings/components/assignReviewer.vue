<template>
<div style="color:black" class="row justify-center">
   <div class="relative-position">

     <div class="section-title pageTitle" style="margin:auto">
          {{ $t("Data Reviewers") }}
        </div>

        <div style="width:100%;color:grey">
         <hr>
        </div>

 <q-data-table
    :data="users"
    :config="config"
    :columns="columns"
    >

    <template slot="col-isReviewer" scope="scope">
      <span v-if="scope.row.isReviewer && scope.row.countries" v-for="country in scope.row.countries" v-bind:key="country" >
        <q-chip  :color="scope.row.isReviewer ? 'primary' : 'red'" style="margin-top:5px">
          {{getCountry(country)}}
        </q-chip>
        <br>
      </span>

    </template>


      <template slot='col-action' scope='scope'>
                <q-btn color="primary" round small  @click='handleEdit(scope)'> <i class="material-icons edit" >edit</i>
                  <q-tooltip>{{$t('Edit')}}</q-tooltip>
                </q-btn>

      </template>
  </q-data-table>
    <q-inner-loading :visible="loading">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>

  </div>
</div>
</template>
<script>
import User from "database/models/User";
import {
  QDataTable,
  QSelect,
  QChip,
  QBtn,
  QTooltip,
  QSpinnerGears,
  QInnerLoading
} from "quasar";
import countryList from "database/resources/countries.json";
export default {
  name: "reviewer",
  components: {
    QDataTable,
    QSelect,
    QChip,
    QBtn,
    QTooltip,
    QSpinnerGears,
    QInnerLoading
  },
  data() {
    return {
      loading: false,
      countries: null,
      userSelect: [],
      countryList: countryList.map(c => {
        return { label: c.name, value: c.name };
      }),
      select: null,
      reviewers: [],
      users: [],
      config: {
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        rowHeight: "70px",
        responsive: true,
        pagination: {
          rowsPerPage: 50,
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
      columns: [
        {
          label: this.$t("Reviewer name"),
          field: "name",
          filter: true,
          sort: true
        },
        {
          label: this.$t("Reviewer email"),
          field: "email",
          filter: true,
          sort: true
        },
        {
          label: this.$t("Reviewer country"),
          field: "country",
          filter: true,
          sort: true
        },
        {
          label: this.$t("Scope"),
          field: "isReviewer",
          filter: false,
          sort: false
        },
        {
          label: this.$t("Action"),
          field: "action",
          filter: false,
          width: "110px"
        }
      ]
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      this.loading = true;
      let users = await User.remote().find();

      this.users = users.filter((obj, pos, arr) => {
        return (
          arr
            .map(mapObj => mapObj["data"]["email"])
            .indexOf(obj["data"]["email"]) === pos
        );
      });

      this.users = this.users.map(user => {
        let c = user.data;
        c._id = user._id;
        return c;
      });
      this.loading = false;
    },
    getCountry(code) {
      let country = countryList.filter(c => {
        return c.iso2 === code;
      });

      let name =
        country && country[0] && country[0].shortName
          ? country[0].shortName
          : code;
      return name;
    },
    handleEdit(data) {
      let user = data;
      this.$router.push({
        name: "formio_submission_update",
        params: {
          idForm: "user",
          idSubmission: user.row._id,
          fullSubmision: { data: user.row, _id: user.row._id },
          FAST_EDIT_MODE: "online"
        }
      });
    }
  }
};
</script>
