import * as actions from "../../../../actions";
import {LinearProgress, withStyles} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";

export type PageMonitoringProps = {
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

export const graphDataCount = [
    {
        text: '1000 [2 hours]',
        value: 1000
    },
    {
        text: '750 [1 hour]',
        value: 750
    },
    {
        text: '500 [40 mins]',
        value: 500
    },
    {
        text: '250 [20 mins]',
        value: 250
    },
    {
        text: '100 [8 mins]',
        value: 100
    },
    {
        text: '50 [4 mins]',
        value: 50
    },
    {
        text: '20 [2 mins]',
        value: 20
    },
    {
        text: '10 [1 mins]',
        value: 10
    },

]

