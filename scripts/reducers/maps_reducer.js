import { RECEIVE_COORDS, RECEIVE_TIME, RECEIVE_BOROUGH, RECEIVE_BOROUGH_POLYGON, RECEIVE_NBHD_POLYGONS } from "./../actions/map_actions";
import { merge, mergeWith } from 'lodash';

const mapsReducer = (oldState = {}, action) => {

  function customizer(objVal, srcVal) {
    if (Array.isArray(objVal)) {
      return srcVal
    }
  }

  Object.freeze(oldState);
  let newState, newOldState;
  switch (action.type) {
    case RECEIVE_COORDS:
      return merge({}, oldState, {workplace: action.coords});
    case RECEIVE_TIME:
      return merge({}, oldState, {time: action.time});
    case RECEIVE_BOROUGH:
      return merge({}, oldState, {borough: action.borough});
    case RECEIVE_BOROUGH_POLYGON:
      newState = {time: action.time, subwayStops: action.subwayStops, boroughPolygon: action.boroughPolygon, nbhdPolygons: []}
      newOldState = merge({}, oldState)
      return mergeWith(newOldState, newState, customizer);
    case RECEIVE_NBHD_POLYGONS:
      newState = {time: action.time, boroughPolygon: []};
      newOldState = merge({}, oldState, newState);
      return mergeWith(newOldState, {nbhdPolygons: action.nbhdPolygons, subwayStops: action.subwayStops}, customizer);
    default:
      return oldState;
  }
};

export default mapsReducer;
