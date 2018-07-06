import FormioUtils from 'formiojs/utils';
let ErrorFormatter = (() => {
  function format({ errors, vm }) {
    let errorString =
      '<div style="overflow-x:auto;"><table class="restable"><thead> <tr><th scope="col">' +
      vm.$t('Field label') +
      '</th><th scope="col">' +
      vm.$t('Error') +
      '</th></thead><tbody>';

    errors.details.forEach((detail) => {
      let components = vm.currentForm.data
        ? vm.currentForm.data.components
        : vm.currentForm.components;
      let component = FormioUtils.getComponent(components, detail.path[0]);
      let label = component ? vm.$t(component.label) : '';
      errorString = errorString + '<tr>';
      errorString =
        errorString +
        '<td data-label=' +
        vm.$t('Field label') +
        '>' +
        label +
        '</td>';
      errorString =
        errorString +
        '<td data-label=' +
        vm.$t('Error') +
        '>' +
        detail.message +
        '</td>';
      errorString = errorString + '</tr>';
    });
    errorString = errorString + '</tbody></table></div>';

    return errorString;
  }
  return Object.freeze({
    format
  });
})();
export default ErrorFormatter;
