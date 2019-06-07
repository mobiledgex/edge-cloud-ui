import * as types from '../actions/ActionTypes';

const initialState = {
    mode: null
};
export default function changeViewMode( state = initialState, action) {
    switch( action.type ) {
        case types.CHANGE_VIEW :
            return Object.assign({}, state, {
                mode:action.mode
            })
            break;
        default:
            return state
    }
}
