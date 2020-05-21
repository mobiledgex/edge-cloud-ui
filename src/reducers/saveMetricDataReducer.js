import * as types from "../actions/ActionTypes";

const initialState = {
    data: null
};
export default function saveMetricDataReducer(state = initialState, action) {
    switch (action.type) {
        case types.SAVE_METRICS_DATA:
            return { ...state, data: action.data };
        default:
            return state;
    }
}
