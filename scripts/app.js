import Leaflet from 'leaflet';
import googleMutant from "leaflet.gridlayer.googlemutant";
import { bounds } from './boundaries';

window.addEventListener('load', init, false);

function init() {
  const boundaries = bounds;

  const mapOpts = {
    center: {lng: -73.8506199987954, lat: 40.903125000541245},
    zoom: 12,
  }

  const map = new google.maps.Map(document.getElementById('map'), mapOpts);

  // const map = L.map('map', mapOpts);
  // // .setView([0,0],0);
  //
  // const roadMutant = L.gridLayer.googleMutant({
	// 		maxZoom: 24,
	// 		type:'roadmap'
	// 	}).addTo(map);
  //
  // L.geoJSON(boundaries).addTo(map);

  const manhattan = boundaries.features[0].geometry.coordinates;

  fetch('https://data.cityofnewyork.us/api/views/kk4q-3rt2/rows.json')
    .then(res => receiveData(res))
    .then(res => handleData(res))

  function receiveData(res) {
    return res.json();
  }

  function handleData(res) {
    const stopsArr = res.data;
    let stopsHash= {};
    stopsArr.forEach(stop => {
      let key = stop[11].slice(6);
      stopsHash[key] = {};
      stop.forEach((listItem, idx) => {
        switch (idx) {
          case 0:
            stopsHash[key].id = listItem
            break;
          case 10:
            stopsHash[key].subwayStop = listItem
            break;
          case 11:
            stopsHash[key].lngLat = listItem
            break;
          case 12:
            stopsHash[key].trains = listItem
            break;
          case 13:
            stopsHash[key].info = listItem
            break;
          default:
            break
        }
      })
    })
    console.log(stopsHash);
  }

  function locationFilter() {

  }

  google.maps.event.addListener(map, 'click', function(event) {
    // console.log(google.maps.geometry.poly.containsLocation(event.latLng, manhattan));
    console.log(manhattan);
  });

}
