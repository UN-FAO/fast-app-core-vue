let phonePermissions = (() => {
  function check(permisson) {
    if (
      typeof cordova !== 'undefined' &&
      cordova &&
      cordova.plugins &&
      cordova.plugins.permissions
    ) {
      let permissions = cordova.plugins.permissions;
      // Check for Camara access
      permissions.checkPermission(
        permissions[permisson],
        function(status) {
          if (status.hasPermission) {
            // console.log(permisson + ' is ready');
          } else {
            console.warn(permisson + ' is not allowed, requesting access');
            permissions.requestPermission(
              permissions[permisson],
              function(status) {
                if (!status.hasPermission) {
                  console.warn(permisson + ' Access was not granted!');
                }
              },
              null
            );
          }
        },
        null
      );
    }
  }

  function get() {
    check('CAMARA');
    check('ACCESS_COARSE_LOCATION');
  }
  return Object.freeze({
    get
  });
})();
export default phonePermissions;
