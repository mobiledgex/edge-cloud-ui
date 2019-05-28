import * as types from '../actions/ActionTypes';

const initialState = {
    msg: null
};
export default function alertMsg( state = initialState, action) {
    switch( action.type ) {
        case types.ALERT_MSG :
            return Object.assign({}, state, {
                msg:action.msg
            })
            break;
        default:
            return state
    }
}
