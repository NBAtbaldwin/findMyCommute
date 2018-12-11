import { connect } from 'react-redux';
import { postNbhdPolygons } from './../actions/map_actions';
import NbhdForm from './nbhd_form';

const mapStateToProps = (state, ownProps) => {
  return {
    borough: state.map.borough,
    workplace: state.map.workplace,
    time: state.map.time,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postNbhdPolygons: (nbhdPolygon, time, subwayStops) => dispatch(postNbhdPolygons(nbhdPolygon, time, subwayStops)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NbhdForm);
