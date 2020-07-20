import {TOGGLE_HEADER} from "../actions/ActionTypes";

const initialState = {
    isShowHeader: true
};
export default function HeaderReducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_HEADER :
            return Object.assign({}, state, {
                isShowHeader: action.isShowHeader
            })
            break;
        default:
            return state
    }
}

