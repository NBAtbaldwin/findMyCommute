import { RECEIVE_COORDS, RECEIVE_TIME, RECEIVE_BOROUGH, RECEIVE_BOROUGH_POLYGON, RECEIVE_NBHD_POLYGONS } from "./../actions/map_actions";
import { merge, mergeWith } from 'lodash';

const mapsReducer = (oldState = {}, action) => {

  function customizer(objVal, srcVal) {
    if (Array.isArray(objVal)) {
      return srcVal
    }
  }

  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_COORDS:
      return merge({}, oldState, {workplace: action.coords});
    case RECEIVE_TIME:
      return merge({}, oldState, {time: action.time});
    case RECEIVE_BOROUGH:
      return merge({}, oldState, {borough: action.borough});
    case RECEIVE_BOROUGH_POLYGON:
      let newState = {time: action.time, subwayStops: action.subwayStops, boroughPolygon: action.boroughPolygon, nbhdPolygon: []}
      let newOldState = merge({}, oldState)
      return mergeWith(newOldState, newState, customizer);
    case RECEIVE_NBHD_POLYGONS:
      return mergeWith({}, oldState, {time: action.time, subwayStops: action.subwayStops, nbhdPolygon: action.nbhdPolygon, boroughPolygon: []});
    default:
      return oldState;
  }
};

export default mapsReducer;
