import FormioUtils from "formiojs/utils";

let Columns = class {
  static get({ form, data, hasCustomColumn, fastMode, vm }) {
    let noForm = !!(!form || form.title === "");
    // If there is no Form
    if (noForm) {
      return [{}];
    }

    switch (fastMode) {
      case "show":
        return Columns.getShow({ form, data, hasCustomColumn, fastMode, vm });
        break;
      case "show-admin":
        return Columns.getShowAdmin({
          form,
          data,
          hasCustomColumn,
          fastMode,
          vm
        });
        break;
      case "editGrid":
        return Columns.getEditGrid({
          form,
          data,
          hasCustomColumn,
          fastMode,
          vm
        });
        break;
    }
  }

  static getShow({ form, data, hasCustomColumn, fastMode, vm }) {
    let columns = [];
    // First two Columns for the Table
    columns.push({
      label: "",
      field: "status",
      width: "45px"
    });
    // If we have a normal table
    let visibleColumns = Columns.getTableView(form);

    if (fastMode !== "show-admin") {
      visibleColumns.find((o, i) => {
        if (o.key === "deleted") {
          visibleColumns.splice(i, 1);
          return true; // stop searching
        }
      });
    }

    columns = columns.concat(Columns.format({ visibleColumns, vm }));
    // Add the last column for the actions
    /*
    columns.push({
      label: "Actions",
      field: "actions",
      filter: false,
      sort: false,
      width: "80px"
    });
    */

    columns.push({
      label: vm.$t("Updated at"),
      field: "HumanUpdated",
      filter: true,
      sort: true,
      width: "150px"
    });

    if (hasCustomColumn) {
      columns.push({
        field: "custom",
        filter: false,
        sort: false,
        width: "50px"
      });
    }
    return columns;
  }

  static getEditGrid({ form, data, hasCustomColumn, fastMode, vm }) {
    let columns = [];
    let wantedKeys = data && data[0] ? Object.keys(data[0]) : [];
    // If we have and edit table
    let visibleColumns = FormioUtils.findComponents(form.components, {
      input: true,
      tableView: true
    }).filter(o => {
      return wantedKeys.includes(o.key);
    });
    columns = columns.concat(Columns.format({ visibleColumns, vm }));

    return columns;
  }

  static format({ visibleColumns, vm }) {
    let columns = [];
    // Create the column given the component
    visibleColumns.forEach((column, index) => {
      let visibleColum = {
        label: vm.$t(column.label),
        field: column.key,
        filter: true,
        sort: true,
        type: "string",
        width: "110px"
      };
      columns.push(visibleColum);
    });

    return columns;
  }

  static getShowAdmin({ form, data, hasCustomColumn, fastMode, vm }) {
    let columns = [];
    // If we have a normal table
    let visibleColumns = Columns.getTableView(form);

    columns = columns.concat(Columns.format({ visibleColumns, vm }));
    // Add the last column for the actions

    /*
    columns.push({
      label: 'Actions',
      field: 'actions',
      filter: false,
      sort: false,
      width: '150px'
    });
    */

    return columns;
  }

  static getTableView(form) {
    return FormioUtils.findComponents(form.components, {
      input: true,
      tableView: true
    })
      .slice(0, 7)
      .filter(c => {
        return !!(c.label !== "");
      });
  }
};
export default Columns;
