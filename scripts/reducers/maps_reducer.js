import { RECEIVE_COORDS } from "./../actions/map_actions";
import { merge } from 'lodash';


const mapsReducer = (oldState = {}, action) => {
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_COORDS:
      return merge({}, oldState, {workplace: action.coords});
    default:
      return oldState;
  }
};

export default mapsReducer;
