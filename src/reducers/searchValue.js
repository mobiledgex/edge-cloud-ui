import * as types from '../actions/ActionTypes';

const initialState = {
    search: null,
    scType:'Username'
};
export default function searchValue( state = initialState, action) {
    switch( action.type ) {
        case types.SEARCH_VALUE :
            return Object.assign({}, state, {
                search:action.search,
                scType:action.scType
            })
            break;
        default:
            return state
    }
}
