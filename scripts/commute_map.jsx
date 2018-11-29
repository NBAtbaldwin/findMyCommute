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
      targetTime: "",
    }
    this.clickListener = this.clickListener.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (this.props.polygon !== prevProps.polygon) {
      this.setState({
        boroughPolygons: this.props.polygon,
        targetTime: this.props.targetTime,
      })
    } else if (this.props.subwayStops !== prevProps.subwayStops) {
      this.setState({
        subwayStops: this.props.subwayStops,
        targetTime: this.props.targetTime,
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
        <Polygons boundaries={this.state.boroughPolygons} />
        <Markers coords={this.state.subwayStops} targetTime={this.props.targetTime} />
        <Circles subwayStops={this.state.subwayStops} targetTime={this.props.targetTime} />
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(CommuteMap)
