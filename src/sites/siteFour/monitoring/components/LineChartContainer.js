// @flow
import * as React from 'react';
import {renderPlaceHolderCircular} from "../PageMonitoringCommonService";
import {convertToClassification, renderLineChartCoreForDev} from "../dev/PageDevMonitoringService";
import PageDevMonitoring from "../dev/PageDevMonitoring";

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
        /*  this.setState({
              bubbleChartData: this.props.bubbleChartData,
          })*/
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {

        if (this.props.chartDataSet !== nextProps.chartDataSet) {
            this.setState({
                chartDataSet: nextProps.chartDataSet,
                pHardwareType: nextProps.pHardwareType,
                graphType: nextProps.graphType,
            })
        }


    }


    makeToShortTitle(hwType) {

        let title = this.state.pHardwareType.replace("_", "")

        if (title.includes('ACTIVECONNECTION')) {
            return 'ACTIVE CONN'
        } else if (title.includes('ACTIVECONNECTION')) {
            return 'ACTIVE CONN'
        } else if (title.includes('HANDLEDCONNECTION')) {
            return 'HANDLED CONN'
        } else if (title.includes('ACCEPTSCONNECTION')) {
            return 'ACCEPTS CONN'
        } else if (title.includes('TCPRETRANS')) {
            return 'TCP RETRANS'
        } else if (title.includes('TCPCONNS')) {
            return 'TCP CONNS'
        } else if (title.includes('UDPRECV')) {
            return 'UDP RECV'
        } else if (title.includes('UDPSENT')) {
            return 'UDP SENT'
        } else if (title.includes('RECVBYTES')) {
            return 'RECV BYTES'
        } else if (title.includes('SENDBYTES')) {
            return 'SEND BYTES'
        } else {
            return title
        }


    }


    render() {
        return (
            <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                <div className='page_monitoring_dual_container' style={{flex: 1}}>
                    <div className='page_monitoring_title_area draggable' style={{backgroundColor: 'transparent'}}>
                        <div className='page_monitoring_title' style={{fontFamily: 'Ubuntu'}}>
                            {convertToClassification(this.props.currentClassification)} {this.state.pHardwareType !== undefined && this.makeToShortTitle(this.state.pHardwareType)} Usage
                        </div>
                    </div>
                    <div className='page_monitoring_container'>
                        {this.props.loading ? renderPlaceHolderCircular() : renderLineChartCoreForDev(this.props.parent, this.state.chartDataSet, this.state.isResizeComplete)}
                    </div>
                </div>
            </div>


        );
    };
};
