import * as types from '../actions/ActionTypes';

const initialState = {
    city: 'Barcelona'
};
export default function cityChanger( state = initialState, action) {
    switch( action.type ) {
        case types.CHANGE_CITY :
            return Object.assign({}, state, {
                city:action.city
            })
            break;
        default:
            return state
    }
}
