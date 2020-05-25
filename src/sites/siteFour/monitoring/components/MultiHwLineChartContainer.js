// @flow
import * as React from 'react';
import {
    convertToClassification,
    makeGradientLineChartData,
    makeLineChartOptions,
    makeMultiLineChartDatas
} from "../service/PageDevOperMonitoringService";
import PageDevMonitoring from "../view/PageDevOperMonitoringView";
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

export default class MultiHwLineChartContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            currentClassification: [],
            themeTitle: '',
            chartDataSet: {
                datasets: [],
                labels: []
            },
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


    setChartData(plineChartDataSet, hwType, graphType) {
        let multiLineChartDatasSets = makeMultiLineChartDatas(plineChartDataSet);
        let levelTypeNameList = multiLineChartDatasSets.levelTypeNameList;
        let usageSetList = multiLineChartDatasSets.usageSetList;
        let newDateTimeList = multiLineChartDatasSets.newDateTimeList;
        let hardwareType = multiLineChartDatasSets.hardwareType;
        const lineChartDataSet = makeGradientLineChartData(levelTypeNameList, usageSetList, newDateTimeList, this.props.parent, this.props.parent.state.isStackedLineChart, hardwareType)

        let splitedHwTypes = hwType.split(",")

        let fullHwTypeNames = ''
        splitedHwTypes.map((item, index) => {
            if (index === (splitedHwTypes.length - 1)) {
                fullHwTypeNames += item
            } else {
                fullHwTypeNames += item + " / "
            }

        })

        this.setState({
            chartDataSet: lineChartDataSet,
            pHardwareType: fullHwTypeNames,
            graphType: graphType,
        })

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
        } else if (title.includes(HARDWARE_TYPE.RECVBYTES)) {
            return 'Network Recv'
        } else if (title.includes(HARDWARE_TYPE.SENDBYTES)) {
            return 'Network Sent'
        } else if (title.includes(HARDWARE_TYPE.VCPU_USED)) {
            return 'vCPU Utilization'
        } else if (title.includes(HARDWARE_TYPE.MEM_USED)) {
            return 'Mem Utilization'
        } else if (title.includes(HARDWARE_TYPE.DISK_USED)) {
            return 'Disk Utilization'
        } else {
            return title + " Utilization"
        }
    }

    render() {
        return (
            <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                <div className='page_monitoring_dual_container' style={{flex: 1}}>
                    <div className='page_monitoring_title_area draggable' style={{backgroundColor: 'transparent'}}>
                        <div className='page_monitoring_title' style={{fontFamily: 'Roboto'}}>
                            {convertToClassification(this.props.currentClassification)} {this.state.pHardwareType}
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
