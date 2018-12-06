import { connect } from 'react-redux';
import { postCoords } from './actions/map_actions';
import CommuteMap from './commute_map';

const mapStateToProps = (state, ownProps) => {
  return {
    workplace: state.map.workplace,
    time: state.map.time,
    subwayStops: state.map.subwayStops,
    boroughPolygon: state.map.boroughPolygon,
    nbhdPolygons: state.map.nbhdPolygons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postCoords: (coords) => dispatch(postCoords(coords)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommuteMap);
