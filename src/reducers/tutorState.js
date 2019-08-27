import * as types from '../actions/ActionTypes';

const initialState = {
    state: null
};
export default function tutorState( state = initialState, action) {
    switch( action.type ) {
        case types.TUTOR_STATE :
            return Object.assign({}, state, {
                state:action.state
            })
            break;
        default:
            return state
    }
}
