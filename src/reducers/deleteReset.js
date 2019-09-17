import * as types from '../actions/ActionTypes';

const initialState = {
    reset: false
};
export default function loadingSpinner( state = initialState, action) {
    switch( action.type ) {
        case types.DELETE_RESET :
            return Object.assign({}, state, {
                reset:action.reset
            })
            break;
        default:
            return state
    }
}
