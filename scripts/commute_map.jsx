import React from 'react';
import {Map, Marker, GoogleApiWrapper, Polygon} from 'google-maps-react';
import * as MapUtil from './util/map_util';
import * as LatLngUtil from './latLngHelper';
import * as TransitUtil from './transit_util';
import Markers from './mapSubcomponents/markers';
import Polygons from './mapSubcomponents/polygons';

export class CommuteMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boroughPolygons: [],
      subwayStops: [],
    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (this.props.polygon !== prevProps.polygon) {
      this.setState({
        boroughPolygons: this.props.polygon
      })
    } else if (this.props.subwayStops !== prevProps.subwayStops) {
      this.setState({
        subwayStops: this.props.subwayStops
      })
    }
  }

  render() {
    return(
      <Map
        google={this.props.google}
        onDragend={this.centerMoved}
        style={MapUtil.style()}
        zoom={14}
        initialCenter={{
         lat: 40.7275711,
         lng: -74.0050261
         }}
        >
        <Polygons boundaries={this.state.boroughPolygons} />
        <Markers coords={this.state.subwayStops} />
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(CommuteMap)
