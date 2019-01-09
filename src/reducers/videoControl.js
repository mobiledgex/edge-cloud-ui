import * as types from '../actions/ActionTypes';

const initialState = {
    status: ''
};
export default function videoControl( state = initialState, action = initialState.status) {
    switch( action.type ) {
        case types.SET_VIDEO :
            return { ...state, status:action.status }
            break;
        default:
            return state
    }
}
