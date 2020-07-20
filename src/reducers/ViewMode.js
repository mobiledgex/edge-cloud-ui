import * as types from '../actions/ActionTypes';

const initialState = {
    mode: null
};
export default function ViewMode( state = initialState, action) {
    switch( action.type ) {
        case types.VIEW_MODE :
            return Object.assign({}, state, {
                mode:action.mode
            })
            break;
        default:
            return state
    }
}
