import React from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import * as LatLngUtil from './../latLngHelper';
import * as TransitUtil from './../transit_util';

export const Markers = ({coords, google, map, mapCenter}) => {
  return(
    <>
      {coords.map((subway, idx) => {
        let lngLat = TransitUtil.parseCoords(subway.lngLat);
        return(
          <Marker
            google={google}
            map={map}
            title={'big ass marker'}
            name={'SOMA'}
            position={{lat: lngLat.lat(), lng: lngLat.lng()}}
            key={idx} />
        )
      })}
    </>
  )
}

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(Markers)
