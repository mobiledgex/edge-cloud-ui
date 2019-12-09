import * as types from '../actions/ActionTypes';

const initialState = {
    loading: false
};
export default function LoadingReducer(state = initialState, action) {
    switch (action.type) {
        case "toggleLoading" :
            return Object.assign({}, state, {
                isLoading: action.loading
            })
            break;
        default:
            return state
    }
}
