// @flow
import * as React from 'react';
import {Modal as AModal} from "antd";
import {Button, Dropdown} from "semantic-ui-react";
import {PageMonitoringStyles, showToast} from "../PageMonitoringCommonService";
import {
    ADD_ITEM_LIST, CHART_COLOR_APPLE,
    CHART_COLOR_LIST, CHART_COLOR_LIST2, CHART_COLOR_LIST3, CHART_COLOR_LIST4, CHART_COLOR_MONOKAI,
    CLASSIFICATION, EVENT_LOG_ITEM_LIST,
    GRID_ITEM_TYPE, HARDWARE_TYPE,
    THEME_OPTIONS
} from "../../../../shared/Constants";
import {reactLocalStorage} from "reactjs-localstorage";
import {getUserId} from "../dev/PageDevMonitoringService";
import {Radio} from 'antd';


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

export default class MonitoringEditViewContainer extends React.Component<Props, State> {


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

    render() {
        return (
            <div style={{flex: 1, display: 'flex'}}>
                <AModal
                    mask={false}
                    style={{}}
                    //title={this.props.currentGraphAppInst + " [" + this.props.cluster + "]" + "  " + this.state.hardwareType}
                    visible={this.props.isOpenEditView}
                    onOk={() => {
                        this.closePopupWindow();
                    }}
                    //maskClosable={true}
                    onCancel={() => {
                        this.closePopupWindow();

                    }}
                    closable={true}
                    bodyStyle={{
                        height: window.innerHeight * 0.65,
                        marginTop: -90,
                        backgroundColor: '#232323'
                    }}
                    width={'99%'}
                    footer={null}
                >
                    <div style={{width: '100%', marginLeft: 70}}>
                        <div style={{display: 'flex'}}>
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
                            <div>
                                <React.Fragment>
                                    <div style={{
                                        color: 'white',
                                        fontSize: 35,
                                        flex: .2,
                                        marginLeft: 25,
                                    }}> Add Grid Item
                                    </div>
                                </React.Fragment>

                            </div>
                        </div>
                        <div style={{height: 45}}/>
                        {/*todo:theme*/}
                        {/*todo:theme*/}
                        <div style={{display: 'flex'}}>
                            <div className="page_monitoring_dropdown_label" style={{marginLeft: 0, marginRight: 67}}>
                                Theme
                            </div>
                            <div style={{marginBottom: 10,}}>
                                <Dropdown
                                    selectOnBlur={false}
                                    placeholder="Select Theme"
                                    selection
                                    value={this.props.parent.state.themeTitle}
                                    //style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                    onChange={async (e, {value}) => {
                                        await this.props.parent.setState({
                                            themeTitle: value,
                                        })
                                        this.props.parent.handleThemeChanges(value)
                                        let selectedChartColorList = [];
                                        if (value === THEME_OPTIONS.EUNDEW) {
                                            selectedChartColorList = CHART_COLOR_LIST;
                                        }
                                        if (value === THEME_OPTIONS.BLUE) {
                                            selectedChartColorList = CHART_COLOR_LIST2;
                                        }
                                        if (value === THEME_OPTIONS.GREEN) {
                                            selectedChartColorList = CHART_COLOR_LIST3;
                                        }
                                        if (value === THEME_OPTIONS.RED) {
                                            selectedChartColorList = CHART_COLOR_LIST4;
                                        }

                                        if (value === THEME_OPTIONS.MONOKAI) {
                                            selectedChartColorList = CHART_COLOR_MONOKAI;
                                        }

                                        if (value === THEME_OPTIONS.APPLE) {
                                            selectedChartColorList = CHART_COLOR_APPLE;
                                        }

                                        reactLocalStorage.setObject(getUserId() + "_mon_theme", selectedChartColorList)
                                        reactLocalStorage.set(getUserId() + "_mon_theme_title", value)
                                    }}
                                    options={this.props.parent.state.themeOptions}
                                />
                            </div>
                        </div>

                        <div style={{height: 25}}/>
                        {/*todo:Radio.Group*/}
                        {/*todo:Radio.Group*/}
                        {/*todo:Radio.Group*/}
                        <div style={{display: 'flex'}}>
                            <div className="page_monitoring_dropdown_label" style={{marginLeft: 0, marginRight: 50}}>
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
                                <div style={{display: 'flex'}}>
                                    <div>
                                        <div
                                            className='center002'
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
                                        <div className='center002'>
                                            <Radio value={GRID_ITEM_TYPE.LINE}>Line Chart</Radio>
                                        </div>
                                    </div>
                                    <div style={{width: 25}}/>
                                    {/*todo:itemOne*/}
                                    <div>
                                        <div
                                            className='center002'
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
                                        <div className='center002'>
                                            <Radio value={GRID_ITEM_TYPE.BAR}>Bar Chart</Radio>
                                        </div>
                                    </div>
                                    {/*todo:itemOne*/}
                                    <div style={{width: 25}}/>
                                    <div>
                                        <div
                                            className='center002'
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
                                        <div className='center002'>
                                            <Radio value={GRID_ITEM_TYPE.COLUMN}>Column Chart</Radio>
                                        </div>
                                    </div>
                                    <div style={{width: 25}}/>
                                    {/*todo:######################################*/}
                                    {/*todo:APP_INST_EVENT_LOG*/}
                                    {/*todo:######################################*/}
                                    <div>
                                        <div
                                            className='center002'
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
                                        <div className='center002'>
                                            <Radio value={GRID_ITEM_TYPE.APP_INST_EVENT_LOG}>Event Log</Radio>
                                        </div>
                                    </div>
                                    <div style={{width: 25}}/>
                                    {/*map and bubble chart*/}
                                    {/*map and bubble chart*/}
                                    {/*map and bubble chart*/}
                                    <div>
                                        <div
                                            className='center002'
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
                                    <div style={{width: 25}}/>
                                    <div>
                                        <div
                                            className='center002'
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
                                        <div className='center002'>
                                            <Radio value={GRID_ITEM_TYPE.BUBBLE}>Bubble</Radio>
                                        </div>
                                    </div>
                                    <div style={{width: 25}}/>
                                </div>
                            </Radio.Group>
                        </div>
                        {/*todo:Radio.Group End*/}
                        {/*todo:Radio.Group End*/}
                        {/*todo:Radio.Group End*/}

                        <div style={{height: 50}}/>
                        {this.state.isShowHWDropDown && <div>
                            <div style={{display: 'flex'}}>
                                <div className="page_monitoring_dropdown_label" style={{marginLeft: 0, marginRight: 50}}>
                                    HW Type
                                </div>
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

                        </div>}
                        {this.state.isShowEventLog &&
                        <div style={{display: 'flex'}}>
                            <div className="page_monitoring_dropdown_label" style={{marginLeft: 0, marginRight: 12}}>
                                Event Log Type
                            </div>
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

                        }


                        {/*todo:Buttons*/}
                        {/*todo:Buttons*/}
                        {/*todo:Buttons*/}
                        <div style={{height: 50}}/>
                        <div style={{display: 'flex'}}>
                            <Button
                                positive={true}
                                onClick={async () => {
                                    // __addGridItem(hwType, graphType = 'line') {

                                    await this.props.parent.__addGridItem(this.state.currentHwType, this.state.currentItemType);
                                    this.closePopupWindow();
                                    showToast('added Item!! [' + this.state.currentHwType + "]")


                                }}
                            >Add
                            </Button>
                            <div style={{width: 15}}/>
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
