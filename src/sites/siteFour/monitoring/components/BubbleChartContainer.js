// @flow
import * as React from 'react';
import BubbleChartCore from "./BubbleChartCore";
import {handleHardwareTabChanges, handleLegendAndBubbleClickedEvent, makeLineChartData} from "../service/PageDevOperMonitoringService";
import {makeBubbleChartDataForCluster, renderPlaceHolderLoader} from "../service/PageMonitoringCommonService";
import PageDevMonitoring from "../view/PageDevOperMonitoringView";
import {HARDWARE_OPTIONS_FOR_CLUSTER} from "../../../../shared/Constants";
import {PageMonitoringStyles} from "../common/PageMonitoringStyles";
import {Select} from "antd";

const {Option} = Select;

type Props = {
    bubbleChartData: any,
    currentHardwareType: string,
    themeTitle: string,
    parent: PageDevMonitoring,
    isBubbleChartMaked: boolean,

};
type State = {
    bubbleChartData: any,
    themeTitle: string,
};

export default class BubbleChartContainer extends React.Component<Props, State> {

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
        }, () => {
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
            let allClusterUsageList = this.props.parent.state.allClusterUsageList;

            let boxWidth = (window.innerWidth - 300) / 3 - 20

            function renderZoomLevel(listLength) {
                if (listLength <= 4) {
                    return 0.35;
                } else {
                    return 0.4;
                }
            }


            function renderOffsetY(listLength) {
                if (listLength === 0) {
                    return 0.05;
                } else if (listLength === 1) {
                    return 0.5;
                } else if (listLength <= 4) {
                    return 0.05;
                } else {
                    return 0.02;
                }
            }


            return (
                <>
                    {this.props.loading ?
                        renderPlaceHolderLoader()
                        : <div style={{
                            //backgroundColor: 'blue',
                            //backgroundColor: '#1e2124',
                            height: this.props.isBig ? window.innerHeight : 450,//window.innerHeight,
                            width: this.props.isBig ? window.innerWidth : null,
                            // marginLeft: 0, marginRight: 0, marginBottom: 10,
                        }}>
                            <>
                                <div className='page_monitoring_title_area draggable' style={{}}>

                                    <div style={{
                                        width: '100%',
                                        height: 30
                                    }}>
                                        <div className='page_monitoring_title'
                                             style={{
                                                 display: 'flex',
                                                 flex: 1,
                                                 marginTop: 5,

                                             }}
                                        >
                                            {this.props.isBig === undefined ?
                                                <div style={{flex: .9, marginTop: 5}}>
                                                    Cluster Bubble Chart
                                                </div>
                                                : <div style={{width: window.innerWidth * 0.9}}>

                                                </div>
                                            }
                                            <div style={{flex: .1, marginRight: 50, marginTop: 2,}}>
                                                <Select
                                                    ref={c => this.bubbleChartSelect = c}
                                                    bordered={false}
                                                    size={'small'}
                                                    style={{width: 125}}
                                                    disabled={this.props.parent.state.bubbleChartLoader}
                                                    placeholder='SELECT HARDWARE'
                                                    defaultValue={HARDWARE_OPTIONS_FOR_CLUSTER[0].value}
                                                    value={this.props.parent.state.currentHardwareType}
                                                    onChange={async (value) => {
                                                        await handleHardwareTabChanges(this.props.parent, value)

                                                        try {
                                                            let bubbleChartData = makeBubbleChartDataForCluster(this.props.parent.state.filteredClusterUsageList, value, this.props.parent.state.chartColorList);

                                                            this.props.parent.setState({
                                                                bubbleChartData: bubbleChartData,
                                                                currentHardwareType: value,
                                                            }, () => {

                                                                this.bubbleChartSelect.blur();
                                                            })

                                                        } catch (e) {
                                                            // showToast(e.toString())
                                                            this.props.parent.setState({
                                                                bubbleChartLoader: false,
                                                            })
                                                        }
                                                    }}
                                                >
                                                    {HARDWARE_OPTIONS_FOR_CLUSTER.map(item => {
                                                        return (
                                                            <Option value={item.value}>{item.text}</Option>
                                                        )
                                                    })}
                                                </Select>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className='page_monitoring_container'>
                                    <BubbleChartCore
                                        className='bubbleChart'
                                        style={{height: this.props.isBig ? window.innerHeight : 350, marginLeft: -350}}
                                        graph={{
                                            zoom: renderZoomLevel(allClusterUsageList.length),
                                            //zoom: 0.10,
                                            offsetX: 0.70,
                                            offsetY: renderOffsetY(allClusterUsageList.length)
                                        }}
                                        themeTitle={themeTitle}
                                        width={this.props.isBig ? window.innerWidth * 0.8 : window.innerWidth * 0.3}
                                        height={this.props.isBig ? window.innerHeight : 300}
                                        padding={0} // optional value, number that set the padding between bubbles
                                        showLegend={false} // optional value, pass false to disable the legend.
                                        legendPercentage={0} // number that represent the % of with that legend going to use.
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
                                            family: 'Abel',
                                            size: 11,
                                            color: 'black',
                                            weight: 'bold',
                                        }}
                                        bubbleClickFun={async (cluster_cloudlet, index) => {
                                            try {
                                                let lineChartDataSet = makeLineChartData(this.props.parent.state.filteredClusterUsageList, this.props.parent.state.currentHardwareType, this.props.parent)
                                                cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1]
                                                handleLegendAndBubbleClickedEvent(this.props.parent, cluster_cloudlet, lineChartDataSet)
                                            } catch (e) {

                                            }

                                        }}
                                        legendClickFun={async (cluster_cloudlet, index) => {
                                            /*   try {
                                                   let lineChartDataSet = makeLineChartData(this.props.parent.state.filteredClusterUsageList, this.props.parent.state.currentHardwareType, this.props.parent)
                                                   cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1]
                                                   handleLegendAndBubbleClickedEvent(this.props.parent, cluster_cloudlet, lineChartDataSet)
                                               } catch (e) {

                                               }*/
                                        }}
                                        data={pBubbleChartData}
                                    />

                                </div>
                            </>
                        </div>}

                </>
            )
        }
    };
};
