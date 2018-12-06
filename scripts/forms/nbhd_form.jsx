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
    }
    this.updateField = this.updateField.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.borough !== prevProps.borough) {
      this.setState({
        borough: this.props.borough,
      })
    }
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
        }, () => {
          console.log(this.state);
        })
      })
    }
  }

  updateField(e) {
    let stateCopy = this.state.selectedNtas;
    stateCopy.push(e.currentTarget.value);
    this.setState({selectedNtas: stateCopy})
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
