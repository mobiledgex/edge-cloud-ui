// @flow
import * as React from 'react';
import {noDataArea, renderBarChartCore, renderPlaceHolderCircular} from "../PageMonitoringCommonService";
import PageDevMonitoring from "../dev/PageDevMonitoring";

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
    graphType: string,
};

export default class BarChartWrapper extends React.Component<Props, State> {

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
            <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                <div className='page_monitoring_dual_container' style={{flex: 1}}>
                    <div className='page_monitoring_title_area'>
                        <div className='page_monitoring_title'>
                            Top 5 {this.props.pHardwareType} usage
                            of {this.props.parent.convertToClassification(this.props.parent.state.currentClassification)}
                        </div>
                    </div>
                    <div className='page_monitoring_container'>
                        {this.props.loading ? renderPlaceHolderCircular() :renderBarChartCore(this.state.chartDataSet.chartDataList, this.state.chartDataSet.hardwareType, this, this.state.graphType)}
                    </div>
                </div>
            </div>
        )
    };
};
