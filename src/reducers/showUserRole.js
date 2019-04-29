import * as types from '../actions/ActionTypes';

const initialState = {
    role: null
};
export default function showUserRole( state = initialState, action) {
    switch( action.type ) {
        case types.SHOW_USER_ROLE :
            return Object.assign({}, state, {
                role:action.role
            })
            break;
        default:
            return state
    }
}
