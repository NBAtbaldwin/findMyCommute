export const RECEIVE_COORDS = 'RECEIVE_COORDS';

export const receiveCoords = (coords) => ({
  type: RECEIVE_COORDS,
  coords: coords
});

export const fetchCoords = () => dispatch => {
  dispatch(receiveCoords());
};

export const postCoords = coords => dispatch => {
  dispatch(receiveCoords(coords))
}
