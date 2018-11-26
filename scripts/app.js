import Leaflet from 'leaflet';
import googleMutant from "leaflet.gridlayer.googlemutant";

window.addEventListener('load', init, false);

function init() {
  initMap();

  function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
      center: {lng: -73.8506199987954, lat: 40.903125000541245},
      zoom: 12,
    });
  }
  const roads = L.gridLayer.googleMutant({
  	type: 'roadmap'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
  }).addTo(map);

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

}

// https://data.cityofnewyork.us/api/views/7t3b-ywvw/rows.json
