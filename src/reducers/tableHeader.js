import * as types from '../actions/ActionTypes';

const initialState = {
    headers: false,
    filter: null
};
export default function tableHeader( state = initialState, action) {
    console.log('20190717 action=', action.type, state)
    switch( action.type ) {
        case types.TABLE_HEADER :
            return Object.assign({}, state, {
                headers:action.headers
            })
            break;
        case types.SAVE_FILTERS :
            return Object.assign({}, state, {
                filter:action.filter
            })
            break;
        default:
            return state
    }
}
