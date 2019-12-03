import * as types from '../actions/ActionTypes';

const initialState = {
    submit: null
};
export default function submitObj( state = initialState, action) {
    switch( action.type ) {
        case types.SUBMIT_OBJ :
            return Object.assign({}, state, {
                submit:action.data
            })
            break;
        default:
            return state
    }
}
