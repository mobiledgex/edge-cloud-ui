// @flow
import * as React from 'react';
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {Bar, HorizontalBar} from "react-chartjs-2";
import 'chartjs-plugin-labels'
import {renderBarChartCore, renderPlaceHolderCircular} from "../PageMonitoringCommonService";
import {GradientBarChartOptions1, barChartOptions2, CHART_TYPE} from "../dev/PageDevMonitoringService";


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

export default class GradientBarChartContainer extends React.Component<Props, State> {
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
            }, () => {

               // alert(this.state.graphType)

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
                    <div className='page_monitoring_title_area'>
                        <div className='page_monitoring_title'>
                            Top 5 {this.props.pHardwareType} usage
                            of {this.props.parent.convertToClassification(this.props.parent.state.currentClassification)}
                        </div>
                    </div>
                    <div className='page_monitoring_container'>

                        {this.state.graphType === 'BAR' ?
                            <HorizontalBar
                                options={barChartOptions2}
                                data={this.state.chartDataSet}
                                color="#70CAD1"
                            />

                            :
                            <Bar
                                options={GradientBarChartOptions1}
                                data={this.state.chartDataSet}
                                color="#70CAD1"
                            />
                        }
                    </div>
                </div>
            </div>

        )
    };
};
