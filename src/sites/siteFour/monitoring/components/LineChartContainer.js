// @flow
import * as React from 'react';
import {convertToClassification, makeGradientLineChartData, makeLineChartOptions} from "../service/PageMonitoringService";
import PageMonitoringView from "../view/PageMonitoringView";
import {Line} from 'react-chartjs-2';
import {HARDWARE_TYPE} from "../../../../shared/Constants";
import type {TypeChartDataSet} from "../../../../shared/Types";
import {renderBarLoader, renderEmptyMessageBox} from "../service/PageMonitoringCommonService";

type Props = {
    parent: PageMonitoringView,
    pHardwareType: string,
    graphType: string,
    chartDataSet: any,
    isResizeComplete: boolean,
};
type State = {
    currentClassification: any,
    themeTitle: string,
    chartDataSet: any,
    pHardwareType: string,
    isResizeComplete: boolean,
    isNoData: boolean,
    isScrollEnableForLineChart: boolean,
};
export default class LineChartContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            currentClassification: [],
            themeTitle: '',
            chartDataSet: {
                datasets: [],
                labels: [],
                isNoData: false,
            },
            graphType: '',
            isNoData: false,

        }
        this.myInput = React.createRef()
    }

    async componentDidMount(): void {
        let lineChartDataSet = this.props.chartDataSet

        let hwType = this.props.pHardwareType;
        let graphType = this.props.graphType;

        this.setChartData(lineChartDataSet, hwType, graphType)
    }

    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        try {
            if (this.props.chartDataSet !== nextProps.chartDataSet) {
                let lineChartDataSet = nextProps.chartDataSet

                let hwType = nextProps.pHardwareType;
                let graphType = nextProps.graphType;
                this.setChartData(lineChartDataSet, hwType, graphType);
            }
        } catch (e) {
            throw new error(e.toString())
        }
    }


    async setChartData(lineChartDataSet, hwType, graphType) {
        try {
            let levelTypeNameList = lineChartDataSet.levelTypeNameList;
            let usageSetList = lineChartDataSet.usageSetList;
            let newDateTimeList = lineChartDataSet.newDateTimeList;
            let hardwareType = lineChartDataSet.hardwareType;
            let colorCodeIndexList = lineChartDataSet.colorCodeIndexList;
            let isStackecLineChart = this.props.parent.state.isStackedLineChart;

            const chartDataSet: TypeChartDataSet = makeGradientLineChartData(levelTypeNameList, usageSetList, newDateTimeList, this.props.parent, isStackecLineChart, hardwareType, false, colorCodeIndexList)

            this.setState({
                chartDataSet: chartDataSet,
                pHardwareType: hwType,
                graphType: graphType,
                isNoData: chartDataSet.isNoData,
            }, () => {
            })
        } catch (e) {

        }

    }

    makeToShortTitle(hwType) {
        let title = hwType.replace("_", "")
        if (title.includes(HARDWARE_TYPE.ACCEPTS_CONNECTION)) {
            return 'Accepts Conn'
        } else if (title.includes(HARDWARE_TYPE.HANDLED_CONNECTION)) {
            return 'Handled Conn'
        } else if (title.includes(HARDWARE_TYPE.ACTIVE_CONNECTION)) {
            return 'Active Conn'
        } else if (title.includes(HARDWARE_TYPE.TCPRETRANS)) {
            return 'TCP Retrans'
        } else if (title.includes(HARDWARE_TYPE.TCPCONNS)) {
            return 'TCP Conns'
        } else if (title.includes(HARDWARE_TYPE.UDPRECV)) {
            return 'Recv UDP Datagram'
        } else if (title.includes(HARDWARE_TYPE.UDPSENT)) {
            return 'Sent UDP Datagram'
        } else if (title.includes(HARDWARE_TYPE.BYTESRECVD)) {
            return 'Network Recv'
        } else if (title.includes(HARDWARE_TYPE.BYTESSENT)) {
            return 'Network Sent'
        } else if (title.includes(HARDWARE_TYPE.VCPU_USED)) {
            return 'vCPU Utilization'
        } else if (title.includes(HARDWARE_TYPE.MEM_USED)) {
            return 'Mem Utilization'
        } else if (title.includes(HARDWARE_TYPE.DISK_USED)) {
            return 'Disk Utilization'
        } else if (title.includes(HARDWARE_TYPE.FLOATING_IP_USED)) {
            return 'FLOATING IP Utilization'
        } else if (title.includes(HARDWARE_TYPE.IPV4_USED)) {
            return 'IPV4 Utilization'
        } else {
            return title + " Utilization"
        }
    }

    renderLineChartCore() {
        return (
            <Line
                ref={c => this.lineChart = c}
                height={'190px !important'}
                data={this.state.chartDataSet}
                options={makeLineChartOptions(this.state.pHardwareType, this.state.chartDataSet, this.props.parent, undefined, this.lineChart, this.props.isScrollEnableForLineChart)}
            />
        )
    }

    render() {
        return (
            <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                {this.props.loading && (<div>  {renderBarLoader()} </div>)}
                <div className='page_monitoring_dual_container' style={{flex: 1}}>
                    <div className='page_monitoring_title_area draggable' style={{backgroundColor: 'transparent'}}>
                        <div className='page_monitoring_title' onClick={() => {
                        }}>
                            {convertToClassification(this.props.currentClassification)} {this.props.pHardwareType !== undefined && this.makeToShortTitle(this.props.pHardwareType)}
                        </div>
                    </div>
                    {this.props.chartDataSet === undefined ?
                        renderEmptyMessageBox("No Data Available")
                        :
                        !this.props.parent.state.loading ?
                            this.props.isScrollEnableForLineChart ?
                                <div className="chartWrapper">
                                    <div className="chartAreaWrapper">
                                        <div style={{width: 3000}}>
                                            {this.renderLineChartCore()}
                                        </div>
                                    </div>
                                </div>
                                ://todo: non- scroll line chart
                                <div className='page_monitoring_container'>
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: '99%',
                                            height: '99%'
                                        }}
                                    >
                                        {this.renderLineChartCore()}
                                    </div>
                                </div>
                            : null
                    }

                </div>
            </div>


        );
    };
}


