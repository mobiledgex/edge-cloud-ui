import * as types from '../actions/ActionTypes';

const initialState = {
    tab: 0
};
export default function tabClick( state = initialState, action = initialState.tab) {
    switch( action.type ) {
        case types.CLICK_TAB :
            return { ...state, clickTab:action.clickTab }
            break;
        default:
            return state
    }
}
