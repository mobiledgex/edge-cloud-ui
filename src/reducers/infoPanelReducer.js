import * as types from '../actions/ActionTypes';

const initialState = {
    info: null
};
export default function infoPanelReducer(state = initialState, action) {
    switch (action.type) {
        case types.CLICK_INFOPANEL:
            return Object.assign({}, state, {
                info: action.info
            })
            break;
        default:
            return state
    }
}
