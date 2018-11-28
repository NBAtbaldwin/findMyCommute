import React from 'react';
import {Map, Polygon, GoogleApiWrapper} from 'google-maps-react';
import * as LatLngUtil from './../latLngHelper';
import * as TransitUtil from './../transit_util';

export const Polygons = ({boundaries, google, map, mapCenter}) => {
  return(
    <>
      {[boundaries].map((bounds, idx) => {
        return(
          <Polygon
            google={google}
            map={map}
            paths={bounds}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor="#0000FF"
            fillOpacity={0.35}
            key={idx} />
        )
      })}
    </>
  )
}

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(Polygons)
