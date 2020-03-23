// @flow
import * as React from 'react';
import {Modal as AModal} from "antd";
import {Dropdown} from "semantic-ui-react";
import {PageMonitoringStyles, showToast} from "../PageMonitoringCommonService";
import {
    ADD_ITEM_LIST, CHART_COLOR_APPLE,
    CHART_COLOR_LIST, CHART_COLOR_LIST2, CHART_COLOR_LIST3, CHART_COLOR_LIST4, CHART_COLOR_MONOKAI,
    CLASSIFICATION,
    GRID_ITEM_TYPE,
    THEME_OPTIONS
} from "../../../../shared/Constants";
import {reactLocalStorage} from "reactjs-localstorage";
import {getUserId} from "../dev/PageDevMonitoringService";

const FA = require('react-fontawesome')
type Props = {
    isOpenEditView: any,


};
type State = {
    isOpenEditView: any,

};

export default class PageDevMonitoringEditView extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props)
        this.state = {
            //isOpenEditView: [],
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
                        height: window.innerHeight * 0.7,
                        marginTop: -90,
                        backgroundColor: '#232323'
                    }}
                    width={'99%'}
                    footer={null}
                >
                    <div style={{width: '100%'}}>
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
                        <div style={{height:100}}/>
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        <div>
                            <div className="page_monitoring_dropdown_box">
                                <div className="page_monitoring_dropdown_label" style={{marginLeft: 0,}}>
                                    Theme
                                </div>
                                <div style={{marginBottom: 0,}}>
                                    <Dropdown
                                        selectOnBlur={false}
                                        placeholder="Select Theme"
                                        selection
                                        //style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                        onChange={async (e, {value}) => {


                                        }}
                                        options={[
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        <div>
                            <div className="page_monitoring_dropdown_box">
                                <div className="page_monitoring_dropdown_label" style={{marginLeft: 0,}}>
                                    Theme
                                </div>
                                <div style={{marginBottom: 0,}}>
                                    <Dropdown
                                        selectOnBlur={false}
                                        placeholder="Select Theme"
                                        selection
                                        //style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                        onChange={async (e, {value}) => {


                                        }}
                                        options={[
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        <div>
                            <div className="page_monitoring_dropdown_box">
                                <div className="page_monitoring_dropdown_label" style={{marginLeft: 0,}}>
                                    Theme
                                </div>
                                <div style={{marginBottom: 0,}}>
                                    <Dropdown
                                        selectOnBlur={false}
                                        placeholder="Select Theme"
                                        selection
                                        //style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                        onChange={async (e, {value}) => {


                                        }}
                                        options={[
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        {/*todo:sdlkflsdkflskdlfksdlfk*/}
                        <div>
                            <div className="page_monitoring_dropdown_box">
                                <div className="page_monitoring_dropdown_label" style={{marginLeft: 0,}}>
                                    Theme
                                </div>
                                <div style={{marginBottom: 0,}}>
                                    <Dropdown
                                        selectOnBlur={false}
                                        placeholder="Select Theme"
                                        selection
                                        //style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                        onChange={async (e, {value}) => {


                                        }}
                                        options={[
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                            {
                                                text: 'sldkfdlkf',
                                                value: 'sdlkflsdkf',
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                </AModal>

            </div>
        );
    };
};
