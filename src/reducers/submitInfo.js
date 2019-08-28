import * as types from '../actions/ActionTypes';

const initialState = {
    submit: null
};
export default function submitInfo( state = initialState, action) {
    console.log('action..', action)
    switch( action.type ) {
        case types.SUBMIT_INFO :
            return Object.assign({}, state, {
                submit:action.data
            })
            break;
        default:
            return state
    }
}
