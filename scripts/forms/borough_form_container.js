import { connect } from 'react-redux';
import { postCoords, fetchCoords, postBoroughPolygon, postTime, postBorough } from './../actions/map_actions';
import BoroughForm from './borough_form';

const mapStateToProps = (state, ownProps) => {
  return {
    workplace: state.map.workplace,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCoords: () => dispatch(fetchCoords()),
    postBoroughPolygon: (boroughPolygon, time, subwayStops) => dispatch(postBoroughPolygon(boroughPolygon, time, subwayStops)),
    postTime: (time) => dispatch(postTime(time)),
    postBorough: (borough) => dispatch(postBorough(borough)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoroughForm);
