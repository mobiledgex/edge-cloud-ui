// @flow
import * as React from 'react';
import {Modal as AModal, notification, Radio, Select} from "antd";
import {Dropdown} from "semantic-ui-react";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";
import {CLASSIFICATION, EVENT_LOG_ITEM_LIST, GRID_ITEM_TYPE} from "../../../../shared/Constants";
import {ReactSVG} from 'react-svg'
import {CircularProgress} from "@material-ui/core";
import {Center, ChartIconOuterDiv} from "../PageMonitoringStyledComponent";
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
    currentHwTypeList: any,
    selectDefaultValues: any,

};

const Option = Select.Option;

export default class AddItemPopupContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            //isOpenEditView: [],
            currentItemType: GRID_ITEM_TYPE.LINE,
            currentHwTypeList: [],
            isShowHWDropDown: true,
            isShowEventLog: false,
            selectDefaultValues: [],
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

    handleAddClicked = async () => {

        if (this.state.currentItemType === GRID_ITEM_TYPE.LINE || this.state.currentItemType === GRID_ITEM_TYPE.BAR || this.state.currentItemType === GRID_ITEM_TYPE.COLUMN) {
            if (this.state.currentHwTypeList.length === 0) {
                notification.warning({
                    placement: 'topLeft',
                    duration: 1,
                    message: `Please, Select HW Type`,
                });
            } else {
                let {currentHwTypeList} = this.state;


                for (let i in currentHwTypeList) {
                    await this.props.parent.addGridItem(currentHwTypeList[i], this.state.currentItemType);
                }


                //todo:init dropdown selected values
                await this.setState({
                    currentHwTypeList: [],
                })

                this.closePopupWindow();

                notification.success({
                    placement: 'bottomLeft',
                    duration: 3,
                    message: `${this.state.currentItemType} [${currentHwTypeList}] items added`,
                });
            }

        } else {

            await this.props.parent.addGridItem(this.state.currentHwType, this.state.currentItemType);
            this.closePopupWindow();

            notification.success({
                placement: 'bottomLeft',
                duration: 3,
                message: `${this.state.currentItemType} [${this.state.currentHwType}] item added`,
            });
        }


    }

    render() {

        console.log(`hwListForCluster====>`, this.props.parent.state.hwListForCluster);
        let hardwareDropdownList = []
        let hwDropdownChildren = [];
        if (this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER) {
            hardwareDropdownList = this.props.parent.state.hwListForCluster
        } else {
            hardwareDropdownList = this.props.parent.state.hwListForAppInst
        }

        hardwareDropdownList.map(item => {
            hwDropdownChildren.push(<Option key={item.value}>{item.text}</Option>);
        })

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
                        height: window.innerHeight * 0.45,
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
                                    <ChartIconOuterDiv style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.LINE,
                                                    isShowHWDropDown: true,
                                                    isShowEventLog: false,
                                                })
                                            }}
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
                                    </ChartIconOuterDiv>
                                    {/*todo:##################################*/}
                                    {/*todo:Bar Chart Icon                    */}
                                    {/*todo:##################################*/}
                                    {this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER &&
                                    <ChartIconOuterDiv style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.BAR,
                                                    isShowHWDropDown: true,
                                                    isShowEventLog: false,
                                                })
                                            }}
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
                                    </ChartIconOuterDiv>
                                    }
                                    {/*todo:##################################*/}
                                    {/*todo:Column Chart Icon*/}
                                    {/*todo:##################################*/}
                                    {this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER &&
                                    <ChartIconOuterDiv style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.COLUMN,
                                                    isShowHWDropDown: true,
                                                    isShowEventLog: false,
                                                })
                                            }}
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
                                    </ChartIconOuterDiv>
                                    }
                                    {/*todo:######################################*/}
                                    {/*todo:APP_INST_EVENT_LOG*/}
                                    {/*todo:######################################*/}
                                    <ChartIconOuterDiv style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
                                                    isShowHWDropDown: false,
                                                    isShowEventLog: true,
                                                })
                                            }}
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
                                    </ChartIconOuterDiv>
                                    {/*desc:###############################*/}
                                    {/*desc:map         */}
                                    {/*desc:###############################*/}
                                    <ChartIconOuterDiv style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.MAP,
                                                    isShowHWDropDown: false,
                                                    isShowEventLog: false,
                                                })
                                            }}
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
                                    </ChartIconOuterDiv>

                                    {/*desc:###############################*/}
                                    {/*desc: bubble                        */}
                                    {/*desc:###############################*/}
                                    <ChartIconOuterDiv style={{backgroundColor: 'transparent'}}>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.BUBBLE,
                                                    isShowHWDropDown: false,
                                                    isShowEventLog: false,
                                                })
                                            }}
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
                                    </ChartIconOuterDiv>

                                </div>
                            </Radio.Group>
                        </div>
                        {/*@todo:###############################*/}
                        {/*@todo:DROP DOWN AREA                 */}
                        {/*@todo:###############################*/}
                        {this.state.isShowHWDropDown && <div>
                            <div className='page_monitoring_form_row'>
                                <div className='page_monitoring_form_column_left' style={{fontFamily: 'ubuntu'}}>
                                    <Center>
                                        HW Type
                                    </Center>
                                </div>
                                <div className='page_monitoring_form_column_right'>
                                    <Select
                                        allowClear={true}
                                        mode="multiple"
                                        style={{width: '100%'}}
                                        placeholder="Please Select Hardware Type"
                                        value={this.state.currentHwTypeList}
                                        onChange={(values) => {
                                            this.setState({
                                                currentHwTypeList: values,
                                            })
                                        }}
                                    >
                                        {hwDropdownChildren}
                                    </Select>
                                </div>
                            </div>
                        </div>}
                        {this.state.isShowEventLog &&
                        <div className='page_monitoring_form_row'>
                            <div className='page_monitoring_form_column_left' style={{fontFamily: 'ubuntu'}}>
                                <Center>
                                    Event Log Type
                                </Center>
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
                                    value={this.state.currentItemType}
                                    options={EVENT_LOG_ITEM_LIST}
                                />
                            </div>
                        </div>
                        }
                        {/*blank*/}
                        {/*blank*/}
                        {/*blank*/}
                        {this.state.isShowEventLog === false && this.state.isShowHWDropDown === false &&
                        <div className='page_monitoring_form_row'>
                            <div className='page_monitoring_form_column_left' style={{fontFamily: 'ubuntu', height: 30}}>
                                &nbsp;
                            </div>
                        </div>
                        }
                        {/*todo:############################*/}
                        {/*todo:Bottom Buttons              */}
                        {/*todo:############################*/}
                        <div className='page_monitoring_form_row' style={{marginTop: 15}}>
                            <Button
                                size={'small'}
                                style={{width: 100, backgroundColor: '#559901', color: 'white'}}
                                onClick={this.handleAddClicked}
                            >
                                <label>Add</label>
                            </Button>
                            <div style={{width: 29}}/>
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
