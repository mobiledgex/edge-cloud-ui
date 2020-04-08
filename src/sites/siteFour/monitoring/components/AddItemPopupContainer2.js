// @flow
import * as React from 'react';
import {Modal as AModal} from "antd";
import {Dropdown} from "semantic-ui-react";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";
import {CHART_COLOR_LIST} from "../../../../shared/Constants";
import {demoLineChartData, simpleGraphOptions} from "../dev/PageDevMonitoringService";
import {Bar, HorizontalBar, Line} from "react-chartjs-2";
import {Center2, ClusterCluoudletLable} from "../PageMonitoringStyledComponent";


const FA = require('react-fontawesome')
type Props = {
    isOpenEditView: any,


};
type State = {
    isOpenEditView: any,
    currentItemType: number,
    currentHwType: string,
    isShowHWDropDown: boolean,
    isShowEventLog: boolean,

};

export default class AddItemPopupContainer2 extends React.Component<Props, State> {

    state = {
        type: 'line'
    }

    renderChart(type) {
        if (type === 'line' || type === undefined) {
            return (
                <Line
                    width={window.innerWidth * 0.9}
                    ref="chart"
                    height={window.innerHeight * 0.35}
                    data={demoLineChartData}
                    options={simpleGraphOptions}
                    redraw={true}
                />
            )
        } else if (type === 'horizontal_bar') {

            return (
                <HorizontalBar
                    width={window.innerWidth * 0.9}
                    ref="chart"
                    height={window.innerHeight * 0.35}
                    data={demoLineChartData}
                    redraw={true}
                    options={simpleGraphOptions}
                />
            )
        } else {
            return (
                <Bar
                    width={window.innerWidth * 0.9}
                    ref="chart"
                    height={window.innerHeight * 0.35}
                    data={demoLineChartData}
                    redraw={true}
                    options={simpleGraphOptions}
                />
            )
        }
    }

    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.isOpenEditView2 !== nextProps.isOpenEditView2) {
            this.forceUpdate();
        }
    }


    closePopupWindow() {
        this.props.parent.setState({
            isOpenEditView2: false,
        })
    }

    renderPrevBtn2() {
        return (
            <div style={{
                flex: .025,
                backgroundColor: 'transparent',
                width: 120,
                display: 'flex',
                alignSelf: 'center',
                justifyContent: 'center'
            }} onClick={() => {
                this.closePopupWindow();
            }}>
                {/*<ArrowBack  style={{fontSize: 30, color: 'white'}} color={'white'}/>*/}
                <FA name="arrow-circle-left" style={{fontSize: 40, color: 'white'}}/>

            </div>
        )
    }

    render() {
        return (
            <div style={{flex: 1, display: 'flex'}}>
                <AModal
                    mask={false}
                    visible={this.props.isOpenEditView2}
                    onOk={() => {
                        this.closePopupWindow();
                    }}
                    //maskClosable={true}
                    onCancel={() => {
                        this.closePopupWindow();

                    }}
                    closable={true}
                    bodyStyle={{
                        height: window.innerHeight * 0.95,
                        marginTop: 0,
                        marginLeft: 0,
                        backgroundColor: 'rgb(41, 44, 51)'
                    }}
                    width={'100%'}
                    style={{padding: '10px', top: 0, minWidth: 1200}}
                    footer={null}
                >
                    <div style={{height: 1000}}>
                        <div style={{display: 'flex', width: '100%',}}>
                            {this.renderPrevBtn2()}
                            <div className='page_monitoring_popup_title'>
                                Add Item [{this.props.parent.state.currentClassification}]
                            </div>
                        </div>
                        {/*todo:리전드 area*/}
                        {/*todo:리전드 area*/}
                        {/*todo:리전드 area*/}
                        <div style={{display: 'flex', marginBottom: 15, marginLeft: 10, marginTop: 25}}>
                            {CHART_COLOR_LIST.map((item, index) => {
                                if (index < 5) {
                                    return (
                                        <Center2>
                                            <div style={{
                                                backgroundColor: item,
                                                width: 15,
                                                height: 15,
                                                borderRadius: 50,
                                                marginTop: 3
                                            }}>
                                            </div>
                                            <ClusterCluoudletLable
                                                style={{
                                                    marginLeft: 4,
                                                    marginRight: 15,
                                                    marginBottom: 0
                                                }}>
                                                appInst{index}

                                            </ClusterCluoudletLable>
                                        </Center2>
                                    )
                                }
                            })}

                        </div>
                        <div style={{backgroundColor: 'black'}}>
                            {this.renderChart(this.state.type)}
                        </div>
                        <div style={{marginTop: 30}}>
                            <div style={{marginBottom: 10}}>
                                Chart Type
                            </div>
                            <Dropdown
                                selectOnBlur={false}
                                value={this.state.type}
                                selection
                                // style={PageMonitoringStyles.dropDown}
                                options={[
                                    {
                                        text: 'line',
                                        value: 'line',
                                    },
                                    {
                                        text: 'bar',
                                        value: 'bar',
                                    },
                                    {
                                        text: 'horizontal_bar',
                                        value: 'horizontal_bar',
                                    }
                                ]}
                                onChange={async (e, {value}) => {
                                    this.setState({
                                        type: value,
                                    })
                                }}
                                style={PageMonitoringStyles.dropDownForAppInst}
                            />
                        </div>
                    </div>
                </AModal>

            </div>
        )
    }
};
