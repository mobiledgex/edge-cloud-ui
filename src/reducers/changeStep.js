import * as types from '../actions/ActionTypes';

const initialState = {
    step: null
};
export default function changeRegion( state = initialState, action) {
    switch( action.type ) {
        case types.CHANGE_STEP :
            return Object.assign({}, state, {
                step:action.step
            })
            break;
        default:
            return state
    }
}
