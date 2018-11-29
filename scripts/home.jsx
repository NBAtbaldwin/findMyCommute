import React from 'react';
import * as MapUtil from './util/map_util';
import * as LatLngUtil from './latLngHelper';
import * as TransitUtil from './transit_util';
import CommuteMapContainer from './commute_map_container.js';
import CommuteTable from './commute_table';
import {GoogleApiWrapper} from 'google-maps-react';

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boroughPolygon: [],
      nbhdPolygons: [],
      selectedSubwayStops: [],
      filteredSubwayStops: [],
      time: 30,
      borough: 'Brooklyn',
      workplace: null,
      data: null,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.workplace !== prevProps.workplace) {
      this.setState({
        workplace: this.props.workplace,
      })
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if(!this.state.workplace) {
      return;
    }
    this.cleanUp();
    fetch(`https://data.cityofnewyork.us/resource/7t3b-ywvw.json?boro_name=${this.state.borough}`, {
      "$$app_token": `${process.env.NYC_KEY}`
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
      debugger;
      TransitUtil.fetchCommuteTime(this.state.selectedSubwayStops, this.state.workplace, this.state.time, this.state.borough)
        .then(locations => {
          this.setState({
            filteredSubwayStops: locations,
          })
        })
    })
  }

  cleanUp() {
    this.setState({
      selectedSubwayStops: [],
      filteredSubwayStops: [],
    });
  }

  updateField(field) {
    return (e) => {
      this.setState({[field]: e.currentTarget.value}, () => {
        // console.log(this.state.boroughPolygon[0])
      });
    };
  }

  render() {
    return(
      <div id="master-container">
        <main>
          <div id="map-container">
            <CommuteMapContainer polygon={this.state.boroughPolygon} subwayStops={this.state.filteredSubwayStops}/>
          </div>
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
            <input type="hidden" value={this.state.workplace} />
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

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(Home)
