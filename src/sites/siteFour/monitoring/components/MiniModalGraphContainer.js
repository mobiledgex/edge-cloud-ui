// @flow
import * as React from 'react';
import {Modal as AModal} from "antd";
import {Line} from 'react-chartjs-2';
import PageDevMonitoring from "../dev/PageDevMonitoring";
import type {TypeLineChartData2} from "../../../../shared/Types";
import {lineGraphOptions} from "../../../../shared/Constants";
import {Legend} from "../PageMonitoringStyledComponent";

type Props = {
    modalIsOpen: boolean,
    parent: PageDevMonitoring,
    selectedClusterUsageOne: Array,
    appInst: string,
    selectedClusterUsageOneIndex: number
};
type State = {
    lineChartData: Array,
    options: any,
    hardwareType: any,
    cluster_cloudlet: string,

};

export default class ModalGraph extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            lineChartData: [],
            options: {},
            hardwareType: '',
            cluster_cloudlet: '',
        }
    }

    componentDidMount(): void {

    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.selectedClusterUsageOne !== nextProps.selectedClusterUsageOne) {
            let clusterUsageOne: TypeLineChartData2 = nextProps.selectedClusterUsageOne

            let hardwareType = clusterUsageOne.hardwareType
            let currentClusterName = clusterUsageOne.levelTypeNameList
            this.setState({
                cluster_cloudlet: currentClusterName
            })

            let usageSetList = clusterUsageOne.usageSetList
            let newDateTimeList = clusterUsageOne.newDateTimeList

            let index = nextProps.selectedClusterUsageOneIndex

            let arrayDatasetsList = []
            let datasetsOne = {
                label: currentClusterName,
                backgroundColor: this.props.parent.state.chartColorList[index],
                borderColor: this.props.parent.state.chartColorList[index],
                borderCapStyle: 'butt',
                fill: false,//todo: 라인차트 area fill True/false
                //backgroundColor: '',
                borderWidth: 3.5, //lineBorder
                lineTension: 0.5,
                pointColor: "#fff",
                pointStrokeColor: 'white',
                pointHighlightFill: "#fff",
                pointHighlightStroke: 'white',
                data: usageSetList,
                radius: 0,
                pointRadius: 1,
            }

            arrayDatasetsList.push(datasetsOne)

            let lineChartData = {
                labels: newDateTimeList,
                datasets: arrayDatasetsList,
            }

            this.setState({
                lineChartData: lineChartData,
                options: lineGraphOptions,
                hardwareType: hardwareType,
            }, () => {
            })
        }
    }


    render() {

        return (
            <div style={{flex: 1, display: 'flex', width: '100%'}}>
                <AModal
                    mask={false}
                    style={{top: 220, left: 140,}} //@fixme :modal popup container location( absoulte)
                    //title={this.props.currentGraphAppInst + " [" + this.props.cluster + "]" + "  " + this.state.hardwareType}
                    visible={this.props.modalIsOpen}
                    onOk={() => {
                        this.props.parent.setState({
                            modalIsOpen: false,
                        })

                    }}
                    //maskClosable={false}
                    onCancel={() => {
                        this.props.parent.setState({
                            modalIsOpen: false,
                        })

                    }}
                    maskStyle={{color: 'white'}}
                    bodyStyle={{
                        //  height: window.innerHeight - 20,
                        backgroundColor: 'rgb(41, 44, 51)',
                    }}
                    width={'30%'}
                    height={'85%'}
                    footer={null}
                >

                    <div style={{display: 'flex', backgroundColor: 'transparent', width: '100%', height: 59}}>
                        <div style={{
                            flex: .85,
                            display: 'flex',
                            color: '#FFF',
                            fontFamily: 'Roboto',
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginLeft: 3,
                        }}>
                            {this.state.cluster_cloudlet}
                        </div>
                        <div
                            style={{
                                flex: .13,
                                color: 'white',
                                fontFamily: 'ubuntu',
                                fontSize: 18,
                                fontWeight: 'bold',
                                textAlign: 'right',
                                display: 'flex',
                                marginRight: 20,
                            }}>
                            {this.state.hardwareType}
                        </div>
                    </div>
                    <Line
                        width={window.innerWidth / 3.5}
                        ref="chart"
                        height={window.innerHeight / 3.5}
                        data={this.state.lineChartData}
                        options={this.state.options}
                        //data={data222}
                    />

                </AModal>

            </div>
        );
    };
};
