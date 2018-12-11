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

export const locationFilter = (polygon, data, borough) => {
  stop = parseCoords(data[11].slice(6));
  return google.maps.geometry.poly.containsLocation(stop, polygon) ? true : false;
}

export const nbhdFilter = (polygons, data) => {
  stop = parseCoords(data[11].slice(6));
  for (let i = 0; i < polygons.length; i++) {
    if (google.maps.geometry.poly.containsLocation(stop, polygons[i])) return true;
  }
  return false;
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

const filterByTime = (response, time, originHash) => {
  const matches = [];
  time = time * 60;
  response.forEach((row, idx) => {
    let commuteTime = row.elements[0].duration.value;
    let boroughWithTime = merge({}, originHash[idx], {commuteTime: commuteTime});
    matches.push(boroughWithTime);
  });
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
  return `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${originQuery}&destinations=${destination}&mode=transit&key=${process.env.GAPI_KEY}`;
}

export const fetchCommuteTime = (originHash, destination, time, borough) => {
  return new Promise(resolve => {
    if (originHash.length > 100) {
      let halfBorough = originHash.splice(100);
      const qString2 = makeMatrixUrl(halfBorough, destination);
      const qString1 = makeMatrixUrl(originHash, destination);
      originHash = originHash.concat(halfBorough);
      fetch(qString1, {mode: 'cors'})
      .then(res1 => {
        return res1.json();
      })
      .then(res1 => {
        fetch(qString2, {mode: 'cors'})
        .then(res2 => {
          return res2.json();
        })
        .then(res2 => {
          resolve(filterByTime(res1.rows.concat(res2.rows), time, originHash, borough));
        })
      })
    } else {
      const qString = makeMatrixUrl(originHash, destination);
      fetch(qString, {mode: 'cors'})
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
      title: loc.subwayStop,
    });
    markers.push(marker)
  });
  return markers
}

export const nbhdQueryString = (ntas) => {
  let qString = "";
  ntas.forEach((nta, idx) => {
    if(idx > 0) qString += ",%20";
    qString += `%27${nta}%27`;
  });
  return qString;
}

// %27${}%27,%20%27Bushwick%20South%27,%20%27Bushwick%20North%27
