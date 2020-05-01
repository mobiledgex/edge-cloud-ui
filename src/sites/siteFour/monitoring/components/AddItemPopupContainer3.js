// @flow
import * as React from 'react';
import {Modal as AModal, Tabs} from "antd";
import {CHART_COLOR_LIST} from "../../../../shared/Constants";
import {demoLineChartData, materialUiDarkTheme, simpleGraphOptions} from "../dev/PageDevMonitoringService";
import {Bar, HorizontalBar, Line} from "react-chartjs-2";
import {Center2, ClusterCluoudletLabel} from "../PageMonitoringStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Button, ThemeProvider} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import '../PageMonitoring.css'
import {withSize} from "react-sizeme";

const {TabPane} = Tabs;
const FA = require('react-fontawesome')
type Props = {
    isOpenEditView2: any,
    size: {
        width: number,
        height: number,
    }
};
type State = {
    isOpenEditView: any,
    currentItemType: number,
    currentHwType: string,
    isShowHWDropDown: boolean,
    isShowEventLog: boolean,

};
export default withSize()(
    class AddItemPopupContainer3 extends React.Component<Props, State> {
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
                        closable={false}
                        bodyStyle={{
                            height: window.innerHeight * 0.935,
                            backgroundColor: 'rgb(41, 44, 51)',
                        }}
                        width={'86.2%'}
                        style={{marginLeft: 258, top: 53, height: window.innerHeight * 0.935,}}
                        footer={null}
                    >
                        <div>
                            <div style={{display: 'flex', width: '100%',}}>
                                {this.renderPrevBtn2()}
                                <div className='page_monitoring_popup_title'>
                                    Add Item asdasdasdasdasdasdasd
                                </div>
                            </div>
                            <div>
                                {this.props.size.width}
                            </div>
                            <div>
                                sdlkfsldkflsdkflskdflksdlkfl
                            </div>
                            <div>
                                sdlkfsldkflsdkflskdflksdlkfl
                            </div>
                            <div>
                                sdlkfsldkflsdkflskdflksdlkfl
                            </div>
                            <div>
                                sdlkfsldkflsdkflskdflksdlkfl
                            </div>
                        </div>

                    </AModal>

                </div>

            )
        }
    }
)
