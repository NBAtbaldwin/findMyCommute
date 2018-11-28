import { connect } from 'react-redux';
import { fetchCoords } from './actions/map_actions';
import Home from './home'

const mapStateToProps = (state, ownProps) => {
  return {
    workplace: state.map.workplace,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCoords: () => dispatch(fetchCoords()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
