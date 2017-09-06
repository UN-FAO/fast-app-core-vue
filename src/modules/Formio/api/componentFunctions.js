/**
 * Use the navigator GPS coordinates to
 * determine the position and put is on
 * a form element
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
