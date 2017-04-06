export default function getBoundsFromLocationString(locationString) {

  return new Promise((resolve, reject) => {

    if (typeof google === 'object') {

      // Instantiate the Google services we'll need
      /* eslint-disable */
      const autocompleter = new google.maps.places.AutocompleteService()
      const geocoder = new google.maps.Geocoder
      /* eslint-enable */

      // Get a place suggestion from the locationString
      autocompleter.getQueryPredictions({ input: locationString }, (predictions, status) => {

        // Geolocate the first result
        if (status === 'OK' && predictions.length > 0) {

          geocoder.geocode({ placeId: predictions[0].place_id }, (results, geocodeStatus) => {

            if (geocodeStatus === 'OK' && results.length > 0) {

              const viewport = results[0].geometry.bounds

              resolve({
                maxLat: viewport.f.f,
                maxLng: viewport.b.b,
                minLat: viewport.f.b,
                minLng: viewport.b.f,
              })

            } else {

              // If there are no results, return error
              reject(new Error('Could not geolocate location string: ', locationString))

            }
          })

        } else {

          // If there are no predictions, return error
          reject(new Error('Could not get place predictions from location string: ', locationString))

        }


      })

    } else {

      reject(new Error('Google maps API is not loaded'))

    }


  })


}
