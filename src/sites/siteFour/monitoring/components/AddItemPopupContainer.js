// @flow
import * as React from 'react';
import {Modal as AModal, notification, Radio, Select} from 'antd';
import {CLASSIFICATION, EVENT_LOG_ITEM_LIST_FOR_APPINST, EVENT_LOG_ITEM_LIST_FOR_CLOUDLET, EVENT_LOG_ITEM_LIST_FOR_CLUSTER} from "../../../../shared/Constants";
import {ReactSVG} from 'react-svg'
import {CircularProgress} from "@material-ui/core";
import {Center, ChartIconOuterDiv, PageMonitoringStyles} from "../common/PageMonitoringStyles";
import Button from "@material-ui/core/Button";
import {GRID_ITEM_TYPE} from "../view/PageMonitoringLayoutProps";
import {showToast} from "../service/PageMonitoringCommonService";
import {convertToClassification} from "../service/PageMonitoringService";

const FA = require('react-fontawesome')
type Props = {
    isOpenEditView: any,
};

type State = {
    isOpenEditView: any,
    currentItemType: number,
    currentHwType: string,
    isShowHWDropDown: boolean,
    isShowTableType: boolean,
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
            isShowTableType: false,
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
                    description: this.state.currentHwType !== undefined ? `${this.state.currentItemType} [${this.state.currentHwType}] item added` : `${this.state.currentItemType}  item added`,
                    style: {fontSize: 9}
                });
            }


        } catch (e) {
           // showToast(e.toString())
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
                            isShowTableType: false,
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
        if (this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER
            || this.props.parent.state.currentClassification === CLASSIFICATION.CLOUDLET
            || this.props.parent.state.currentClassification === CLASSIFICATION.CLOUDLET_FOR_ADMIN
        ) {
            return (
                <ChartIconOuterDiv style={{backgroundColor: 'transparent'}}>
                    <div
                        onClick={() => {
                            this.setState({
                                currentItemType: GRID_ITEM_TYPE.BAR,
                                isShowHWDropDown: true,
                                isShowTableType: false,
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
                                    isShowTableType: false,
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

    renderTableRadio() {
        return (
            <ChartIconOuterDiv style={{backgroundColor: 'transparent'}}>
                <div
                    onClick={() => {
                        this.setState({
                            currentItemType: GRID_ITEM_TYPE.TABLE,
                            isShowHWDropDown: false,
                            isShowTableType: true,
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
                    <Radio value={GRID_ITEM_TYPE.TABLE}>Table</Radio>
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
                            isShowTableType: false,
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
                            isShowTableType: false,
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

    renderTableSelectForAppInst_Cluster() {
        return (
            <div className='page_monitoring_form_row'>
                <div className='page_monitoring_form_column_left' style={{fontFamily: 'Roboto'}}>
                    <Center>
                        Table Type
                    </Center>
                </div>

                <div className='page_monitoring_form_column_right'>
                    <Select
                        ref={c => this.tableTypeSelect2 = c}
                        showSearch={true}
                        listHeight={512}
                        style={{width: 200, maxHeight: '512px !important', fontSize: '9px !important'}}
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{
                            maxHeight: 800, overflow: 'auto', width: '333px'
                        }}
                        placeholder="Select Item"
                        onChange={async (value) => {
                            this.tableTypeSelect2.blur();
                            this.setState({
                                currentItemType: value,
                            })
                        }}
                    >
                        {this.props.parent.state.currentClassification.toLowerCase().includes('cluster') ?
                            //TODO: CLUSTER
                            EVENT_LOG_ITEM_LIST_FOR_CLUSTER.map((tableOne: any, index) => {
                                return (
                                    <Option key={index} value={tableOne.value}>
                                        <div style={{display: 'flex'}}>
                                            <div
                                                style={{
                                                    marginLeft: 7,
                                                }}
                                            >{tableOne.text}
                                            </div>
                                        </div>
                                    </Option>
                                )
                            })
                            ://TODO: APPINST
                            EVENT_LOG_ITEM_LIST_FOR_APPINST.map((tableOne: any, index) => {
                                return (
                                    <Option key={index} value={tableOne.value}>
                                        <div style={{display: 'flex'}}>
                                            <div
                                                style={{
                                                    marginLeft: 7,
                                                }}
                                            >{tableOne.text}
                                            </div>
                                        </div>
                                    </Option>
                                )
                            })
                        }
                    </Select>
                </div>
            </div>
        )
    }


    renderTableSelectForCloudlet() {
        return (
            <div className='page_monitoring_form_row'>
                <div className='page_monitoring_form_column_left' style={{fontFamily: 'Roboto'}}>
                    <Center>
                        Table Type
                    </Center>
                </div>

                <div className='page_monitoring_form_column_right'>
                    <Select
                        ref={c => this.tableTypeSelect = c}
                        showSearch={true}
                        listHeight={512}
                        style={{width: 200, maxHeight: '512px !important', fontSize: '9px !important'}}
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{
                            maxHeight: 800, overflow: 'auto', width: '333px'
                        }}
                        placeholder="Select Item"
                        onChange={async (value) => {
                            this.tableTypeSelect.blur();
                            this.setState({
                                currentItemType: value,
                            })
                        }}
                    >
                        {EVENT_LOG_ITEM_LIST_FOR_CLOUDLET.map((tableOne: any, index) => {
                            return (
                                <Option key={index} value={tableOne.value}>
                                    <div style={{display: 'flex'}}>
                                        <div
                                            style={{
                                                marginLeft: 7,
                                            }}
                                        >{tableOne.text}
                                        </div>
                                    </div>
                                </Option>
                            )
                        })}
                    </Select>
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

    renderHwMultipleDropdown(hwDropdownChildren) {
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
        if (this.props.parent.state.currentClassification === CLASSIFICATION.CLOUDLET || this.props.parent.state.currentClassification === CLASSIFICATION.CLOUDLET_FOR_ADMIN) {
            hardwareDropdownList = this.props.parent.state.hwListForCloudlet
        } else if (this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER || this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_ADMIN) {
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
                        height: window.innerHeight * 0.6,
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
                                Add Item [{convertToClassification(this.props.parent.state.currentClassification)}]
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

                                    alert(selectedItem.toString())
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
                                    {this.renderTableRadio()}
                                    {this.renderMapRadio()}
                                    {this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER
                                    || this.props.parent.state.currentClassification === CLASSIFICATION.APP_INST_FOR_ADMIN
                                    || this.props.parent.state.currentClassification === CLASSIFICATION.APPINST ? this.renderBubbleRadio() : null}
                                </div>
                            </Radio.Group>
                        </div>
                        {/*todo:############################*/}
                        {/*@todo:MultipleDropdown           */}
                        {/*todo:############################*/}
                        {this.state.isShowHWDropDown && this.renderHwMultipleDropdown(hwDropdownChildren)}

                        {/*todo:############################*/}
                        {/*@todo:TABLE TYPE             */}
                        {/*todo:############################*/}
                        {this.state.isShowTableType && this.props.parent.state.currentClassification.toLowerCase().includes(CLASSIFICATION.APPINST.toLowerCase()) ? this.renderTableSelectForAppInst_Cluster() : null}
                        {this.state.isShowTableType && this.props.parent.state.currentClassification.toLowerCase().includes(CLASSIFICATION.CLUSTER.toLowerCase()) ? this.renderTableSelectForAppInst_Cluster() : null}
                        {this.state.isShowTableType && this.props.parent.state.currentClassification.toLowerCase().includes(CLASSIFICATION.CLOUDLET.toLowerCase()) ? this.renderTableSelectForCloudlet() : null}


                        {this.state.isShowTableType === false && this.state.isShowHWDropDown === false &&
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
