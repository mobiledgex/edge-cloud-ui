import * as types from '../actions/ActionTypes';

const initialState = {
    compute: false
};
export default function computeRefresh( state = initialState, action) {
    switch( action.type ) {
        case types.COMPUTE_REFRESH :
            return Object.assign({}, state, {
                compute:action.compute
            })
            break;
        default:
            return state
    }
}
