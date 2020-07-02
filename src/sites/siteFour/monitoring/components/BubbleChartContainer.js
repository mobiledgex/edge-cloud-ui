// @flow
import * as React from 'react';
import BubbleChartCore from "./BubbleChartCore";
import {
    handleHardwareTabChanges,
    handleLegendAndBubbleClickedEvent,
    makeLineChartData
} from "../service/PageMonitoringService";
import {makeClusterBubbleChartData, renderBarLoader, showToast} from "../service/PageMonitoringCommonService";
import PageMonitoringView from "../view/PageMonitoringView";
import {CLASSIFICATION, HARDWARE_OPTIONS_FOR_CLUSTER} from "../../../../shared/Constants";
import {Select, TreeSelect} from "antd";

const {Option} = Select;

type Props = {
    bubbleChartData: any,
    currentHardwareType: string,
    themeTitle: string,
    parent: PageMonitoringView,
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

            console.log('bubbleChartData===>', this.state.bubbleChartData);
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

        try {
            let allClusterUsageList = this.props.parent.state.allClusterUsageList;

            let boxWidth = (window.innerWidth - 300) / 3 - 20

            function renderZoomLevel(listLength) {
                if (listLength <= 4) {
                    return 0.3;
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
                    <div style={{
                        height: this.props.isBig ? window.innerHeight : 450,//window.innerHeight,
                        width: this.props.isBig ? window.innerWidth : null,
                    }}>
                        <>
                            {this.props.parent.state.loading && <div>
                                {renderBarLoader()}
                            </div>}
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
                                            <div style={{flex: .5, marginTop: 5,}}>
                                                Bubble Chart
                                            </div>
                                            : <div style={{width: window.innerWidth * 0.9}}>

                                            </div>
                                        }
                                        <div
                                            style={{flex: .4, marginRight: -50, marginTop: 2, backgroundColor: 'blue'}}>
                                            <Select
                                                dropdownMatchSelectWidth={false}
                                                dropdownStyle={{
                                                    maxHeight: 800, overflow: 'auto', width: '160px', fontSize: 10,
                                                }}
                                                ref={c => this.bubbleChartSelect = c}
                                                size={'medium'}
                                                style={{width: 125}}
                                                disabled={this.props.parent.state.bubbleChartLoader}
                                                placeholder='SELECT HARDWARE'
                                                defaultValue={HARDWARE_OPTIONS_FOR_CLUSTER[0].value}
                                                value={this.props.parent.state.currentHardwareType}
                                                onChange={async (hwType) => {
                                                    await handleHardwareTabChanges(this.props.parent, hwType)

                                                    try {
                                                        let bubbleChartData = []
                                                        if (this.props.currentClassification === CLASSIFICATION.CLUSTER || this.props.currentClassification === CLASSIFICATION.CLUSTER_FOR_ADMIN) {

                                                            console.log(`bubbleChartData===filteredClusterUsageList=>`, this.props.parent.state.filteredClusterUsageList);

                                                            console.log(`bubbleChartData===currentClassification=>`, this.props.currentClassification);
                                                            bubbleChartData = makeClusterBubbleChartData(this.props.parent.state.filteredClusterUsageList, hwType, this.props.parent.state.chartColorList, this.props.currentClassification);

                                                            console.log(`bubbleChartData====>`, bubbleChartData)
                                                        } else {//todo : appInst
                                                            bubbleChartData = makeClusterBubbleChartData(this.props.parent.state.filteredAppInstUsageList, hwType, this.props.parent.state.chartColorList, this.props.currentClassification);
                                                            console.log(`bubbleChartData===appInst=>`, bubbleChartData)
                                                        }

                                                        this.props.parent.setState({
                                                            bubbleChartData: bubbleChartData,
                                                            currentHardwareType: hwType,
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
                                                {HARDWARE_OPTIONS_FOR_CLUSTER.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.value}>{item.text}</Option>
                                                    )
                                                })}
                                            </Select>

                                        </div>
                                    </div>

                                </div>
                            </div>
                            {!this.props.parent.state.loading &&
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
                                    data={pBubbleChartData}
                                />

                            </div>

                            }
                        </>
                    </div>

                </>
            )
        } catch (e) {
            //throw new Error(e)
            showToast(e.toString())
        }
    };
};
