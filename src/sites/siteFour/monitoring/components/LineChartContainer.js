// @flow
import * as React from 'react';
import {convertToClassification, makeGradientLineChartData, makeLineChartOptions} from "../dev/PageDevMonitoringService";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {Line} from 'react-chartjs-2';
import {HARDWARE_TYPE} from "../../../../shared/Constants";

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
    pHardwareType: string,
    isResizeComplete: boolean,
};

export default class LineChartContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            currentClassification: [],
            themeTitle: '',
            chartDataSet: [],
            graphType: '',
        }
    }

    componentDidMount(): void {
        let lineChartDataSet = this.props.chartDataSet
        let hwType = this.props.pHardwareType;
        let graphType = this.props.graphType;
        this.setChartData(lineChartDataSet, hwType, graphType)
    }

    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.chartDataSet !== nextProps.chartDataSet) {
            let lineChartDataSet = nextProps.chartDataSet
            let hwType = nextProps.pHardwareType;
            let graphType = nextProps.graphType;
            this.setChartData(lineChartDataSet, hwType, graphType);
        }
    }


    setChartData(lineChartDataSet, hwType, graphType) {
        let levelTypeNameList = lineChartDataSet.levelTypeNameList;
        let usageSetList = lineChartDataSet.usageSetList;
        let newDateTimeList = lineChartDataSet.newDateTimeList;
        let hardwareType = lineChartDataSet.hardwareType;

        const lineChartDataForRendering = makeGradientLineChartData(levelTypeNameList, usageSetList, newDateTimeList, this.props.parent, this.props.parent.state.isStackedLineChart, hardwareType)
        this.setState({
            chartDataSet: lineChartDataForRendering,
            pHardwareType: hwType,
            graphType: graphType,
        })

    }

    makeToShortTitle(hwType) {
        let title = hwType.replace("_", "")
        if (title.includes(HARDWARE_TYPE.ACTIVE_CONNECTION)) {
            return 'ACTIVE CONN'
        } else if (title.includes(HARDWARE_TYPE.HANDLED_CONNECTION)) {
            return 'HANDLED CONN'
        } else if (title.includes(HARDWARE_TYPE.ACTIVE_CONNECTION)) {
            return 'ACCEPTS CONN'
        } else if (title.includes(HARDWARE_TYPE.TCPRETRANS)) {
            return 'TCP RETRANS'
        } else if (title.includes(HARDWARE_TYPE.TCPCONNS)) {
            return 'TCP CONNS'
        } else if (title.includes(HARDWARE_TYPE.UDPRECV)) {
            return 'RECV UDP Datagram'
        } else if (title.includes(HARDWARE_TYPE.UDPSENT)) {
            return 'SENT UDP Datagram'
        } else if (title.includes(HARDWARE_TYPE.RECVBYTES)) {
            return 'NETWORK RECV'
        } else if (title.includes(HARDWARE_TYPE.SENDBYTES)) {
            return 'NETWORK SENT'
        } else {
            return title + " Utilization"
        }
    }

    render() {
        return (
            <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                <div className='page_monitoring_dual_container' style={{flex: 1}}>
                    <div className='page_monitoring_title_area draggable' style={{backgroundColor: 'transparent'}}>
                        <div className='page_monitoring_title' style={{fontFamily: 'Ubuntu'}}>
                            {convertToClassification(this.props.currentClassification)} {this.state.pHardwareType !== undefined && this.makeToShortTitle(this.state.pHardwareType)}
                        </div>
                    </div>
                    <div className='page_monitoring_container'>
                        <div style={{
                            position: 'relative',
                            width: '99%',
                            height: '99%'
                        }}>
                            <Line
                                data={this.state.chartDataSet}
                                options={makeLineChartOptions(this.state.pHardwareType, this.state.chartDataSet, this.props.parent)}
                                //options={simpleGraphOptions}
                            />
                        </div>
                    </div>
                </div>
            </div>


        );
    };
};
