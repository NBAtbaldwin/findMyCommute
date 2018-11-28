import { combineReducers } from 'redux';
import mapsReducer from './maps_reducer';

const rootReducer = combineReducers({
  map: mapsReducer,
});

export default rootReducer;
