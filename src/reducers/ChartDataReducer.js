import {SET_CHART_DATAS, TOGGLE_THEME} from "../actions/ActionTypes";

const initialState = {
    chartDataSets: {},
};
export default function ChartDataReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CHART_DATAS :
            return Object.assign({}, state, {
                chartDataSets: action.chartDataSets
            })
            break;
        default:
            return state
    }
}

