import * as types from '../actions/ActionTypes';

const initialState = {
    data: undefined
};
export default function privateAccess( state = initialState, action) {
    switch( action.type ) {
        case types.PRIVATE_ACCESS_EXIST :
            return Object.assign({}, state, {
                data:action.isPrivate
            })
        default:
            return state
    }
}
