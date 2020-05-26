// @flow
import * as React from 'react';
import {renderPlaceHolderLoader} from "../service/PageMonitoringCommonService";
import PageDevMonitoring from "../view/PageDevOperMonitoringView";
import {Chart as GoogleChart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import {barChartOption, columnChartOption} from "../common/PageMonitoringUtils";
import {GRID_ITEM_TYPE} from "../view/PageMonitoringLayoutProps";
import {HARDWARE_TYPE} from "../../../../shared/Constants";
import {convertHWType} from "../service/PageDevOperMonitoringService";

type Props = {
    parent: PageDevMonitoring,
    pHardwareType: string,
    graphType: string,
    chartDataSet: any,
    isResizeComplete: boolean,
};
type State = {
    currentClassification: any,
    themeTitle: string,
    chartDataSet: any,
    graphType: string,
    isResizeComplete: boolean,
};

export default class BarChartContainer extends React.Component<Props, State> {
    context = React.createRef();

    constructor(props: Props) {
        super(props)
        this.state = {
            currentClassification: [],
            themeTitle: '',
            chartDataSet: [],
            graphType: '',
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
                            <div style={{width: '100%'}}>
                                <GoogleChart
                                    key={this.state.isResizeComplete}
                                    height={'100%'}
                                    chartType={this.state.graphType === GRID_ITEM_TYPE.BAR ? 'BarChart' : 'ColumnChart'}
                                    loader={<div><CircularProgress style={{color: '#1cecff',}}/></div>}
                                    data={this.state.chartDataSet.chartDataList}
                                    options={this.state.graphType === GRID_ITEM_TYPE.BAR ? barChartOption(this.state.chartDataSet.hardwareType) : columnChartOption(this.state.chartDataSet.hardwareType)}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>

        )
    };
};


/*
<MonitoringConsumer>
    {(context: MonitoringContextInterface) => (

    )}
</MonitoringConsumer>
*/
