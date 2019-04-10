import * as types from '../actions/ActionTypes';

const initialState = {
    onlyView: false
};
export default function btnManagement( state = initialState, action) {
    switch( action.type ) {
        case types.BTN_MANAGEMENT :
            return Object.assign({}, state, {
              onlyView:action.view
            })
            break;
        default:
            return state
    }
}
