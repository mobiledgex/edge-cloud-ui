// @flow
import * as React from 'react';
import {Icon, Modal as AModal} from "antd";
import ArrowBack from '@material-ui/icons/ArrowBack'
import {makeBarChartDataForCluster, makeGradientColor, makeLineChartDataForCluster} from "./PageDevMonitoringService";
import type {TypeLineChartData2} from "../../../../shared/Types";
import {CHART_COLOR_LIST, HARDWARE_TYPE, lineGraphOptions} from "../../../../shared/Constants";
import {Line} from "react-chartjs-2";
import {isEmpty} from "../PageMonitoringCommonService";

const FA = require('react-fontawesome')
type Props = {
    lineChartDataForRendering: any,
    isShowBigGraph: boolean,
    popupGraphHWType: string,

};
type State = {
    lineChartDataForRendering: any,
    options: any,
};

export default class BigModalGraphForCluster extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            lineChartDataForRendering: [],
        }
    }

    componentDidMount(): void {
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.lineChartDataForRendering !== nextProps.lineChartDataForRendering) {
            this.setState({
                lineChartDataForRendering: nextProps.lineChartDataForRendering,
            })

        }
    }

    render() {
        return (
            <div style={{flex: 1, display: 'flex'}}>
                <AModal
                    mask={false}
                    style={{
                        //top: 220,
                        //left: -470,
                    }} //@fixme :modal popup container location( absoulte)
                    //title={this.props.currentGraphAppInst + " [" + this.props.cluster + "]" + "  " + this.state.hardwareType}
                    visible={this.props.isShowBigGraph}
                    onOk={() => {
                        this.props.parent.setState({
                            isShowBigGraph: false,
                        })

                    }}
                    //maskClosable={false}
                    onCancel={() => {
                        this.props.parent.setState({
                            isShowBigGraph: false,
                        })

                    }}
                    closable={false}
                    bodyStyle={{height: window.innerHeight * 0.98, marginTop: -90, backgroundColor: 'black'}}
                    width={'99%'}
                    footer={null}
                >
                    <div style={{display: 'flex',  width: '100%'}}>
                        <div style={{flex:.025 , backgroundColor:'transparent', width:120, display:'flex', alignSelf:'center', justifyContent:'center'}} onClick={() => {
                            this.props.parent.setState({
                                isShowBigGraph: false,
                            })
                        }}>
                            {/*<ArrowBack  style={{fontSize: 30, color: 'white'}} color={'white'}/>*/}
                            <FA name="arrow-circle-left" style={{fontSize: 40, color: 'white'}}/>

                        </div>
                        <div style={{
                            color: 'white',
                            fontSize: 35,
                            flex:.9,
                            marginLeft:25,
                        }}> {this.props.popupGraphHWType} Usage Of Cluster
                        </div>

                    </div>
                    <div style={{marginTop: 50,}}>
                        <Line
                            width={window.innerWidth * 0.9}
                            ref="chart"
                            height={window.innerHeight * 0.8}
                            data={this.state.lineChartDataForRendering}
                            options={lineGraphOptions}
                            //data={data222}
                        />
                    </div>
                </AModal>

            </div>
        );
    };
};
