<template>
<div style="color:black">

     <q-select
      filter
      v-model="select"
      :options="userSelect"
      separator
      autofocus-filter
      filter-placeholder="Search by email"
      stack-label="User to register as reviewer"
      style="border-bottom: 1px solid grey; width: 50%"
      clearable
    />

      <q-select
      filter
      separator
      autofocus-filter
      v-model="countries"
      :options="countryList"
      filter-placeholder="Search for the country"
      stack-label="Which country"
      style="border-bottom: 1px solid grey; width: 50%"
      clearable
    />

  <q-data-table
    :data="reviewers"
    :config="config"
    :columns="columns"
    >
  </q-data-table>
</div>
</template>
<script>
import User from "database/models/User";
import { QDataTable, QSelect } from "quasar";
import countryList from "database/resources/countries.json";
export default {
  name: "reviewer",
  components: {
    QDataTable,
    QSelect
  },
  data() {
    return {
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
          rowsPerPage: 100,
          options: [10, 30, 50, 100]
        },
        selection: "multiple",
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
          label: this.$t("Revision Scope"),
          field: "scope",
          filter: true,
          sort: true
        }
      ]
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      let users = await User.remote().find();
      this.users = users.filter(user => {
        return !user.data.IS_REVIEWER;
      });

      this.userSelect = this.users.map(user => {
        return {
          label: user.data.email,
          value: user._id
        };
      });

      this.userSelect = this.userSelect.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj["label"]).indexOf(obj["label"]) === pos;
      });
      this.reviewers = users.filter(user => {
        return !!user.data.IS_REVIEWER;
      });
    }
  }
};
</script>
