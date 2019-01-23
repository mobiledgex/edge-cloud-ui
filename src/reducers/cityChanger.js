import * as types from '../actions/ActionTypes';

const initialState = {
    city: ''
};
export default function cityChanger( state = initialState, action = initialState.city) {
    switch( action.type ) {
        case types.CHANGE_CITY :
            return { ...state, city:action.data }
            break;
        default:
            return state
    }
}
