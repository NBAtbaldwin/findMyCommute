import { connect } from 'react-redux';
import { postCoords } from './actions/map_actions';
import CommuteMap from './commute_map';

const mapDispatchToProps = (dispatch) => {
  return {
    postCoords: (coords) => dispatch(postCoords(coords)),
  };
};

export default connect(null, mapDispatchToProps)(CommuteMap);
