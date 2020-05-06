import * as actions from "../../../../actions";
import {LinearProgress, withStyles} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";

export type PageDevMonitoringProps = {
    handleLoadingSpinner: Function,
    toggleLoading: Function,
    history: any,
    onSubmit: any,
    sendingContent: any,
    loading: boolean,
    isLoading: boolean,
    userRole: any,
    toggleHeader: Function,
    setChartDataSets: Function,
    chartDataSets: any,
    size: {
        width: number,
        height: number,
    }
}

export const PageDevMonitoringMapStateToProps = (state) => {
    return {
        isLoading: state.LoadingReducer.isLoading,
        isShowHeader: state.HeaderReducer.isShowHeader,
        themeType: state.ThemeReducer.themeType,
        chartDataSets: state.ChartDataReducer.chartDataSets,
    }
};
export const PageDevMonitoringMapDispatchToProps = (dispatch) => {
    return {
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        },
        toggleHeader: (data) => {
            dispatch(actions.toggleHeader(data))
        },
        toggleTheme: (data) => {
            dispatch(actions.toggleTheme(data))
        },
        setChartDataSets: (data) => {
            dispatch(actions.setChartDataSets(data))
        }
    };
};


export const CustomSwitch = withStyles({
    switchBase: {
        color: '#D32F2F',
        '&$checked': {
            color: '#388E3C',
        },
        '&$checked + $track': {
            backgroundColor: '#388E3C',
        },
    },
    checked: {},
    track: {},
})(Switch);

export const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: 'rgb(50,44,51)',
    },
    barColorPrimary: {
        backgroundColor: '#24add0',
    },
})(LinearProgress);

export const defaultLayoutXYPosForCluster = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 3, y: 0},
    {x: 0, y: 1},
    {x: 3, y: 1},
    {x: 0, y: 2},


    //////////// 4,5,6 row
    {x: 0, y: 3},
    {x: 1, y: 3},
    {x: 2, y: 3},
    {x: 3, y: 3},

    {x: 0, y: 4},
    {x: 1, y: 4},
    {x: 2, y: 4},
    {x: 3, y: 4},

    {x: 0, y: 5},
    {x: 1, y: 5},
    {x: 2, y: 5},
    {x: 3, y: 5},
    /////////// 7,8,9rd row
    {x: 0, y: 6},
    {x: 1, y: 6},
    {x: 2, y: 6},
    {x: 3, y: 6},

    {x: 0, y: 7},
    {x: 1, y: 7},
    {x: 2, y: 7},
    {x: 3, y: 7},

    {x: 0, y: 8},
    {x: 1, y: 8},
    {x: 2, y: 8},
    {x: 3, y: 8},
]

export const defaultLayoutXYPosForAppInst = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 3, y: 0},
    {x: 0, y: 1},
    {x: 3, y: 1},
    {x: 0, y: 2},
    //////////// 4,5,6 row
    {x: 0, y: 3},
    {x: 1, y: 3},
    {x: 2, y: 3},
    {x: 3, y: 3},

    {x: 0, y: 4},
    {x: 1, y: 4},
    {x: 2, y: 4},
    {x: 3, y: 4},

    {x: 0, y: 5},
    {x: 1, y: 5},
    {x: 2, y: 5},
    {x: 3, y: 5},
    /////////// 7,8,9rd row
    {x: 0, y: 6},
    {x: 1, y: 6},
    {x: 2, y: 6},
    {x: 3, y: 6},

    {x: 0, y: 7},
    {x: 1, y: 7},
    {x: 2, y: 7},
    {x: 3, y: 7},

    {x: 0, y: 8},
    {x: 1, y: 8},
    {x: 2, y: 8},
    {x: 3, y: 8},
]

