// @flow
import * as React from 'react';
import {Modal as AModal} from "antd";
import {Button, Dropdown} from "semantic-ui-react";
import {PageMonitoringStyles, showToast} from "../PageMonitoringCommonService";
import {
    ADD_ITEM_LIST, CHART_COLOR_APPLE,
    CHART_COLOR_LIST, CHART_COLOR_LIST2, CHART_COLOR_LIST3, CHART_COLOR_LIST4, CHART_COLOR_MONOKAI,
    CLASSIFICATION,
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

};

export default class MonitoringEditViewContainer extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props)
        this.state = {
            //isOpenEditView: [],
            currentItemType: GRID_ITEM_TYPE.LINE,
            currentHwType: HARDWARE_TYPE.CPU,
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
                        <div style={{height: 100}}/>

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

                                {/*todo:itemOne*/}
                                <div>
                                    <div
                                        className='center001'
                                        onClick={() => {
                                            this.setState({
                                                currentItemType: GRID_ITEM_TYPE.LINE,
                                            })
                                        }}
                                    >
                                        <img src={require('../images/graph001.png')}/>
                                    </div>
                                    <div className='center001'>
                                        <Radio value={GRID_ITEM_TYPE.LINE}>LineChart</Radio>
                                    </div>
                                </div>
                                <div style={{width: 25}}/>
                                {/*todo:itemOne*/}
                                <div>
                                    <div
                                        className='center001'
                                        onClick={() => {
                                            this.setState({
                                                currentItemType: GRID_ITEM_TYPE.BAR,
                                            })
                                        }}
                                    >
                                        <img src={require('../images/bar001.png')}/>
                                    </div>
                                    <div className='center001'>
                                        <Radio value={GRID_ITEM_TYPE.BAR}>BarChart</Radio>
                                    </div>
                                </div>
                                {/*todo:itemOne*/}
                                <div style={{width: 25}}/>
                                <div>
                                    <div
                                        className='center001'
                                        onClick={() => {
                                            this.setState({
                                                currentItemType: GRID_ITEM_TYPE.COLUMN,
                                            })
                                        }}
                                    >
                                        <img src={require('../images/bar001.png')}/>
                                    </div>
                                    <div className='center001'>
                                        <Radio value={GRID_ITEM_TYPE.COLUMN}>ColumnChart</Radio>
                                    </div>
                                </div>
                                <div style={{width: 25}}/>
                                {/*todo:itemOne*/}
                                <div>
                                    <div
                                        className='center001'
                                        onClick={() => {
                                            this.setState({
                                                currentItemType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
                                            })
                                        }}
                                    >
                                        <img src={require('../images/log001.png')}/>
                                    </div>
                                    <div className='center001'>
                                        <Radio value={GRID_ITEM_TYPE.APP_INST_EVENT_LOG}>EventLog</Radio>
                                    </div>
                                </div>
                                <div style={{width: 25}}/>

                            </div>
                        </Radio.Group>
                        <div style={{height: 50}}/>
                        <div>
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
                        <div style={{height: 50}}/>
                        <div style={{display: 'flex'}}>
                            <Button
                                positive={true}
                                onClick={async () => {
                                    // __addGridItem(hwType, graphType = 'line') {

                                    if (this.state.currentItemType === GRID_ITEM_TYPE.APP_INST_EVENT_LOG) {
                                        alert('no implementation')
                                    } else {

                                        await this.props.parent.__addGridItem(this.state.currentHwType, this.state.currentItemType);
                                        this.closePopupWindow();
                                    }


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
