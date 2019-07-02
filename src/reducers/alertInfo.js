import * as types from '../actions/ActionTypes';

const initialState = {
    mode:'',
    msg:''
};
export default function alertInfo( state = initialState, action) {
    switch( action.type ) {
        case types.ALERT_INFO :
            return Object.assign({}, state, {
                mode:action.mode,
                msg:action.msg
            })
            break;
        default:
            return state
    }
}
