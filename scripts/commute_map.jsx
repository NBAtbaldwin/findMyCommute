import React from 'react';
import ReactDOM from 'react-dom';
import * as MapUtil from './util/map_util';
// import { bounds } from './boundaries';
import * as LatLngUtil from './latLngHelper';
import * as TransitUtil from './transit_util';
import { nycKey } from './key.js';
import CommuteTable from './commute_table';

class CommuteMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boroughPolygon: [],
      nbhdPolygons: [],
      selectedSubwayStops: [],
      workPlace: TransitUtil.parseCoords(('40.7447086 -74.0464601')),
      time: 30,
      borough: 'Brooklyn',
      markers: [],
      workMarker: null,
      circles: null,
      data: null,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  componentDidMount() {
    this.map = new google.maps.Map(this.mapNode, MapUtil.mapOpts());
    this.clickListener();
  }

  clickListener() {
    google.maps.event.addListener(this.map, 'click', (event) => {
      this.state.workMarker ? this.state.workMarker.setMap(null) : null;
      this.setState({workPlace: event.latLng}, () => {
        let marker = new google.maps.Marker({
          position: event.latLng,
          map: this.map,
        });
        this.setState({
          workMarker: marker,
        })
      })
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.cleanUp();
    fetch(`https://data.cityofnewyork.us/resource/7t3b-ywvw.json?boro_name=${this.state.borough}`, {
      "$$app_token": `${nycKey()}`
    })
    .then(res => LatLngUtil.receiveData(res))
    .then(boundaries => {
      this.setState({
        boroughPolygon: LatLngUtil.createPolgygon(boundaries, this.state.borough, this.state.boroughPolygon),
      })
    })
    .then(() => fetch('https://data.cityofnewyork.us/api/views/kk4q-3rt2/rows.json')
    )
    .then(res => LatLngUtil.receiveData(res))
    .then(res => LatLngUtil.createBoroughStops(res, this.state.selectedSubwayStops, this.state.boroughPolygon, this.state.borough))
    .then(res => {
      this.setState({
        selectedSubwayStops: res,
      })
    })
    .then(res => {
      TransitUtil.fetchCommuteTime(this.state.selectedSubwayStops, this.state.workPlace, this.state.time, this.state.borough)
        .then(locations => {
          let markers = [];
          TransitUtil.markersFromLocations(locations, this.map, markers);
          this.setState({markers: markers});
          return locations
        })
        .then(locations => {
          let circles = [];
          TransitUtil.genCircles(circles, this.state.markers, locations, this.state.time, this.map);
          this.setState({circles: circles, data: locations})
        })
    })
  }

  cleanUp() {
    this.setState({
      selectedSubwayStops: [],
    });
    this.clearItems("markers");
    this.clearItems("circles");
  }

  updateField(field) {
    return (e) => {
      this.setState({[field]: e.currentTarget.value}, () => {
        console.log(this.state.boroughPolygon[0])
      });
    };
  }

  clearItems(itemType) {
    if (!this.state[itemType]) return;
    for (let i = 0; i < this.state[itemType].length; i++) {
      this.state[itemType][i].setMap(null);
    }
  }

  render() {
    return(
      <div id="master-container">
        <main>
          <div id='map-container' ref={ map => this.mapNode = map }></div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>Borough</label>
              <select name="Borough" onChange={this.updateField('borough')}>
                <option value="Bronx" selected={this.state.borough === "Bronx"}>Bronx</option>
                <option value="Brooklyn" selected={this.state.borough === "Brooklyn"}>Brooklyn</option>
                <option value="Manhattan" selected={this.state.borough === "Manhattan"}>Manhattan</option>
                <option value="Queens" selected={this.state.borough === "Queens"}>Queens</option>
              </select>
            </div>
            <div>
              <label>Max Desired Commute Time</label>
              <input onChange={this.updateField('time')} type="number" value={this.state.time} name="time" min="5" max="120" />
            </div>
            <input type="hidden" value={this.state.workPlace} />
            <button type="submit" value="find-stops">Find stops</button>
          </form>
        </main>
        <aside>
          <CommuteTable transitData={this.state.data} />
        </aside>
      </div>
    )
  }
}

export default CommuteMap;
