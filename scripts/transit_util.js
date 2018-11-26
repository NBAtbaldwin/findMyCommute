import { myKey } from './key'

export const parseCoords = (str) => {
  str = str.split(" ");
  let lat = parseFloat(str[0].split("(")[1])
  let lng = parseFloat(str[1].split(")")[0])
  let latLng = new google.maps.LatLng(lng, lat)
  return latLng;
}

const parseUrlCoords = (str) => {
  str = str.split(" ");
  let lng = parseFloat(str[0].split("(")[1])
  let lat = parseFloat(str[1].split(")")[0])
  return `${lat},${lng}`;
}

const parseUrlCoordsLatLng = (latLng) => {
  let lat = latLng.lat();
  let lng = latLng.lng();
  return `${lat},${lng}`;
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

const filterByTime = (response, time) => {
  
}

const makeMatrixUrl = (originHash, destination) => {
  let originQuery = ``;
  originHash.queens.forEach((subwayStop, idx) => {
    if (idx !== originHash.queens.length - 1) {
      originQuery += `${parseUrlCoords(subwayStop.lngLat)}|`
    } else {
      originQuery += `${parseUrlCoords(subwayStop.lngLat)}`
    }
  });
  destination = parseUrlCoordsLatLng(destination)
  return `https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${originQuery}&destinations=${destination}&mode=transit&key=${myKey()}`;
}

export const fetchCommuteTime = (originHash, destination) => {
  const qString = makeMatrixUrl(originHash, destination);
  console.log(qString);
  fetch(qString)
    .then(res => {
      return res.json();
    })
    .then(res => console.log(res))
}


// https://maps.googleapis.com/maps/api/distancematrix/xml?origins=Vancouver+BC|Seattle&destinations=San+Francisco|Vancouver+BC&mode=bicycling&language=fr-FR&key=YOUR_API_KEY
