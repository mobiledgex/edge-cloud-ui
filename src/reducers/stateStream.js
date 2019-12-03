import * as types from '../actions/ActionTypes';

const initialState = {
    state: null
};
export default function checkedAudit( state = initialState, action) {
    switch( action.type ) {
        case types.STATE_STREAM :
            return Object.assign({}, state, {
                state:action.data
            })
            break;
        default:
            return state
    }
}
