// @flow
import * as React from 'react';
import {CircularProgress} from "@material-ui/core";
import {renderBarChartCore, renderPlaceHolderCircular} from "../PageMonitoringCommonService";
import {convertToClassification, renderLineChartCoreForDev} from "../dev/PageDevMonitoringService";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {CLASSIFICATION} from "../../../../shared/Constants";
import type {MonitoringContextInterface} from "../PageMonitoringGlobalState";
import {MonitoringConsumer, PageMonitoringProvider} from "../PageMonitoringGlobalState";

type Props = {
    parent: PageDevMonitoring,
    pHardwareType: string,
    graphType: string,
    chartDataSet: any,
};
type State = {
    currentClassification: any,
    themeTitle: string,
    chartDataSet: any,
    pHardwareType: string,
};

export default class LineChartWrapper extends React.Component<Props, State> {

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


    render() {
        return (

            <PageMonitoringProvider>
                <MonitoringConsumer>
                    {(context: MonitoringContextInterface) => (
                        <div className='page_monitoring_dual_column' style={{display: 'flex'}}>

                            <div className='page_monitoring_dual_container' style={{flex: 1}}>
                                <div className='page_monitoring_title_area'>
                                    <div className='page_monitoring_title'>
                                        {convertToClassification(this.props.currentClassification)} {this.state.pHardwareType} Usage

                                    </div>
                                </div>
                                <div className='page_monitoring_container'>
                                    {this.props.loading ? renderPlaceHolderCircular() : renderLineChartCoreForDev(this.props.parent, this.state.chartDataSet)}
                                </div>
                            </div>
                        </div>
                    )}
                </MonitoringConsumer>
            </PageMonitoringProvider>




        );
    };
};
