import * as types from '../actions/ActionTypes';

const initialState = {
    mode: false
};
export default function loginMode( state = initialState, action) {
    switch( action.type ) {
        case types.LOGIN_MODE :
            return Object.assign({}, state, {
                mode:action.mode
            })
            break;
        default:
            return state
    }
}
