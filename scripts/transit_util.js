import { myKey } from './key';
import { merge } from 'lodash';

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
  return borough
}

// export const getCommuteTime = (originHash, destination, service, display, ) => {
//     service.route({
//     origin: parseCoords(originHash.brooklyn[0].lngLat),
//     destination: destination,
//     travelMode: google.maps.TravelMode['TRANSIT'],
//   }, function(response, status) {
//     if (status === 'OK') {
//       display.setDirections(response);
//       console.log(display.getDirections().routes[0].legs[0].duration.text)
//     } else {
//       alert('Could not display directions due to: ' + status);
//     }
//   });
// }

const filterByTime = (response, time, originHash, borough) => {
  const matches = [];
  time = time * 60;
  response.forEach((row, idx) => {
    let commuteTime = row.elements[0].duration.value;
    if (commuteTime <= time) {
      let boroughWithTime = merge({}, originHash[borough][idx], {commuteTime: commuteTime});
      matches.push(boroughWithTime);
    }
  });
  console.log(matches);
  return matches;
}

const makeMatrixUrl = (originHash, destination) => {
  let originQuery = ``;
  originHash.forEach((subwayStop, idx) => {
    if (idx !== originHash.length - 1) {
      originQuery += `${parseUrlCoords(subwayStop.lngLat)}|`
    } else {
      originQuery += `${parseUrlCoords(subwayStop.lngLat)}`
    }
  });
  destination = parseUrlCoordsLatLng(destination)
  return `https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${originQuery}&destinations=${destination}&mode=transit&key=${myKey()}`;
}

export const fetchCommuteTime = (originHash, destination, time, borough) => {
  return new Promise(resolve => {
    if (originHash[borough].length > 100) {
      let halfBorough = originHash[borough].splice(100);
      const qString2 = makeMatrixUrl(halfBorough, destination);
      const qString1 = makeMatrixUrl(originHash[borough], destination);
      originHash[borough] = originHash[borough].concat(halfBorough);
      fetch(qString1)
      .then(res1 => {
        return res1.json();
      })
      .then(res1 => {
        fetch(qString2)
        .then(res2 => {
          return res2.json();
        })
        .then(res2 => {
          resolve(filterByTime(res1.rows.concat(res2.rows), time, originHash, borough));
        })
      })
    } else {
      const qString = makeMatrixUrl(originHash[borough], destination);
      fetch(qString)
      .then(res => {
        return res.json();
      })
      .then(res => {
        resolve(filterByTime(res.rows, time, originHash, borough));
      })
    }

  })
}

export const markersFromLocations = (locations, map, markers) => {
  locations.forEach(loc => {
    let marker = new google.maps.Marker({
      position: parseCoords(loc.lngLat),
      map: map,
    });
    markers.push(marker)
  });
  return markers
}

const displayCircle = (marker, time, map) => {
  let circle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    center: {lat: marker.position.lat(), lng: marker.position.lng()},
    radius: 3,
  });
  return circle;
}

const walkingDistance = () => {

}

export const genCircles = (circles, markers, locations, time, map) => {
  markers.forEach(mark => {
    let circle = displayCircle(mark, time, map);
    circles.push(circle);
  })

}
