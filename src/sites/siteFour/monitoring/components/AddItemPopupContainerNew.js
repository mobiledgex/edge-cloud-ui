// @flow
import * as React from 'react';
import {notification, Radio, Select} from 'antd';
import {CLASSIFICATION, EVENT_LOG_ITEM_LIST_FOR_APPINST, EVENT_LOG_ITEM_LIST_FOR_CLOUDLET, EVENT_LOG_ITEM_LIST_FOR_CLUSTER} from "../../../../shared/Constants";
import {ReactSVG} from 'react-svg'
import {CircularProgress} from "@material-ui/core";
import {Center, ChartIconOuterDiv, PageMonitoringStyles} from "../common/PageMonitoringStyles";
import {GRID_ITEM_TYPE} from "../view/PageMonitoringLayoutProps";
import {convertToClassification} from "../service/PageMonitoringService";
import MaterialIcon from "material-icons-react";

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

export default class AddItemPopupContainerNew extends React.Component<Props, State> {
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
            isShowAddPopup: false,
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
            throw new Error(e.toString())
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
                    <Radio size='small' value={GRID_ITEM_TYPE.LINE} className='page_monitoring_form_radio_text'>Line </Radio>
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
                        <Radio size='small' value={GRID_ITEM_TYPE.BAR} className='page_monitoring_form_radio_text'>Bar </Radio>
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
                            <Radio size='small' value={GRID_ITEM_TYPE.COLUMN} className='page_monitoring_form_radio_text'>Column </Radio>
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
                    <Radio value={GRID_ITEM_TYPE.TABLE} className='page_monitoring_form_radio_text'>Table</Radio>
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
                    <Radio value={GRID_ITEM_TYPE.MAP} className='page_monitoring_form_radio_text'>Map</Radio>
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
                    <Radio value={GRID_ITEM_TYPE.BUBBLE} className='page_monitoring_form_radio_text'>Bubble </Radio>
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
                            maxHeight: 800, overflow: 'auto', width: '333px', zIndex: 9999999999999999999
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
                            maxHeight: 800, overflow: 'auto', width: '333px', zIndex: 9999999999999999999
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


    renderHwMultipleDropdown(hwDropdownChildren) {
        return (
            <div>
                <div className='page_monitoring_form_row'>
                    <div className='page_monitoring_form_column_left' style={{fontFamily: 'Roboto'}}>
                        <Center>
                            HW Type
                        </Center>
                    </div>
                    <div className='page_monitoring_form_column_right2'>
                        <Select
                            maxTagCount={4}
                            allowClear={true}
                            mode="multiple"
                            style={{width: '100%'}}
                            dropdownStyle={{zIndex: 9999999999999999999}}
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

    reanderPopupHeader() {
        return (
            <div className='add_item_popup_outer_header'>
                <div style={{fontSize: 14, marginLeft: 0, flex: .95, marginTop: 5, fontWeight: 'bold'}}>
                    Add Item [{convertToClassification(this.props.parent.state.currentClassification)}]
                </div>
                <div className='add_item_popup_outer_header_right_icon'>
                    <div className='headerIconDiv' style={{flex: .5, cursor: 'pointer'}} onClick={this.handleAddClicked}>
                        <MaterialIcon
                            size={'small'}
                            icon='check'
                            color={'#77BD25'}
                        />
                    </div>
                    <div style={{width: 10,}}/>
                    <div className='headerIconDiv' onClick={async () => {
                        this.closePopupWindow();
                    }}>
                        <MaterialIcon
                            size={'small'}
                            icon='close'
                            color={'#77BD25'}
                        />
                    </div>

                </div>
            </div>
        )
    }


    render() {

        let hardwareDropdownList = this.makeHwDropdownList();
        let hwDropdownChildren = this.makeHwDropdownChildren(hardwareDropdownList);

        return (
            <div className='add_item_popup_outer'>
                <div style={{width: '100%', zIndex: 999999}}>

                    {this.reanderPopupHeader()}
                    <div className='page_monitoring_popup_title_divide' style={{}}/>
                    <div className='page_monitoring_form_row'>
                        {/*todo:############################*/}
                        {/*@todo:ITEM TYPE                  */}
                        {/*todo:############################*/}
                        <div style={{flex: .5, display: 'flex'}}>
                            <div className='page_monitoring_form_column_left'>
                                <Center style={{marginLeft: 25,}}>
                                    Item Type
                                </Center>
                            </div>
                            <div style={{marginLeft: 25,}}>
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
                                        {this.renderTableRadio()}
                                        {this.renderMapRadio()}
                                        {this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER
                                        || this.props.parent.state.currentClassification === CLASSIFICATION.APP_INST_FOR_ADMIN
                                        || this.props.parent.state.currentClassification === CLASSIFICATION.APPINST ? this.renderBubbleRadio() : null}
                                    </div>
                                </Radio.Group>
                            </div>
                        </div>
                        {/*todo:############################*/}
                        {/*@todo:HW TYPE                    */}
                        {/*todo:############################*/}
                        <div className='page_monitoring_hw_type_div' style={{flex: .5}}>
                            {/*@todo:MultipleDropdown           */}
                            {this.state.isShowHWDropDown && this.renderHwMultipleDropdown(hwDropdownChildren)}
                            {/*@todo:TABLE TYPE             */}
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
                        </div>
                    </div>


                </div>

            </div>
        );
    };
};
