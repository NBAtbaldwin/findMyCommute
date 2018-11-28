import React from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import * as LatLngUtil from './../latLngHelper';
import * as TransitUtil from './../transit_util';

export const WorkMarker = ({coords, google, map, mapCenter}) => {
  if (coords) {
    // let lngLat = TransitUtil.parseCoords(coords.lngLat);
    return(
      <>
        <Marker
          google={google}
          map={map}
          title={'big ass marker'}
          name={'SOMA'}
          position={coords}
        />
      </>
    )
  } else {
    return null;
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(WorkMarker)
