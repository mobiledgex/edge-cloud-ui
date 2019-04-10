import * as types from '../actions/ActionTypes';

const initialState = {
    info: null
};
export default function userInfo( state = initialState, action) {
    switch( action.type ) {
        case types.USER_INFO :
            return Object.assign({}, state, {
                info:action.info
            })
            break;
        default:
            return state
    }
}
