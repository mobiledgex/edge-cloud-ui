
//TODO:
//tab 클릭 이벤트 받기 redux 구조
//tab 클릭 이벤트 발생하면 페이지 넘기, 페이지 넘김 애니메이션 적용

import React from 'react';
import { Grid,Dropdown } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';
//
import BubbleMaps from '../libs/simpleMaps/bubbles-map';
import AnimatedMap from '../libs/simpleMaps/with-react-motion';
import DeveloperSideInfo from '../container/developerSideInfo'
//service
import * as Service from '../services'

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import './siteTwo_page_one.css';

let _self = null;
const ContainerOne = (props) => (

    <AnimatedMap parentProps={props}/>

);

class SiteTwoPageOne extends React.Component  {
    constructor(props){
        super(props)
        _self = this;
        this.state = {
            receivedData:null,
            url:'',
            countryOptionsOper : [
                { key: 'ba', value: 'ba', text: 'Barcelona' },
                { key: 'sp', value: 'sp', text: 'Spain' }
            ],
            countryOptionsDev : [
                { key: 'de', value: 'de', text: 'Deutsche Telekom' },
                { key: 'oo', value: 'oo', text: 'Other Operator' }
            ],
            sideVisible: false,
            cpuUsage:null,
            memUsage:null,
            network:null
        }
    }
    clearData() {


        //TODO : 각 페이지에 데이터 전달하기 위해 redux 엑션 발생
        this.props.handleInjectData(null);

    }
    /*********************
     * Call Data from Server as REST
     **********************/
    receiveCPUData(data) {
        //console.log('receive data = '+JSON.stringify(data));
        let _data = null
        data.map((key, i) => {
            if(key.inst.indexOf('dashboard') > -1) _data = data[i]
        })
        _self.setState({cpuUsage:_data.score})
        _self.props.handleInjectData({cpuUsage:_data.score});
    }
    receiveMEMData(data) {
        //console.log('memUsage data = '+JSON.stringify(data));
        let _data = null
        data.map((key, i) => {
            if(key.inst.indexOf('dashboard') > -1) _data = data[i]
        })
        _self.setState({memUsage:_data.score})
        _self.props.handleInjectData({memUsage:_data.score});
    }
    receiveNETData(dataIn, dataOut) {
        let _dataIn = null;
        dataIn.map((key, i) => {
            if(key.inst.indexOf('dashboard') > -1) _dataIn = dataIn[i]
        })
        let _dataOut = null;
        dataOut.map((key, i) => {
            if(key.inst.indexOf('dashboard') > -1) _dataOut = dataOut[i]
        })

        _self.props.handleInjectData({network:{recv:_dataIn, send:_dataOut}});

        //_self.setState({network:{recv:_dataIn, send:_dataOut}})
    }
    componentDidMount() {
        //call data from service
        Service.getStatusCPU(this.receiveCPUData, 5000);
        Service.getStatusMEM(this.receiveMEMData, 5000);
        Service.getStatusNET(this.receiveNETData, 5000);

    }



    componentWillReceiveProps(nextProps) {
        console.log('receive props ----- '+JSON.stringify(nextProps))
        /*
         라우터 사용 예제
         import React from "react";
         import {withRouter} from "react-router-dom";

         class MyComponent extends React.Component {
         ...
         myFunction() {
         this.props.history.push("/some/Path");
         }
         ...
         }
         export default withRouter(MyComponent);
         */



        // this.props.history.push({
        //     pathname: nextProps.location.pathname,
        //     search: 'pg='+nextProps['tabName'],
        //     state: { some: 'state' }
        // });

    }
    shouldComponentUpdate(nextProps, nextState) {
        //console.log("업데이트 할지 말지: " + JSON.stringify(nextProps) + " " + JSON.stringify(nextState));
        return true;
    }
    //go to NEXT
    gotoNext(value) {
        //브라우져 입력창에 주소 기록
        let mainPath = '/site3';
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    zoomIn(detailMode) {
        _self.setState({sideVisible:detailMode})
    }
    zoomOut(detailMode) {
        _self.setState({sideVisible:detailMode})
    }
    resetMap(detailMode) {
        _self.setState({sideVisible:detailMode})
    }
    render() {
        return (
            <div id="bodyCont" className='console_body'>
                <div className='console_worldmap'>
                    <ContainerOne ref={ref => this.container = ref} {...this.props} data={this.state.receivedData} gotoNext={this.gotoNext} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap}></ContainerOne>
                </div>
                <Grid className='console_nav_left'>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Dropdown placeholder='Select Operator' fluid search selection options={this.state.countryOptionsOper} />
                        </Grid.Column>
                        <Grid.Column>
                            <Dropdown placeholder='Select Developer' fluid search selection options={this.state.countryOptionsDev} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div className='console_right_content'>
                    <DeveloperSideInfo sideVisible={this.state.sideVisible} gotoNext={this.gotoNext}></DeveloperSideInfo>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    let tab = state.tabChanger.tab;
    return {
        tabName: tab
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectNetworkData(data))},
    };
};
SiteTwoPageOne.defaultProps = {
    tabName : 0,
    onReceive: {data:null}
}
export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteTwoPageOne));
