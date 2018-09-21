/* eslint-disable */

(function() {
  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

var getGpsPosition = function(latitudField, longitudField) {
  // Create the events
  var requestedEvent = new CustomEvent('gpsRequested', {
    detail: {
      data: {
        latitudField: latitudField,
        longitudField: longitudField
      },
      text: 'GPS requested'
    }
  });
  var doneEvent = new CustomEvent('gpsSucceeded', {
    detail: {
      data: {
        latitudField: latitudField,
        longitudField: longitudField
      },
      text: 'GPS Succeeded'
    }
  });

  function error(e) {
    console.log('GPS error', e);
    var errorEvent = new CustomEvent('gpsError', {
      detail: {
        data: e,
        text: 'GPS Error'
      }
    });
    document.dispatchEvent(errorEvent);
  }

  function getLocation() {
    if (navigator.geolocation) {
      document.dispatchEvent(requestedEvent);
      navigator.geolocation.getCurrentPosition(showPosition, error, {
        maximumAge: 3000,
        timeout: 15000,
        enableHighAccuracy: true
      });
    } else {
      document.dispatchEvent(doneEvent);
      console.log('Geolocation is not supported by this browser.');
    }

    function showPosition(position) {
      try {
        document.getElementsByName('data[' + longitudField + ']')[0].value =
          position.coords.longitude;
        document.getElementsByName('data[' + latitudField + ']')[0].value =
          position.coords.latitude;
        document.dispatchEvent(doneEvent);
      } catch (error) {
        console.log('error', error);
        var errorEvent = new CustomEvent('gpsError', {
          detail: {
            data: error,
            text: 'GPS Error'
          }
        });
        document.dispatchEvent(errorEvent);
      }
    }
  }
  getLocation();
};

var FAST_SUBMISSION_CANCEL = function() {
  var cloneEvent = new CustomEvent('FAST:SUBMISSION:CANCEL', {
    detail: {
      data: {},
      text: 'SUBMISSION CANCELED'
    }
  });
  window.dispatchEvent(cloneEvent);
};

var FAST_SUBMISSION_CLONE = function() {
  var cloneEvent = new CustomEvent('FAST:SUBMISSION:CLONE', {
    detail: {
      data: {},
      text: 'SUBMISSION CLONED'
    }
  });
  window.dispatchEvent(cloneEvent);
};

var FAST_SUBMISSION_SOFTDELETE = function() {
  var cloneEvent = new CustomEvent('FAST:SUBMISSION:SOFTDELETE', {
    detail: {
      data: {},
      text: 'SUBMISSION SOFTDELETED'
    }
  });
  window.dispatchEvent(cloneEvent);
};

var FAST_WIZARD_NEXT = function() {
  var cloneEvent = new CustomEvent('FAST:WIZARD:NEXT', {
    detail: {
      data: {},
      text: 'WIZARD NEXT'
    }
  });
  window.dispatchEvent(cloneEvent);
};

var FAST_WIZARD_PREVIOUS = function() {
  var cloneEvent = new CustomEvent('FAST:WIZARD:PREVIOUS', {
    detail: {
      data: {},
      text: 'WIZARD PREVIOUS'
    }
  });
  window.dispatchEvent(cloneEvent);
};

var FAST_WIZARD_VALIDATE = function() {
  var cloneEvent = new CustomEvent('FAST:WIZARD:VALIDATE', {
    detail: {
      data: {},
      text: 'WIZARD VALIDATE'
    }
  });
  window.dispatchEvent(cloneEvent);
};
