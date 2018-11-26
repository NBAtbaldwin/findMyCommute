import { bounds } from './boundaries';
import { toLatLng, createPolgygons } from './latLngHelper';
import { locationFilter, parseCoords, fetchCommuteTime } from './transit_util';

window.addEventListener('load', init, false);

function init() {
  const boundaries = bounds;
  const stopsHash= {
    "bronx": [],
    "brooklyn": [],
    "manhattan": [],
    "queens": [],
    "staten_island": [],
  };

  const mapOpts = {
    center: {lng: -73.8506199987954, lat: 40.903125000541245},
    zoom: 12,
  }

  const map = new google.maps.Map(document.getElementById('map'), mapOpts);

  const service = new google.maps.DirectionsService;

  const display = new google.maps.DirectionsRenderer({
    map: map,
  });

  const polygons = [];

  createPolgygons(boundaries, polygons)

  fetch('https://data.cityofnewyork.us/api/views/kk4q-3rt2/rows.json')
    .then(res => receiveData(res))
    .then(res => handleData(res))
    .then(res => commuteFinder(res))


  function receiveData(res) {
    return res.json();
  }

  function handleData(res) {
    const stopsArr = res.data;
    stopsArr.forEach(stop => {
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
      stopsHash[locationFilter(polygons, coords)].push(stopObj)
    })
    return stopsHash
  }

  function commuteFinder(stopsHash) {
    stopsHash = stopsHash;

    google.maps.event.addListener(map, 'click', function(event) {
      fetchCommuteTime(stopsHash, event.latLng, 55);
    });

  }


}
