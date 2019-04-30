import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false
};
export default function loadingSpinner( state = initialState, action) {
    switch( action.type ) {
        case types.LOADING_SPINNER :
            return Object.assign({}, state, {
                loading:action.loading
            })
            break;
        default:
            return state
    }
}
