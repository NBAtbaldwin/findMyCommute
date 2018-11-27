import React from 'react';
import ReactDOM from 'react-dom';
import * as MapUtil from './util/map_util';
// import { bounds } from './boundaries';
import * as LatLngUtil from './latLngHelper';
import * as TransitUtil from './transit_util';
import { nycKey } from './key.js'

class CommuteMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boroughPolygons: [],
      stopsHash: {
        "bronx": [],
        "brooklyn": [],
        "manhattan": [],
        "queens": [],
        "staten_island": [],
      },
      workPlace: TransitUtil.parseCoords(('40.7447086 -74.0464601')),
      time: 30,
      borough: 'brooklyn',
      markers: [],
      workMarker: null,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  componentDidMount() {
    this.map = new google.maps.Map(this.mapNode, MapUtil.mapOpts());
    fetch("https://data.cityofnewyork.us/resource/7t3b-ywvw.json", {
      "$$app_token": `${nycKey()}`
    })
      .then(res => LatLngUtil.receiveData(res))
      .then(boundaries => {
        this.setState({
          boroughPolygons: LatLngUtil.createPolgygons(boundaries, this.state.boroughPolygons),
        }, () => {
          fetch('https://data.cityofnewyork.us/api/views/kk4q-3rt2/rows.json')
          .then(res => LatLngUtil.receiveData(res))
          .then(res => LatLngUtil.createStopsHash(res, this.state.stopsHash, this.state.boroughPolygons))
          .then(res => {
            this.setState({
              stopsHash: res,
            }, () => {
              this.clickListener();
            })
          })
        });
      })
  }

  clickListener() {
    google.maps.event.addListener(this.map, 'click', (event) => {
      this.state.workMarker ? this.state.workMarker.setMap(null) : null;
      this.setState({workPlace: event.latLng}, () => {
        console.log(this.state)
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
    TransitUtil.fetchCommuteTime(this.state.stopsHash, this.state.workPlace, this.state.time, this.state.borough)
      .then(locations => {
        this.clearMarkers();
        let markers = [];
        TransitUtil.markersFromLocations(locations, this.map, markers);
        this.setState({markers: markers})
      })
  }

  updateField(field) {
    return (e) => {
      this.setState({[field]: e.currentTarget.value});
    };
  }

  clearMarkers() {
    for (let i = 0; i < this.state.markers.length; i++) {
      this.state.markers[i].setMap(null);
    }
  }

  render() {
    return(
      <div>
        <div id='map-container' ref={ map => this.mapNode = map }></div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Borough</label>
            <select name="Borough" onChange={this.updateField('borough')}>
              <option value="bronx" selected={this.state.borough === "bronx"}>Bronx</option>
              <option value="brooklyn" selected={this.state.borough === "brooklyn"}>Brooklyn</option>
              <option value="manhattan" selected={this.state.borough === "manhattan"}>Manhattan</option>
              <option value="queens" selected={this.state.borough === "queens"}>Queens</option>
            </select>
          </div>
          <div>
            <label>Max Desired Commute Time</label>
            <input onChange={this.updateField('time')} type="number" value={this.state.time} name="time" min="5" max="120" />
          </div>
          <input type="hidden" value={this.state.workPlace} />
          <button type="submit" value="find-stops">Find stops</button>
        </form>
      </div>
    )
  }
}

export default CommuteMap;
