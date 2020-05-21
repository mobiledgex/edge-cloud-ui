// @flow
import * as React from 'react';
import {Modal as AModal, notification, Radio, Select} from "antd";
import {Dropdown} from "semantic-ui-react";
import {CLASSIFICATION, EVENT_LOG_ITEM_LIST} from "../../../../shared/Constants";
import {ReactSVG} from 'react-svg'
import {CircularProgress} from "@material-ui/core";
import {Center, ChartIconOuterDiv, PageMonitoringStyles} from "../common/PageMonitoringStyles";
import Button from "@material-ui/core/Button";
import {GRID_ITEM_TYPE} from "../view/PageMonitoringLayoutProps";
import {showToast} from "../service/PageMonitoringCommonService";

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
    loading: boolean,

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
            loading: false,
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
        try {
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
                        description: `${this.state.currentItemType} [${currentHwTypeList}] items added`,
                    });
                }

            } else {

                await this.props.parent.addGridItem(this.state.currentHwType, this.state.currentItemType);
                this.closePopupWindow();
                notification.success({
                    placement: 'bottomLeft',
                    duration: 3,
                    description: `${this.state.currentItemType} [${this.state.currentHwType}] item added`,
                    style: {fontSize: 9}
                });
            }


        } catch (e) {
            showToast(e.toString())
        }


    }


    renderLineChartRadio() {
        return (
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
        )
    }


    renderBarChartRadio() {
        if (this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER || this.props.parent.state.currentClassification === CLASSIFICATION.CLOUDLET) {
            return (
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
            )
        }

    }

    renderColumnChartRadio() {
        return (
            this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER || this.props.parent.state.currentClassification === CLASSIFICATION.CLOUDLET ?
                (
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
                ) : null

        )
    }

    renderEventLogRadio() {
        return (
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
        )
    }


    renderMapRadio() {
        return (
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
        )
    }


    renderBubbleRadio() {
        return (
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
        )
    }

    renderEventLogSelect() {
        return (
            <div className='page_monitoring_form_row'>
                <div className='page_monitoring_form_column_left' style={{fontFamily: 'Roboto'}}>
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
        )
    }

    renderBottomBtns() {
        return (
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
        )
    }

    renderHwDropdown(hwDropdownChildren) {
        return (
            <div>
                <div className='page_monitoring_form_row'>
                    <div className='page_monitoring_form_column_left' style={{fontFamily: 'Roboto'}}>
                        <Center>
                            HW Type
                        </Center>
                    </div>
                    <div className='page_monitoring_form_column_right'>
                        <Select
                            allowClear={true}
                            mode="multiple"
                            style={{width: '100%'}}
                            placeholder="Select Hardware Type"
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
            </div>
        )
    }

    makeHwDropdownList() {
        let hardwareDropdownList = []
        if (this.props.parent.state.currentClassification === CLASSIFICATION.CLOUDLET) {
            hardwareDropdownList = this.props.parent.state.hwListForCloudlet
        } else if (this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER) {
            hardwareDropdownList = this.props.parent.state.hwListForCluster
        } else {
            hardwareDropdownList = this.props.parent.state.hwListForAppInst
        }

        return hardwareDropdownList;
    }

    makeHwDropdownChildren(hardwareDropdownList) {
        let hwDropdownChildren = []
        hardwareDropdownList.map(item => {
            hwDropdownChildren.push(<Option key={item.value}>{item.text}</Option>);
        })
        return hwDropdownChildren;

    }

    render() {

        let hardwareDropdownList = this.makeHwDropdownList();
        let hwDropdownChildren = this.makeHwDropdownChildren(hardwareDropdownList);

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
                            {this.state.loading ? <div style={{marginLeft: 20,}}><CircularProgress/></div> : null}
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
                                    let selectedItem = e.target.value;

                                    this.setState({
                                        currentItemType: selectedItem,
                                    });
                                }}
                                value={this.state.currentItemType}
                            >
                                <div className='page_monitoring_form_column_right'>
                                    {this.renderLineChartRadio()}
                                    {this.renderBarChartRadio()}
                                    {this.renderColumnChartRadio()}
                                    {this.renderEventLogRadio()}
                                    {this.renderMapRadio()}
                                    {this.renderBubbleRadio()}
                                </div>
                            </Radio.Group>
                        </div>
                        {/*@todo:###############################*/}
                        {/*@todo:DROP DOWN AREA                 */}
                        {/*@todo:###############################*/}
                        {this.state.isShowHWDropDown && this.renderHwDropdown(hwDropdownChildren)}
                        {this.state.isShowEventLog && this.renderEventLogSelect()}
                        {this.state.isShowEventLog === false && this.state.isShowHWDropDown === false &&
                        <div className='page_monitoring_form_row'>
                            <div className='page_monitoring_form_column_left'
                                 style={{fontFamily: 'Roboto', height: 30}}>
                                &nbsp;
                            </div>
                        </div>
                        }
                        {/*todo:############################*/}
                        {/*todo:Bottom Buttons              */}
                        {/*todo:############################*/}
                        {this.renderBottomBtns()}

                    </div>


                </AModal>

            </div>
        );
    };
};
