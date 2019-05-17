import * as types from '../actions/ActionTypes';

const initialState = {
    creating: false
};
export default function creatingSpinner( state = initialState, action) {
    switch( action.type ) {
        case types.CREATING_SPINNER :
            return Object.assign({}, state, {
                creating:action.creating
            })
            break;
        default:
            return state
    }
}
