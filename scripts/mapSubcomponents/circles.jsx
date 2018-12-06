import React from 'react';
import {Map, Polygon, Circle, GoogleApiWrapper} from 'google-maps-react';
import * as LatLngUtil from './../latLngHelper';
import * as TransitUtil from './../transit_util';
import * as CircleUtil from './../util/circles_util';

export const Circles = ({subwayStops, time, google, map, mapCenter}) => {
  let circleArr = CircleUtil.genCircles(subwayStops, time);
  return (
    <Polygon
      google={google}
      map={map}
      paths={circleArr}
      strokeColor="#0000FF"
      strokeOpacity={0.35}
      strokeWeight={0}
      fillColor="#0000FF"
      fillOpacity={0.35}
      />
  )
}

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(Circles)
