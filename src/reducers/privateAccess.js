import * as types from '../actions/ActionTypes';

const initialState = {
    data: null
};
export default function privateAccess( state = initialState, action) {
    switch( action.type ) {
        case types.PRIVATE_ACCESS_EXIST :
            return Object.assign({}, state, {
                data:action.isPrivate
            })
            break;
        default:
            return state
    }
}
