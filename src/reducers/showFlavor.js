import * as types from '../actions/ActionTypes';

const initialState = {
    flavor: null
};
export default function showFlavor( state = initialState, action) {
    switch( action.type ) {
        case types.SHOW_FLAVOR :
            return Object.assign({}, state, {
                flavor:action.flavor
            })
            break;
        default:
            return state
    }
}
