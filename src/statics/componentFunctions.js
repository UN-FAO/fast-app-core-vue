/**
 * Use the navigator GPS coordinates to
 * determine the position and put is on
 * a form element
 *
 * You can listen to this event as follows
 *    document.addEventListener("gpsRequested", function(e) {
 *      console.log(e);
 *    });
 * @param  {[type]} latitudField  [description]
 * @param  {[type]} longitudField [description]
 * @return {[type]}               [description]
 */
var gpsPositions = function (latitudField, longitudField) {
  // Create the event
  var event = new CustomEvent('gpsRequested',
    {
      'detail': {'data': data, 'text': 'GPS requested'}
    }
  )

  function error (e) {
    console.log('GPS error', e)
  }
  function getLocation () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, error, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true})
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
    function showPosition (position) {
      data[longitudField] = position.coords.longitude
      data[latitudField] = position.coords.latitude
      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(event)
    }
  }
  getLocation()
}

/**
 * Count all the elements in the array that 
 * are not empty values
 * @param  {[type]} elements [description]
 * @return {[type]}          [description]
 */
var countIfNotEmpty = function (data, elements) {
  var initialCount = 0
  for (var i = 0; i < elements.length; i++) {
    var element = data[elements[i]]
    if (element && element.length !== 0) {
      initialCount = initialCount + 1
    }
  }
  return initialCount
}

/**
 * Adds the value to a counter if the
 * value is numeric
 * @param {[type]} elements [description]
 */
var addIfNotEmpty = function (data, elements) {
  var initialCount = 0
  for (var i = 0; i < elements.length; i++) {
    var element = data[elements[i]]
    if (element && !isNaN(element)) {
      initialCount = initialCount + element
    }
  }
  return initialCount
}
