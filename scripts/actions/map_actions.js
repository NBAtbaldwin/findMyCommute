export const RECEIVE_COORDS = 'RECEIVE_COORDS';
export const RECEIVE_TIME = 'RECEIVE_TIME';
export const RECEIVE_BOROUGH = 'RECEIVE_BOROUGH';
// export const RECEIVE_SUBWAY_STOPS = 'RECEIVE_SUBWAY_STOPS';
export const RECEIVE_BOROUGH_POLYGON = 'RECEIVE_BOROUGH_POLYGON';
export const RECEIVE_NBHD_POLYGONS = 'RECEIVE_NBHD_POLYGONS';

export const receiveCoords = (coords) => ({
  type: RECEIVE_COORDS,
  coords: coords
});

export const receiveTime = (time) => ({
  type: RECEIVE_TIME,
  time: time
})

export const receiveBorough = (borough) => ({
  type: RECEIVE_BOROUGH,
  borough: borough
})
//
// export const receiveSubwayStops = (subwayStops) => ({
//   type: RECEIVE_SUBWAY_STOPS,
//   subwayStops: subwayStops
// })

export const receiveBoroughPolygon = (boroughPolygon, time, subwayStops) => ({
  type: RECEIVE_BOROUGH_POLYGON,
  boroughPolygon: boroughPolygon,
  time: time,
  subwayStops: subwayStops
})

export const receiveNbhdPolygons = (nbhdPolygons, time, subwayStops) => ({
  type: RECEIVE_NBHD_POLYGONS,
  nbhdPolygons: nbhdPolygons,
  time: time,
  subwayStops: subwayStops
})

export const postCoords = coords => dispatch => {
  dispatch(receiveCoords(coords))
}

export const postTime = time => dispatch => {
  dispatch(receiveTime(time))
}

export const postBorough = borough => dispatch => {
  dispatch(receiveBorough(borough))
}

export const postBoroughPolygon = (boroughPolygon, time, subwayStops) => dispatch => {
  dispatch(receiveBoroughPolygon(boroughPolygon, time, subwayStops))
}

export const postNbhdPolygons = (nbhdPolygons, time, subwayStops) => dispatch => {
  dispatch(receiveNbhdPolygons(nbhdPolygons, time, subwayStops))
}

export const fetchCoords = () => dispatch => {
  dispatch(receiveCoords());
};
