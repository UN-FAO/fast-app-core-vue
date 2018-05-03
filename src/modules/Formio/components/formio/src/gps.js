import { Loading } from 'quasar';

const GPS = class {
  /**
   * [listen description]
   * @param  {[type]} vm [description]
   * @return {[type]}    [description]
   */
  static listen(vm) {
    let gpsRequested = (e) => {
      Loading.show({
        message: vm.$t('Getting GPS information'),
        spinnerSize: 100
      });
    };

    let gpsSucceeded = (e) => {
      Loading.hide();
      // vm.renderForm()
      vm.$swal(
        vm.$t('GPS Registered!'),
        vm.$t('Your GPS position was detected'),
        'success'
      );
    };

    let gpsError = (e) => {
      Loading.hide();
      vm.$swal(
        vm.$t('GPS Error!'),
        vm.$t('We could not get your GPS position'),
        'error'
      );
    };
    // Remove previous registered events listeners
    document.removeEventListener('gpsSucceeded', gpsSucceeded, false);
    document.removeEventListener('gpsRequested', gpsRequested, false);
    document.removeEventListener('gpsError', gpsError, false);

    // Register the event listeners for this functionallity
    document.addEventListener('gpsRequested', gpsRequested);

    document.addEventListener('gpsError', gpsError);

    document.addEventListener('gpsSucceeded', gpsSucceeded);
  }
};
export default GPS;
