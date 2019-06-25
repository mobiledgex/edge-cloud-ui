import * as types from '../actions/ActionTypes';

const initialState = {
    data: {}
};
export default function appLaunch( state = initialState, action) {
    switch( action.type ) {
        case types.APP_LAUNCH :
            return Object.assign({}, state, {
                data:action.data
            })
            break;
        default:
            return state
    }
}
