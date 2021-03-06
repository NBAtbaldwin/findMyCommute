import { locationFilter, nbhdFilter, parseCoords, fetchCommuteTime } from './transit_util';

export const latLngObj = (arr) => {
  const output = {};
  output.lat = arr[1];
  output.lng = arr[0];
  return output;
}

export const toLatLng = (geoJ) => {
  let output = [];
  geoJ.forEach(arr1 => {
    arr1.forEach(arr2 => {
      arr2.forEach((arr3, idx) => {
        arr2[idx] = latLngObj(arr3);
      })
      output.push(arr2);
    })
  })
  return output
}

// export const createPolgygon = (geoJ, borough, container) => {
//   container = [];
//   let boroughObj = {};
//   let path = toLatLng(geoJ[0].the_geom.coordinates);
//   boroughObj[borough] = new google.maps.Polygon({
//       paths: path,
//     });
//   container.push(boroughObj);
//
//   return container;
// }

const tempPolygon = (path) => {
  return new google.maps.Polygon({
      paths: path,
    });
}

export const createPolgygon = (geoJ, borough, container) => {
  if (Array.isArray(geoJ)) return toLatLng(geoJ[0].the_geom.coordinates);
  return toLatLng(geoJ.the_geom.coordinates);

}

export const receiveData = (res) => {
  return res.json();
}

// export const createStopsHash = (res, stopsHash, polygons) => {
//   const stopsArr = res.data;
//   stopsArr.forEach(stop => {
//     let coords = stop[11].slice(6);
//     let stopObj = {};
//     stop.forEach((listItem, idx) => {
//       switch (idx) {
//         case 0:
//           stopObj.id = listItem;
//           break;
//         case 10:
//           stopObj.subwayStop = listItem;
//           break;
//         case 11:
//           stopObj.lngLat = coords;
//           break;
//         case 12:
//           stopObj.trains = listItem;
//           break;
//         case 13:
//           stopObj.info = listItem;
//           break;
//         default:
//           break
//       }
//     })
//     stopsHash[locationFilter(polygons, coords)].push(stopObj)
//   })
//   return stopsHash
// }

export const createBoroughStops = (res, selectedSubwayStops, boroughPolygon, borough) => {
  const polygon = tempPolygon(boroughPolygon);
  const stopsArr = res.data;
  stopsArr.forEach(stop => {
    if (locationFilter(polygon, stop, borough)) {
      let coords = stop[11].slice(6);
      let stopObj = {};
      stop.forEach((listItem, idx) => {
        switch (idx) {
          case 0:
            stopObj.id = listItem;
            break;
          case 10:
            stopObj.subwayStop = listItem;
            break;
          case 11:
            stopObj.lngLat = coords;
            break;
          case 12:
            stopObj.trains = listItem;
            break;
          case 13:
            stopObj.info = listItem;
            break;
          default:
            break
        }
      })
      selectedSubwayStops.push(stopObj);
    }
  });
  return selectedSubwayStops;
}

export const createNbhdStops = (res, selectedSubwayStops, ntas) => {
  const polygons = [];
  ntas.forEach((nta, idx) => {
    polygons.push(tempPolygon(nta));
  });
  const stopsArr = res.data;
  stopsArr.forEach(stop => {
    if (nbhdFilter(polygons, stop)) {
      let coords = stop[11].slice(6);
      let stopObj = {};
      stop.forEach((listItem, idx) => {
        switch (idx) {
          case 0:
            stopObj.id = listItem;
            break;
          case 10:
            stopObj.subwayStop = listItem;
            break;
          case 11:
            stopObj.lngLat = coords;
            break;
          case 12:
            stopObj.trains = listItem;
            break;
          case 13:
            stopObj.info = listItem;
            break;
          default:
            break
        }
      })
      selectedSubwayStops.push(stopObj);
    }
  });
  return selectedSubwayStops;
}
