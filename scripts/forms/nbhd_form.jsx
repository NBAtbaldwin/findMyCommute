import React from 'react';
import * as LatLngUtil from './../latLngHelper';
import * as TransitUtil from './../transit_util';
import {GoogleApiWrapper} from 'google-maps-react';

export class NbhdForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      borough: 'Brooklyn',
      ntaNames: { Brooklyn: [], Queens: [], Manhattan: [], Bronx: [] },
      selectedNtas: [],
      subwayStops: [],
      filteredSubwayStops: [],
      nbhdPolygons: [],
    }
    this.updateField = this.updateField.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.borough !== prevProps.borough) {
      this.setState({
        borough: this.props.borough,
        selectedNtas: [],
        subwayStops: [],
        filteredSubwayStops: [],
        nbhdPolygons: [],
      })
    }
  }

  cleanUp() {
    this.setState({
      subwayStops: [],
      filteredSubwayStops: [],
    });
  }

  componentDidMount() {
    if(this.state.ntaNames.Brooklyn.length === 0) {
      fetch(`https://data.cityofnewyork.us/resource/q2z5-ai38.json?`, {
        "$$app_token": `${process.env.NYC_KEY}`
      })
      .then(res => LatLngUtil.receiveData(res))
      .then(res => {
        const output = { Brooklyn: [], Queens: [], Manhattan: [], Bronx: [] };
        res.forEach(nta => {
          if(nta.boro_name !== 'Staten Island') {
            output[nta.boro_name].push(nta.ntaname);
          }
        });
        this.setState({
          ntaNames: output
        })
      })
    }
  }

  updateField(e) {
    let stateCopy = Array.from(this.state.selectedNtas);
    if (stateCopy.includes(e.currentTarget.value)) {
      stateCopy.splice(stateCopy.indexOf(e.currentTarget.value), 1);
    } else {
      stateCopy.push(e.currentTarget.value);
    }
    this.setState({selectedNtas: stateCopy}, () => {
      console.log(this.state)
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.cleanUp();
    if (this.state.selectedNtas.length < 1) return;
    const qString = TransitUtil.nbhdQueryString(this.state.selectedNtas);
    fetch(`https://data.cityofnewyork.us/resource/q2z5-ai38.json?$where=ntaname%20in(${qString})`, {
      "$$app_token": `${process.env.NYC_KEY}`
    })
    .then(res => LatLngUtil.receiveData(res))
    .then(ntas => {
      fetch('https://data.cityofnewyork.us/api/views/kk4q-3rt2/rows.json', {
        "$$app_token": `${process.env.NYC_KEY}`
      })
      .then(res => LatLngUtil.receiveData(res))
      .then(subwayStops => {
        let nbhdPolygons = [];
        ntas.forEach((nta, idx) => {
          nbhdPolygons.push(LatLngUtil.createPolgygon(nta));
        });
        this.setState({nbhdPolygons: nbhdPolygons});
        LatLngUtil.createNbhdStops(subwayStops, this.state.subwayStops, nbhdPolygons);
      })
      .then(() => {
        // debugger;
        TransitUtil.fetchCommuteTime(this.state.subwayStops, this.props.workplace, this.props.time, this.state.borough)
        .then(locations => {
          // debugger;
          this.setState({
            filteredSubwayStops: locations,
          }, () => {
            // debugger;
            this.props.postNbhdPolygons(this.state.nbhdPolygons, this.props.time, this.state.filteredSubwayStops)
          });
        })
      })
    })

  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <select name="nta" multiple={true} value={this.state.selectedNtas} onChange={this.updateField}>
          {this.state.ntaNames[this.state.borough].map((nta, idx)=> {
            return <option value={nta} key={idx}>{nta}</option>;
          })}
        </select>
        <button type="submit" value="find-stops">Find stops by neighborhood</button>
      </form>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(NbhdForm)
