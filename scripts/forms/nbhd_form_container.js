import { connect } from 'react-redux';
// import { } from './../actions/map_actions';
import NbhdForm from './nbhd_form';

const mapStateToProps = (state, ownProps) => {
  return {
    borough: state.map.borough,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     fetchCoords: () => dispatch(fetchCoords()),
//     postBoroughPolygon: (boroughPolygon, time, subwayStops) => dispatch(postBoroughPolygon(boroughPolygon, time, subwayStops)),
//     postTime: (time) => dispatch(postTime(time)),
//     postBorough: (borough) => dispatch(postBorough(borough)),
//   };
// };

export default connect(mapStateToProps, null)(NbhdForm);
