// @flow
import * as React from 'react';
import {renderPlaceHolderLoader} from "../service/PageMonitoringCommonService";
import PageDevMonitoring from "../view/PageDevOperMonitoringView";
import {Chart as GoogleChart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import {barChartOption, columnChartOption} from "../common/PageMonitoringUtils";
import {GRID_ITEM_TYPE} from "../view/PageMonitoringLayoutProps";
import {Line} from "react-chartjs-2";
import {
    convertHWType,
    makeGradientLineChartData,
    makeGradientLineChartDataForOneColor,
    makeLineChartOptions
} from "../service/PageDevOperMonitoringService";

type Props = {
    parent: PageDevMonitoring,
    pHardwareType: string,
    graphType: string,
    chartDataSet: any,
    isResizeComplete: boolean,
    filteredCloudletListLength: number,
};
type State = {
    currentClassification: any,
    themeTitle: string,
    chartDataSet: any,
    graphType: string,
    isResizeComplete: boolean,
    lineChartDataSet: any,
};

export default class BarAndLineChartContainer extends React.Component<Props, State> {
    context = React.createRef();

    constructor(props: Props) {
        super(props)
        this.state = {
            currentClassification: [],
            themeTitle: '',
            chartDataSet: [],
            graphType: '',
            lineChartDataSet: [],
        }
    }

    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {

        if (this.props.chartDataSet !== nextProps.chartDataSet && nextProps.chartDataSet !== undefined) {


            this.setState({
                chartDataSet: nextProps.chartDataSet,
                pHardwareType: nextProps.pHardwareType,
                graphType: nextProps.graphType,
            })
        }

        if (this.props.isResizeComplete !== nextProps.isResizeComplete) {
            this.setState({
                isResizeComplete: nextProps.isResizeComplete,
            })
        }


        //todo:lineChartDataSets
        if (this.props.lineChartDataSets !== nextProps.lineChartDataSets) {
            let lineChartDataSet = nextProps.lineChartDataSets
            let hwType = nextProps.pHardwareType;
            let graphType = nextProps.graphType;
            this.setChartDataForOneData(lineChartDataSet, hwType, graphType);
        }

    }

    setChartDataForOneData(lineChartDataSet, hwType, graphType) {
        let levelTypeNameList = lineChartDataSet.levelTypeNameList;
        let usageSetList = lineChartDataSet.usageSetList;
        let newDateTimeList = lineChartDataSet.newDateTimeList;
        let hardwareType = lineChartDataSet.hardwareType;

        const lineChartDataForRendering = makeGradientLineChartData(levelTypeNameList, usageSetList, newDateTimeList, this.props.parent, this.props.parent.state.isStackedLineChart, hardwareType, true)
        this.setState({
            lineChartDataSet: lineChartDataForRendering,
        })

    }

    render() {
        return (
            <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                <div className='page_monitoring_dual_container' style={{flex: 1}}>
                    <div className='page_monitoring_title_area draggable'>
                        <div className='page_monitoring_title'>
                            {this.props.parent.convertToClassification(this.props.parent.state.currentClassification)} {convertHWType(this.props.pHardwareType)} Utilization
                        </div>
                    </div>
                    <div className='page_monitoring_container'>
                        {this.props.loading ? renderPlaceHolderLoader() :
                            this.props.filteredCloudletListLength > 1 ?
                                <div style={{width: '100%'}}>
                                    <GoogleChart
                                        key={this.state.isResizeComplete}
                                        height={'100%'}
                                        chartType={this.state.graphType === GRID_ITEM_TYPE.BAR ? 'BarChart' : 'ColumnChart'}
                                        loader={<div><CircularProgress style={{color: '#1cecff',}}/></div>}
                                        data={this.state.chartDataSet.chartDataList}
                                        options={this.state.graphType === GRID_ITEM_TYPE.BAR ? barChartOption(this.state.chartDataSet.hardwareType) : columnChartOption(this.state.chartDataSet.hardwareType)}
                                        chartEvents={[
                                            {
                                                eventName: "select",
                                                callback: ({chartWrapper, google}) => {
                                                    const chart = chartWrapper.getChart();
                                                    google.visualization.events.addListener(chart, "click", e => {
                                                    });
                                                }
                                            }
                                        ]}
                                    />
                                </div>
                                :
                                <div style={{width: '100%'}}>
                                    <Line
                                        data={this.state.lineChartDataSet}
                                        options={makeLineChartOptions(this.props.pHardwareType, this.state.lineChartDataSet, this.props.parent)}
                                    />
                                </div>

                        }
                    </div>
                </div>
            </div>

        )
    };
};



