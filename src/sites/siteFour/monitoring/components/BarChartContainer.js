// @flow
import * as React from 'react';
import {renderBarChartCore, renderPlaceHolderSkeleton} from "../PageMonitoringCommonService";
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
                            {this.props.pHardwareType} Usage
                            of {this.props.parent.convertToClassification(this.props.parent.state.currentClassification)}
                        </div>
                    </div>
                    <div className='page_monitoring_container'>
                        {this.props.loading ? renderPlaceHolderSkeleton() : renderBarChartCore(this.state.chartDataSet.chartDataList, this.state.chartDataSet.hardwareType, this, this.state.graphType, this.state.isResizeComplete)}
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
