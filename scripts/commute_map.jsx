import React from 'react';
import {Map, Marker, GoogleApiWrapper, Polygon} from 'google-maps-react';
import * as MapUtil from './util/map_util';
import * as LatLngUtil from './latLngHelper';
import * as TransitUtil from './transit_util';
import Markers from './mapSubcomponents/markers';
import Polygons from './mapSubcomponents/polygons';
import WorkMarker from './mapSubcomponents/work_marker';
import Circles from './mapSubcomponents/circles';

export class CommuteMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boroughPolygons: [],
      subwayStops: [],
      workMarker: "",
      time: "",
    }
    this.clickListener = this.clickListener.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        boroughPolygons: this.props.boroughPolygon,
        subwayStops: this.props.subwayStops,
        time: this.props.time,
      })
    }
  }

  clickListener(mapProps, map, clickEvent) {
    this.setState({workMarker: clickEvent.latLng}, () => {
      this.props.postCoords(clickEvent.latLng)
    })
  }

  render() {
    return(
      <Map
        google={this.props.google}
        onClick={this.clickListener}
        style={MapUtil.style()}
        zoom={14}
        initialCenter={{
         lat: 40.7275711,
         lng: -74.0050261
         }}
        >
        <WorkMarker coords={this.state.workMarker} />
        <Markers coords={this.state.subwayStops} time={this.props.time} />
        <Circles subwayStops={this.state.subwayStops} time={this.props.time} />
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(CommuteMap)

// <Polygons boundaries={this.state.boroughPolygons} />
