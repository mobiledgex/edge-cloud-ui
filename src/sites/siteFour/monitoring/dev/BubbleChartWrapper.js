// @flow
import * as React from 'react';
import BubbleChart from "../../../../components/BubbleChart";
import {handleLegendAndBubbleClickedEvent, makeLineChartDataForCluster} from "./PageDevMonitoringService";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";
import PageDevMonitoring from "./PageDevMonitoring";

type Props = {
    bubbleChartData: any,
    currentHardwareType: string,
    bubbleChartData: any,
    themeTitle: string,
    parent: PageDevMonitoring,
    isBubbleChartMaked: boolean,

};
type State = {
    bubbleChartData: any,
    themeTitle: string,
};

export default class BubbleChartWrapper extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            bubbleChartData: [],
            themeTitle: '',
        }
    }

    componentDidMount(): void {
        this.setState({
            bubbleChartData: this.props.bubbleChartData,
        })
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {

        if (this.props.bubbleChartData !== nextProps.bubbleChartData) {
            this.setState({
                bubbleChartData: nextProps.bubbleChartData,
            })
        }
        if (this.props.themeTitle !== nextProps.themeTitle) {
            this.setState({
                themeTitle: nextProps.themeTitle,
            })

        }
    }


    render() {

        let pBubbleChartData = this.state.bubbleChartData;
        let themeTitle = this.props.themeTitle;

        if (pBubbleChartData.length === 0 && this.props.parent.state.loading === false) {
            return (
                <div style={PageMonitoringStyles.noData}>
                    NO DATA
                </div>
            )
        } else {
            let appInstanceList = this.props.parent.state.appInstanceList;

            let boxWidth = (window.innerWidth - 300) / 3 - 20

            function renderZoomLevel(appInstanceListLength) {
                if (appInstanceListLength <= 4) {
                    return 0.5;
                } else {
                    return 0.6;
                }
            }


            function renderOffsetY(appInstanceListLength) {
                if (appInstanceListLength === 0) {
                    return 0.05;
                } else if (appInstanceListLength === 1) {
                    return 0.05;
                } else if (appInstanceListLength <= 4) {
                    return 0.05;
                } else {
                    return 0.00;
                }
            }


            return (
                <>
                    <div style={{
                        //backgroundColor: 'blue',
                        backgroundColor: '#1e2124',
                        height: 450,
                        // marginLeft: 0, marginRight: 0, marginBottom: 10,
                    }}>
                        <BubbleChart
                            className='bubbleChart'
                            style={{height: 300,}}
                            graph={{
                                zoom: renderZoomLevel(appInstanceList.length),
                                //zoom: 0.70,
                                offsetX: 0.15,
                                offsetY: renderOffsetY(appInstanceList.length)
                            }}
                            themeTitle={themeTitle}
                            width={boxWidth}
                            height={350}
                            padding={0} // optional value, number that set the padding between bubbles
                            showLegend={true} // optional value, pass false to disable the legend.
                            legendPercentage={20} // number that represent the % of with that legend going to use.
                            legendFont={{
                                //family: 'Candal',
                                size: 9,
                                color: 'black',
                                weight: 'bold',
                            }}
                            valueFont={{
                                //family: 'Righteous',
                                size: 12,
                                color: 'black',
                                //weight: 'bold',
                                fontStyle: 'italic',
                            }}
                            labelFont={{
                                //family: 'Righteous',
                                size: 14,
                                color: 'black',
                                weight: 'bold',
                            }}
                            bubbleClickFun={async (cluster_cloudlet, index) => {
                                try {
                                    let lineChartDataSet = makeLineChartDataForCluster(this.props.parent.state.filteredClusterUsageList, this.props.parent.state.currentHardwareType, this.props.parent)
                                    cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1]
                                    handleLegendAndBubbleClickedEvent(this.props.parent, cluster_cloudlet, lineChartDataSet)
                                } catch (e) {

                                }


                            }}
                            legendClickFun={async (cluster_cloudlet, index) => {
                                try {
                                    let lineChartDataSet = makeLineChartDataForCluster(this.props.parent.state.filteredClusterUsageList, this.props.parent.state.currentHardwareType, this.props.parent)
                                    cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1]
                                    handleLegendAndBubbleClickedEvent(this.props.parent, cluster_cloudlet, lineChartDataSet)
                                } catch (e) {

                                }
                            }}
                            data={pBubbleChartData}
                        />

                    </div>

                </>
            )
        }
    };
};
