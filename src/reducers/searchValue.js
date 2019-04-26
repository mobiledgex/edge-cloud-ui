import * as types from '../actions/ActionTypes';

const initialState = {
    search: null
};
export default function searchValue( state = initialState, action) {
    switch( action.type ) {
        case types.SEARCH_VALUE :
            return Object.assign({}, state, {
                search:action.search
            })
            break;
        default:
            return state
    }
}
