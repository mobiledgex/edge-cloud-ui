import * as types from '../actions/ActionTypes';

const initialState = {
    data: undefined
};
export default function userInfo(state = initialState, action) {
    switch (action.type) {
        case types.USER_INFO:
            return Object.assign({}, state, {
                data: action.data
            })
            break;
        default:
            return state
    }
}
