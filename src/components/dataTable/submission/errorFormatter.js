import FormioUtils from "formiojs/utils";
let ErrorFormatter = (() => {
  function format({ errors }) {
    let errorString =
      '<div style="overflow-x:auto;"><table class="restable"><thead> <tr><th scope="col">' +
      this.$t("Label") +
      '</th><th scope="col">' +
      this.$t("Code") +
      '</th><th scope="col">' +
      this.$t("Module") +
      "</th></tr></thead><tbody>";

    errors.details.forEach(detail => {
      let component = FormioUtils.getComponent(
        this.currentForm.data.components,
        detail.path[0]
      );
      let label = component ? this.$t(component.label) + ": " : "";
      errorString = errorString + "<tr>";
      errorString =
        errorString +
        "<td data-label=" +
        this.$t("Label") +
        ">" +
        label +
        "</td>";
      errorString =
        errorString +
        "<td data-label=" +
        this.$t("Code") +
        ">" +
        detail.message +
        "</td>";
      errorString =
        errorString +
        "<td data-label=" +
        this.$t("Module") +
        ">" +
        detail.message +
        "</td>";
      errorString = errorString + "</tr>";
    });
    errorString = errorString + "</tbody></table></div>";
  }
  return Object.freeze({
    format
  });
})()
export default ErrorFormatter
