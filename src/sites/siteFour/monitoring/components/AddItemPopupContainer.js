// @flow
import * as React from 'react';
import {Modal as AModal, Radio} from "antd";
import {Button, Dropdown} from "semantic-ui-react";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";
import {CLASSIFICATION, EVENT_LOG_ITEM_LIST, GRID_ITEM_TYPE, HARDWARE_TYPE} from "../../../../shared/Constants";

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

    componentDidMount(): void {
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {

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
                        {/*todo:Radio.Group*/}
                        {/*todo:Radio.Group*/}
                        {/*todo:Radio.Group*/}
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
                                    <div>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.LINE,
                                                    isShowHWDropDown: true,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                        >
                                            <img src={require('../images/graph001.png')}/>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.LINE}>Line Chart</Radio>
                                        </div>
                                    </div>
                                    {/*todo:itemOne*/}
                                    <div>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.BAR,
                                                    isShowHWDropDown: true,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                        >
                                            <img src={require('../images/bar001.png')}/>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.BAR}>Bar Chart</Radio>
                                        </div>
                                    </div>
                                    {/*todo:itemOne*/}
                                    <div>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.COLUMN,
                                                    isShowHWDropDown: true,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                        >
                                            <img src={require('../images/bar001.png')}/>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.COLUMN}>Column Chart</Radio>
                                        </div>
                                    </div>
                                    {/*todo:######################################*/}
                                    {/*todo:APP_INST_EVENT_LOG*/}
                                    {/*todo:######################################*/}
                                    <div>
                                        <div
                                            onClick={() => {

                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
                                                    isShowHWDropDown: false,
                                                    isShowEventLog: true,
                                                })
                                            }}
                                        >
                                            <img src={require('../images/log001.png')}/>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.APP_INST_EVENT_LOG}>Event Log</Radio>
                                        </div>
                                    </div>
                                    {/*desc:###############################*/}
                                    {/*desc:map and bubble chart           */}
                                    {/*desc:###############################*/}
                                    <div>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.MAP,
                                                    isShowHWDropDown: false,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                        >
                                            <img src={require('../images/map001.png')}/>
                                        </div>
                                        <div className='center002'>
                                            <Radio value={GRID_ITEM_TYPE.MAP}>Map</Radio>
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            onClick={() => {
                                                this.setState({
                                                    currentItemType: GRID_ITEM_TYPE.BUBBLE,
                                                    isShowHWDropDown: false,
                                                    isShowEventLog: false,
                                                })
                                            }}
                                        >
                                            <img src={require('../images/map001.png')}/>
                                        </div>
                                        <div className='page_monitoring_form_radio_label'>
                                            <Radio value={GRID_ITEM_TYPE.BUBBLE}>Bubble</Radio>
                                        </div>
                                    </div>

                                </div>
                            </Radio.Group>
                        </div>
                        {/*todo:Radio.Group End*/}
                        {/*todo:Radio.Group End*/}
                        {/*todo:Radio.Group End*/}

                        {this.state.isShowHWDropDown && <div>
                            <div className='page_monitoring_form_row'>
                                <div className='page_monitoring_form_column_left'>
                                    HW Type
                                </div>
                                <div className='page_monitoring_form_column_right'>
                                    <Dropdown
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
                            <div className='page_monitoring_form_column_left'>
                                Event Log Type
                            </div>

                            <div className='page_monitoring_form_column_right'>
                                <Dropdown
                                    selectOnBlur={false}
                                    placeholder="Select Item"
                                    selection
                                    onChange={async (e, {value}) => {
                                        this.setState({
                                            currentItemType: value,
                                        })
                                    }}
                                    style={PageMonitoringStyles.dropDown2}
                                    options={EVENT_LOG_ITEM_LIST}
                                />
                            </div>
                        </div>
                        }
                        {/*todo:Buttons*/}
                        {/*todo:Buttons*/}
                        {/*todo:Buttons*/}
                        <div className='page_monitoring_form_row'>
                            <Button
                                positive={true}
                                onClick={async () => {
                                    // __addGridItem(hwType, graphType = 'line') {

                                    await this.props.parent.addGridItem(this.state.currentHwType, this.state.currentItemType);
                                    this.closePopupWindow();
                                    //showToast('added Item!! [' + this.state.currentHwType + "]")

                                }}
                            >Add
                            </Button>
                            <Button
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
