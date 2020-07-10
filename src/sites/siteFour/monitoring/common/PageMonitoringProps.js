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
        text: '3 hours',
        value: 1350,
    },
    {
        text: '2 hour',
        value: 900
    },
    {
        text: '1 hour',
        value: 450
    },
    {
        text: '30 mins',
        value: 225
    },
    {
        text: '10 mins',
        value: 75
    },
    {
        text: '5 mins',
        value: 37
    },
    {
        text: '1 mins',
        value: 7
    }

]

