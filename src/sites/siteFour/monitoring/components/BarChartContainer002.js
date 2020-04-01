// @flow
import * as React from 'react';
import {renderBarChartCore, renderPlaceHolderCircular} from "../PageMonitoringCommonService";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {Bar, HorizontalBar} from "react-chartjs-2";
import {makeGradientColorList, makeGradientColorList2} from "../dev/PageDevMonitoringService";
import 'chartjs-plugin-labels'


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

      /*  if (this.props.chartDataSet !== nextProps.chartDataSet) {
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
        }*/

    }
    lineChartData22 = (canvas) => {
        let CHARTCOLORLIST = ['#DE0000', '#FF9600', '#FFF600', '#5BCB00', '#0096FF', '#66D9EF', '#272822', '#75715E',];

        const CHART_COLOR_LIST2 = ['#65DEF1', '#A8DCD1', '#DCE2C8', '#F96900', '#F17F29', '#66D9EF', '#272822', '#75715E',]

        const CHART_COLOR_LIST3 = ['#008000', '#d7fff1', '#556B2F', '#32CD32', '#8cd790', '#66D9EF', '#272822', '#75715E',]

        const CHART_COLOR_LIST4 = ['#FF0000', '#FFBDAA', '#D4826A', '#802D15', '#551300', '#66D9EF', '#272822', '#75715E',]

        const CHART_COLOR_MONOKAI = ['#F92672', '#FD971F', '#A6E22E', '#E6DB74', '#A6E22E', '#66D9EF', '#272822', '#75715E',]
        const CHART_COLOR_APPLE = ['#0A84FF', '#30D158', '#FF453A', '#FF9F0A', '#FF375F', '#66D9EF', '#272822', '#75715E',]

        let gradientList = makeGradientColorList2(canvas, 305, CHARTCOLORLIST, true);

        return {
            labels: ['MEXDEMO1', 'Febru_2', 'MEXDEMO3', 'April4', 'May5', ],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: gradientList,
                    borderColor: gradientList,
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [65, 59, 80, 81, 56, ]
                }
            ]
        }
    };


    barOptions = {
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
            callbacks: {
                label: function (tooltipItem, chart) {
                    return tooltipItem.yLabel + ': ' + tooltipItem.xLabel + ' User';
                }
            }
        },
        plugins: {
            labels: {
                render: 'percentage'
            }
        },
    }


    render() {
        return (

            <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                <div className='page_monitoring_dual_container' style={{flex: 1}}>
                    <div className='page_monitoring_title_area'>
                        <div className='page_monitoring_title'>
                            ksdljflskdflksd
                        </div>
                    </div>
                    <div className='page_monitoring_container'>
                        <div style={{
                            position: 'relative',
                            width: '99%',
                            height: '96%'
                        }}>
                            <Bar
                                options={this.options}
                                data={this.lineChartData22}
                                color="#70CAD1"
                            />

                           {/* <HorizontalBar
                                options={this.options}
                                data={this.lineChartData22}
                                color="#70CAD1"
                            />*/}
                        </div>
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
