/**
 * Use the navigator GPS coordinates to determine
 * the current position and display it on the
 * given latitud and longitud input fields
 * 
 * You can listen to this event as follows
 *    document.addEventListener("gpsRequested", function(e) {
 *      console.log(e);
 *    });
 * @param  {Array} 	data  		  [data array of Form.io]
 * @param  {String} latitudField  [API name of the field in FORM.io]
 * @param  {String} longitudField [API name of the field in FORM.io]
 * @return {[type]}               [description]
 */
var getGpsPosition = function (data, latitudField, longitudField) {
  // Create the events
  var requestedEvent = new CustomEvent('gpsRequested',
    {
      'detail': {'data': data, 'text': 'GPS requested'}
    }
  )
  var doneEvent = new CustomEvent('gpsSucceeded',
    {
      'detail': {'data': data, 'text': 'GPS Succeeded'}
    }
  )

  function error (e) {
    console.log('GPS error', e)
    var errorEvent = new CustomEvent('gpsError',
    	{
      	'detail': {'data': e, 'text': 'GPS Error'}
    	}
  	)
    document.dispatchEvent(errorEvent)
  }

  function getLocation () {
    if (navigator.geolocation) {
      document.dispatchEvent(requestedEvent)
      navigator.geolocation.getCurrentPosition(showPosition, error, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true})
    } else {
      document.dispatchEvent(doneEvent)
      console.log('Geolocation is not supported by this browser.')
    }
    function showPosition (position) {
      data[longitudField] = position.coords.longitude
      data[latitudField] = position.coords.latitude
      document.getElementsByName('data['+ longitudField +']')[0].value = position.coords.longitude
      document.getElementsByName('data['+ latitudField +']')[0].value = position.coords.latitude
      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(doneEvent)
    }
  }
  getLocation()
}

/**
 * Count the number of elements inside the 
 * elements array that are not empty
 * @param  {Array} data     [description]
 * @param  {Array} elements [description]
 * @return {Number}          [description]
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
 * Add all of the elements inside the elements
 * arrat that have numeric value
 * @param {Array} data     [data array of Form.io]
 * @param {Array} elements [array of string names]
 * @return {Number}          [description]
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

/**
 * [notEmptyIfComponentGreaterThanZero description]
 * @param  {[type]} data          [description]
 * @param  {[type]} componentName [description]
 * @param  {[type]} input         [description]
 * @return {[type]}               [description]
 */
var notEmptyIfComponentGreaterThanZero = function(data, componentName, input) {

    if (typeof data[componentName] !== 'undefined' && data[componentName] !== null &&
        data[componentName] !== '' && !isNaN(data[componentName]) && data[componentName] > 0) {

        if (typeof input !== 'undefined' && input !== null && input !== '') {
            return true
        } else {
            return 'This field should not be empty';
        }
    } else {
        return true;
    }

}

/**
 * [sendSMS description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var sendSMS = function (data) {
	// Create the event
  var messageRequested = new CustomEvent('messageRequested',
    {
      'detail': {'data': data, 'text': 'SMS message requested'}
    }
  )
  document.dispatchEvent(messageRequested)
}

/**
 * [saveAsDraft description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var saveAsDraft = function (data) {
    // Create the event
  var saveAsDraft = new CustomEvent('saveAsDraft',
    {
      'detail': {'data': data, 'text': 'Save as Draft Requested'}
    }
  )
  document.dispatchEvent(saveAsDraft)
}
