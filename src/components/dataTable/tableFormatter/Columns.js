import FormioUtils from "formiojs/utils";

let Columns = class {
  static get({ form, data, fastMode, vm }) {
    let noForm = !!(!form || form.title === "")
    // If there is no Form
    if (noForm) {
      return [{}];
    }

    switch (fastMode) {
      case 'show':
        return Columns.getShow({ form, data, fastMode, vm })
        break;
      case 'show-admin':
        return Columns.getShowAdmin({ form, data, fastMode, vm })
        break;
      case 'editGrid':
        return Columns.getEditGrid({ form, data, fastMode, vm })
        break;
    }
  }

  static getShow({ form, data, fastMode, vm }) {
    let columns = [];
    // First two Columns for the Table
    columns.push(
      {
        label: vm.$t("Status"),
        field: "status",
        filter: true,
        sort: true,
        width: "90px"
      },
      {
        label: vm.$t("Updated at"),
        field: "HumanUpdated",
        filter: true,
        sort: true,
        width: "150px"
      }
    );
    // If we have a normal table
    let visibleColumns = Columns.getTableView(form)

    columns = columns.concat(Columns.format({ visibleColumns, vm }))
    // Add the last column for the actions
    columns.push({
      label: "Actions",
      field: "actions",
      filter: false,
      sort: false,
      width: "150px"
    });

    return columns
  }

  static getEditGrid({ form, data, fastMode, vm }) {
    let columns = []
    let wantedKeys = Object.keys(data[0]);
    // If we have and edit table
    let visibleColumns = FormioUtils.findComponents(
      form.components,
      {
        input: true,
        tableView: true
      }
    ).filter(o => {
      return wantedKeys.includes(o.key);
    });
    columns = columns.concat(Columns.format({ visibleColumns, vm }))

    return columns
  }

  static format({ visibleColumns, vm }) {
    let columns = []
    // Create the column given the component
    visibleColumns.forEach((column, index) => {
      let visibleColum = {
        label: vm.$t(column.label),
        field: column.key,
        filter: true,
        sort: true,
        width: "200px"
      };
      columns.push(visibleColum);
    });

    return columns
  }

  static getShowAdmin({ form, data, fastMode, vm }) {
    let columns = [];
    // If we have a normal table
    let visibleColumns = Columns.getTableView(form)

    columns = columns.concat(Columns.format({ visibleColumns, vm }))
    // Add the last column for the actions
    columns.push({
      label: "Actions",
      field: "actions",
      filter: false,
      sort: false,
      width: "150px"
    });

    return columns
  }

  static getTableView(form) {
    return FormioUtils.findComponents(
      form.components,
      {
        input: true,
        tableView: true
      }
    )
      .slice(0, 7)
      .filter(c => {
        return !!(c.label !== "");
      });
  }
}
export default Columns
