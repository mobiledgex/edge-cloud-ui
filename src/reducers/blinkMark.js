import * as types from '../actions/ActionTypes';

const initialState = {
  blink: false
};
export default function blinkMark( state = initialState, action) {
  switch( action.type ) {
    case types.BLINK_MARK :
      return Object.assign({}, state, {
        blink:action.blink
      })
      break;
    default:
      return state
  }
}
