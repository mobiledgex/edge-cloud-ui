// @flow
import * as React from 'react';
import {Modal as AModal, Radio} from "antd";
import {Dropdown} from "semantic-ui-react";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";
import {CLASSIFICATION, EVENT_LOG_ITEM_LIST, GRID_ITEM_TYPE, HARDWARE_TYPE} from "../../../../shared/Constants";
import {ReactSVG} from 'react-svg'
import {CircularProgress} from "@material-ui/core";
import {Center, ChartIconOuter} from "../PageMonitoringStyledComponent";
import Button from "@material-ui/core/Button";

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

export default class AddItemPopupContainer extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props)
        this.state = {
            //isOpenEditView: [],
            currentItemType: GRID_ITEM_TYPE.LINE,
            currentHwType: HARDWARE_TYPE.CPU,
            isShowHWDropDown: true,
            isShowEventLog: false,
        }
    }


    closePopupWindow() {
        this.props.parent.setState({
            isOpenEditView: false,
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
                    //title={this.props.currentGraphAppInst + " [" + this.props.cluster + "]" + "  " + this.state.hardwareType}
                    visible={this.props.isOpenEditView}
                    onOk={() => {
                        this.closePopupWindow();
                    }}
                    //maskClosable={true}
                    onCancel={() => {
                        this.closePopupWindow();

                    }}
                    closable={false}
                    bodyStyle={{
                        height: window.innerHeight * 0.42,
                        marginTop: 0,
                        marginLeft: 0,
                        backgroundColor: 'rgb(41, 44, 51)'
                    }}
                    width={'100%'}
                    style={{padding: '10px', top: 0, minWidth: 1200}}
                    footer={null}
                >
                    <div style={{width: '100%'}}>
                        <div style={{display: 'flex', width: '100%',}}>
                            {this.renderPrevBtn2()}
                            <div className='page_monitoring_popup_title'>
                                Add Item [{this.props.parent.state.currentClassification}]
                            </div>
                        </div>
                        <div className='page_monitoring_popup_title_divide'/>
                        {/*@todo:###############################*/}
                        {/*@todo:Radio.Group start               */}
                        {/*@todo:###############################*/}
                        <div className='page_monitoring_form_row'>
                            <div className='page_monitoring_form_column_left'>
                                Item Type
                            </div>
                            <Radio.Group
                                onChange={(e) => {
                                    console.log('radio checked',);

                                    let selectedItem = e.target.value;

                                    this.setState({
                                        currentItemType: selectedItem,
                                    });
                                }}
                                value={this.state.currentItemType}
                            >
                                <div className='page_monitoring_form_column_right'>
                                    {/*todo:##################################*/}
                                    {/*todo:Line Chart Icon                   */}
                                    {/*todo:##################################*/}
                                    <ChartIconOuter style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.LINE,
                                                    isShowHWDropDown: true,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                            style={PageMonitoringStyles.chartIconOuter}
                                        >
                                            <Center>
                                                <ReactSVG src={require('../images/chart/Line.svg')}
                                                          style={PageMonitoringStyles.chartIcon}
                                                          loading={() => (<Center><CircularProgress/></Center>)}/>
                                            </Center>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.LINE}>Line Chart</Radio>
                                        </div>
                                    </ChartIconOuter>
                                    {/*todo:##################################*/}
                                    {/*todo:Bar Chart Icon                    */}
                                    {/*todo:##################################*/}
                                    {this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER &&
                                    <ChartIconOuter style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.BAR,
                                                    isShowHWDropDown: true,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                            style={PageMonitoringStyles.chartIconOuter}
                                        >
                                            <Center>
                                                <ReactSVG src={require('../images/chart/Bar.svg')}
                                                          style={PageMonitoringStyles.chartIcon}
                                                          loading={() => (<Center><CircularProgress/></Center>)}/>
                                            </Center>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.BAR}>Bar Chart</Radio>
                                        </div>
                                    </ChartIconOuter>
                                    }
                                    {/*todo:##################################*/}
                                    {/*todo:Column Chart Icon*/}
                                    {/*todo:##################################*/}
                                    {this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER &&
                                    <ChartIconOuter style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.COLUMN,
                                                    isShowHWDropDown: true,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                            style={PageMonitoringStyles.chartIconOuter}
                                        >
                                            <Center>
                                                <ReactSVG src={require('../images/chart/Column.svg')}
                                                          style={PageMonitoringStyles.chartIcon}
                                                          loading={() => (<Center><CircularProgress/></Center>)}/>
                                            </Center>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.COLUMN}>Column Chart</Radio>
                                        </div>
                                    </ChartIconOuter>
                                    }
                                    {/*todo:######################################*/}
                                    {/*todo:APP_INST_EVENT_LOG*/}
                                    {/*todo:######################################*/}
                                    <ChartIconOuter style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
                                                    isShowHWDropDown: false,
                                                    isShowEventLog: true,
                                                })
                                            }}
                                            style={PageMonitoringStyles.chartIconOuter}
                                        >
                                            <Center>
                                                <ReactSVG src={require('../images/chart/Grid.svg')}
                                                          style={PageMonitoringStyles.chartIcon}
                                                          loading={() => (<Center><CircularProgress/></Center>)}/>
                                            </Center>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.APP_INST_EVENT_LOG}>Event Log</Radio>
                                        </div>
                                    </ChartIconOuter>
                                    {/*desc:###############################*/}
                                    {/*desc:map         */}
                                    {/*desc:###############################*/}
                                    <ChartIconOuter style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.MAP,
                                                    isShowHWDropDown: false,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                            style={PageMonitoringStyles.chartIconOuter}
                                        >
                                            <Center>
                                                <ReactSVG src={require('../images/chart/Map.svg')}
                                                          style={PageMonitoringStyles.chartIcon}
                                                          loading={() => (<Center><CircularProgress/></Center>)}/>
                                            </Center>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.MAP}>Map</Radio>
                                        </div>
                                    </ChartIconOuter>

                                    {/*desc:###############################*/}
                                    {/*desc: bubble                        */}
                                    {/*desc:###############################*/}
                                    <ChartIconOuter style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.BUBBLE,
                                                    isShowHWDropDown: false,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                            style={PageMonitoringStyles.chartIconOuter}
                                        >
                                            <Center>
                                                <ReactSVG src={require('../images/chart/Bubble.svg')}
                                                          style={PageMonitoringStyles.chartIcon}
                                                          loading={() => (<Center><CircularProgress/></Center>)}/>
                                            </Center>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.BUBBLE}>Bubble Chart</Radio>
                                        </div>
                                    </ChartIconOuter>

                                </div>
                            </Radio.Group>
                        </div>
                        {/*@todo:###############################*/}
                        {/*@todo:DROP DOWN AREA                 */}
                        {/*@todo:###############################*/}
                        {this.state.isShowHWDropDown && <div>
                            <div className='page_monitoring_form_row'>
                                <div className='page_monitoring_form_column_left' style={{fontFamily: 'ubuntu'}}>
                                    HW Type
                                </div>
                                <div className='page_monitoring_form_column_right'>
                                    <Dropdown
                                        style={PageMonitoringStyles.dropDownForClusterCloudlet3}
                                        selectOnBlur={false}
                                        onClick={e => e.stopPropagation()}
                                        placeholder="Select HW Type"
                                        selection
                                        onChange={async (e, {value}) => {
                                            this.setState({
                                                currentHwType: value,
                                            })
                                        }}
                                        value={this.state.currentHwType}
                                        options={this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER ? this.props.parent.state.hwListForCluster : this.props.parent.state.hwListForAppInst}
                                    />
                                </div>
                            </div>
                        </div>}
                        {this.state.isShowEventLog &&
                        <div className='page_monitoring_form_row'>
                            <div className='page_monitoring_form_column_left' style={{fontFamily: 'ubuntu'}}>
                                Event Log Type
                            </div>

                            <div className='page_monitoring_form_column_right'>
                                <Dropdown
                                    style={PageMonitoringStyles.dropDownForClusterCloudlet3}
                                    selectOnBlur={false}
                                    placeholder="Select Item"
                                    selection
                                    onChange={async (e, {value}) => {
                                        this.setState({
                                            currentItemType: value,
                                        })
                                    }}
                                    options={EVENT_LOG_ITEM_LIST}
                                />
                            </div>
                        </div>
                        }
                        {/*todo:############################*/}
                        {/*todo:Bottom Buttons              */}
                        {/*todo:############################*/}
                        <div className='page_monitoring_form_row' style={{marginTop: 30}}>
                            <Button
                                size={'small'}
                                style={{width: 100, backgroundColor: '#559901', color: 'white'}}
                                onClick={async () => {
                                    await this.props.parent.addGridItem(this.state.currentHwType, this.state.currentItemType);
                                    this.closePopupWindow();

                                }}
                            >
                                <label>Add</label>
                            </Button>
                            <div style={{width: 25}}/>
                            <Button
                                size={'small'}
                                style={{width: 100, backgroundColor: 'grey', color: 'white'}}
                                onClick={async () => {
                                    this.closePopupWindow();
                                }}
                            >Cancel
                            </Button>
                        </div>

                    </div>


                </AModal>

            </div>
        );
    };
};
