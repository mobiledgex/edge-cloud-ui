import * as types from '../actions/ActionTypes';

const initialState = {
    data: false
};
export default function loadMain(state = initialState, action) {
    switch (action.type) {
        case types.LOAD_MAIN_PAGE:
            return Object.assign({}, state, {
                data: action.data
            })
        default:
            return state
    }
}
