export const parseCoords = (str) => {
  str = str.split(" ");
  let lat = parseFloat(str[0].split("(")[1])
  let lng = parseFloat(str[1].split(")")[0])
  let latLng = new google.maps.LatLng(lng, lat)
  return latLng;
}



export const locationFilter = (polygons, stop) => {
  stop = parseCoords(stop);
  const boroughs = ["manhattan", "bronx", "staten_island", "brooklyn", "queens"];
  let borough;
  polygons.forEach((poly, idx) => {
    google.maps.geometry.poly.containsLocation(stop, poly[boroughs[idx]]) ? borough = boroughs[idx] : null
  })
  // console.log(borough)
  return borough
}

export const getCommuteTime = (originHash, destination, service, display, ) => {
    service.route({
    origin: parseCoords(originHash.queens[0].lngLat),
    destination: destination,
    travelMode: google.maps.TravelMode['TRANSIT'],
  }, function(response, status) {
    if (status === 'OK') {
      display.setDirections(response);
      console.log(display.getDirections().routes[0].legs[0].duration.text)
    } else {
      alert('Could not display directions due to: ' + status);
    }
  });
}

export const fetchCommuteTime = () => {
  
}
