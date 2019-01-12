
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
            sideVisible: false
        }
    }
    clearData() {


        //TODO : 각 페이지에 데이터 전달하기 위해 redux 엑션 발생
        this.props.handleInjectData(null);

    }
    /*********************
     * Call Data from Server as REST
     **********************/
    componentDidMount() {
        //test speech


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
            <div id="bodyCont" className='main_body'>
                <div style={{position:'absolute', backgroundColor:'transparent', width:'100%', height:'100%', overflow:'hidden'}}>
                    <ContainerOne ref={ref => this.container = ref} {...this.props} data={this.state.receivedData} gotoNext={this.gotoNext} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap}></ContainerOne>
                </div>
                <Grid className='main_nav_left'>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Dropdown placeholder='Select Operator' fluid search selection options={this.state.countryOptionsOper} />
                        </Grid.Column>
                        <Grid.Column>
                            <Dropdown placeholder='Select Developer' fluid search selection options={this.state.countryOptionsDev} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div className='main_right_content'>
                    <DeveloperSideInfo sideVisible={this.state.sideVisible} gotoNext={this.gotoNext}></DeveloperSideInfo>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    let site = state.siteChanger.site;
    console.log('site -- '+site)
    let tab = state.tabChanger.tab;
    return {
        tabName: tab
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};
SiteTwoPageOne.defaultProps = {
    tabName : 0,
    onReceive: {data:null}
}
export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteTwoPageOne));
