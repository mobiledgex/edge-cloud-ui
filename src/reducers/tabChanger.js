import * as types from '../actions/ActionTypes';

const initialState = {
    tab: 0
};
export default function tabChanger( state = initialState, action = initialState.tab) {
    switch( action.type ) {
        case types.CHANGE_TAB :
            return { ...state, tab:action.tab }
            break;
        default:
            return state
    }
}
