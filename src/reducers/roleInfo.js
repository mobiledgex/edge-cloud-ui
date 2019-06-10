import * as types from '../actions/ActionTypes';

const initialState = {
    role: []
};
export default function roleInfo( state = initialState, action) {
    switch( action.type ) {
        case types.ROLE_INFO :
            return Object.assign({}, state, {
                role:action.role
            })
            break;
        default:
            return state
    }
}
