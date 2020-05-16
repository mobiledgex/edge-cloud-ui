// @flow
import * as React from 'react';
import {Modal as AModal, Tabs} from "antd";
import {CHART_COLOR_LIST} from "../../../../shared/Constants";
import {demoLineChartData, materialUiDarkTheme, simpleGraphOptions} from "../service/PageMonitoringService";
import {Bar, HorizontalBar, Line} from "react-chartjs-2";
import {Center2, ClusterCluoudletLabel} from "../common/PageMonitoringStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Button, ThemeProvider} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import '../common/PageMonitoringStyles.css'

const {TabPane} = Tabs;
const FA = require('react-fontawesome')
type Props = {
    isOpenEditView2: any,
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
            <ThemeProvider theme={materialUiDarkTheme}>
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
                                            <Center2 key={index}>
                                                <div style={{
                                                    backgroundColor: item,
                                                    width: 15,
                                                    height: 15,
                                                    borderRadius: 50,
                                                    marginTop: 3
                                                }}>
                                                </div>
                                                <ClusterCluoudletLabel
                                                    style={{
                                                        marginLeft: 4,
                                                        marginRight: 15,
                                                        marginBottom: 0
                                                    }}>
                                                    appInst{index}

                                                </ClusterCluoudletLabel>
                                            </Center2>
                                        )
                                    }
                                })}

                            </div>
                            <div style={{backgroundColor: 'black'}}>
                                {this.renderChart(this.state.type)}
                            </div>
                            {/*todo:##############################################*/}
                            {/*todo:Tabs                                          */}
                            {/*todo:##############################################*/}
                            <Tabs
                                animated={false}
                                style={{marginTop: 25}}
                                defaultActiveKey="1"
                                onChange={(key) => {

                                }}
                            >
                                {/*todo:##############################################*/}
                                {/*todo:Tabs1                                      */}
                                {/*todo:##############################################*/}
                                <TabPane tab="Tab 1" key="1" style={{minHeight: "100%", maxHeight: "100%"}}>
                                    <div style={{backgroundColor: 'transparent', display: 'flex'}}>
                                        <div style={{
                                            height: 30, marginBottom: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: 'blue',
                                        }}>
                                            TYPE
                                        </div>
                                        <div style={{width: 50}}/>
                                        <div style={{marginTop: 0, display: 'flex', flexDirection: 'column'}}>
                                            <div style={{display: 'flex'}}>
                                                <FormControl style={{minWidth: 150}}>
                                                    <Select
                                                        MenuProps={{
                                                            getContentAnchorEl: null,
                                                            anchorOrigin: {
                                                                vertical: "bottom",
                                                                horizontal: "left",
                                                            }
                                                        }}
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={this.state.type}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                type: e.target.value,
                                                            })
                                                        }}
                                                    >
                                                        <MenuItem style={{}} value={'line'}>LINE</MenuItem>
                                                        <MenuItem style={{}} value={'bar'}>BAR</MenuItem>
                                                        <MenuItem style={{}} value={'horizontal_bar'}>HORIZONTAL_BAR</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>

                                        </div>
                                    </div>
                                    <div style={{marginTop: 25, display: 'flex'}}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                this.closePopupWindow();
                                            }}
                                        >
                                            Save
                                        </Button>
                                        {/* <div style={{width: 20}}/>
                                        <Button
                                            style={{backgroundColor: 'grey'}}
                                            onClick={() => {
                                                this.closePopupWindow();
                                            }}
                                        >
                                            Cancel
                                        </Button>*/}
                                    </div>
                                </TabPane>
                                {/*desc:##############################################*/}
                                {/*desc:Tabs2                                      */}
                                {/*desc:##############################################*/}
                                <TabPane tab="Tab 2" key="2">
                                    <div>
                                        tab2
                                    </div>
                                    <div>
                                        tab2
                                    </div>
                                    <div>
                                        tab2
                                    </div>
                                    <div>
                                        tab2
                                    </div>
                                    <div>
                                        tab2
                                    </div>

                                </TabPane>
                                {/*desc:##############################################*/}
                                {/*desc:Tabs3                                      */}
                                {/*desc:##############################################*/}
                                <TabPane tab="Tab 3" key="3">
                                    tab3
                                </TabPane>
                            </Tabs>


                        </div>
                    </AModal>

                </div>
            </ThemeProvider>

        )
    }
};
