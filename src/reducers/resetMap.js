import * as types from '../actions/ActionTypes';

const initialState = {
    region: null
};
export default function resetMap( state = initialState, action) {
    switch( action.type ) {
        case types.RESET_MAP :
            return Object.assign({}, state, {
                region:action.region
            })
            break;
        default:
            return state
    }
}
