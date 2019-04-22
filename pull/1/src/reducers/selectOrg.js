import * as types from '../actions/ActionTypes';

const initialState = {
    org: null
};
export default function selectOrg( state = initialState, action) {
    switch( action.type ) {
        case types.SELECT_ORG :
            return Object.assign({}, state, {
                org:action.org
            })
            break;
        default:
            return state
    }
}
