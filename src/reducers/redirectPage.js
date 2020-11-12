import * as types from '../actions/ActionTypes';

const initialState = {
    audit: null
};
export default function redirectPage( state = initialState, action) {
    switch( action.type ) {
        case types.REDIRECT_PAGE :
            return Object.assign({}, state, {
                page:action.data
            })
        default:
            return state
    }
}
