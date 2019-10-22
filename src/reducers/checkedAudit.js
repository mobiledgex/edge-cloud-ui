import * as types from '../actions/ActionTypes';

const initialState = {
    audit: null
};
export default function checkedAudit( state = initialState, action) {
    switch( action.type ) {
        case types.CHECKED_AUDIT :
            return Object.assign({}, state, {
                audit:action.data
            })
            break;
        default:
            return state
    }
}
