import React, { Component } from 'react';
import { Grid, Button, Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import 'semantic-ui-css/semantic.min.css';

//menus
import HeaderGlobalMenu from './container/headerGlobalMenu';
import HeaderGlobal from './container/headerGlobal';
import HeaderWeather from './container/headerWeather';
//redux
import { connect } from 'react-redux';
import * as actions from './actions';

//insert pages
import EntranceGlob from './sites/entranceGlob';
import SiteTwo from "./sites/siteTwo";
import SiteThree from "./sites/siteThree";
import SiteFour from "./sites/siteFour";

let self = null;

const asyncComponent = getComponent => (
    class AsyncComponent extends Component {
        constructor() {
            super();
            this.state = {Component: AsyncComponent.Component};
            this.routed = false;
        }
        componentWillMount() {
            if (!this.state.Component) {
                getComponent().then(Component => {
                    AsyncComponent.Component = Component;
                    this.setState({Component});
                });
            }
        }
        render() {
            const {Component} = this.state;
            if(Component) {
                return <Component {...this.props} />;
            }
            return null;
        }
    }
);


/**
 *
 * @param props : 커스텀
 * @param props2 : 라우터에서 주어진 값
 * @returns {*}
 * @constructor
 */
const DashboardContainer = ( props, props2) => {
    console.log('페이지 이동 == '+props.mainPath, props2.location.search, 'routed = '+self.routed)
    if(props.mainPath === '/') props.mainPath = '/site1';
    if(props2.location.search) props2.location.search = props2.location.search.replace('?', '')
    let _params = {mainPath:props.mainPath, subPath:(props2.match.params.page) ? props2.match.params.page : (props2.location.search) ? props2.location.search : 'pg=0'};
    global.areaCode = _params;


    //단 한번만 라우터 정보 기록 - 랜더링 타이밍 무한루프 피함
    if(!self.routed){
        self.props.handleChangeSite({mainPath:_params.mainPath, subPath:_params.subPath})
        self.props.handleChangeTab(
                (_params.subPath === 'pg=0') ? 0 :
                (_params.subPath === 'pg=1') ? 1 :
                (_params.subPath === 'pg=2') ? 2 :
                (_params.subPath === 'pg=3') ? 3 :
                (_params.subPath === 'pg=4') ? 4 :
                (_params.subPath === 'pg=5') ? 5 :
                0
        )

        self.routed = true;
    } else {
        self.routeCnt = 1;
    }


    return(
        (self.routeCnt === 1) ?

        <div style={{height:'100%', width:'100%', backgroundColor:'transparent'}}>
                {props.mainPath === '/' && <EntranceGlob params={_params} history={(props2.history)?props2.history:null}/>}
                {props.mainPath === '/site1' && <EntranceGlob params={_params} history={(props2.history)?props2.history:null}/>}
                {props.mainPath === '/site2' && <SiteTwo params={_params} history={(props2.history)?props2.history:null}/>}
                {props.mainPath === '/site3' && <SiteThree params={_params} history={(props2.history)?props2.history:null}/>}
                {props.mainPath === '/site4' && <SiteFour params={_params} history={(props2.history)?props2.history:null}/>}

        </div>
        :
        <div></div>
    )

}



class App extends Component {
    constructor() {
        super();
        self = this;
        this.clickTab = false;
        this.routed = false;
        this.routeCnt = 0;
    }
    state = { animation: 'ani', duration: 500 }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    //go to NEXT
    goToNext(props2) {
        //브라우져 입력창에 주소 기록
        let mainPath = '/site1';
        let subPath = 'pg=1';
        props2.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        props2.history.location.search = subPath;
        self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})
    }

    componentDidMount() {
        let pathName = window.location.pathname;
        console.log('pathName = '+pathName)
        // this.router.history.push(pathName);

    }
    componentWillReceiveProps(nextProps) {
        let props = nextProps;
        if(nextProps.clickTab) {
            let params = {params:{page:'pg='+nextProps.clickTab}}
            DashboardContainer({mainPath:nextProps.siteName.mainPath}, {match:params})
        }
    }
    render() {

        return (
            <Router history={this.props.history} ref={router=> this.router = router}>
                <div style={{width:'100%', height:'100%'}}>
                    <Route exact path='/' component={DashboardContainer.bind(this, {mainPath:'/site1'})} />
                    <Route exact path='/site1/:page' component={DashboardContainer.bind(this, {mainPath:'/site1'})} />
                    <Route exact path='/site1' component={DashboardContainer.bind(this, {mainPath:'/site1'})} />
                    <Route exact path='/site2/:page' component={DashboardContainer.bind(this, {mainPath:'/site2'})} />
                    <Route exact path='/site2' component={DashboardContainer.bind(this, {mainPath:'/site2'})} />
                    <Route exact path='/site3/:page' component={DashboardContainer.bind(this, {mainPath:'/site3'})} />
                    <Route exact path='/site3' component={DashboardContainer.bind(this, {mainPath:'/site3'})} />
                    <Route exact path='/site4' component={DashboardContainer.bind(this, {mainPath:'/site4'})} />
                    <Route exact path='/site4/:page' component={DashboardContainer.bind(this, {mainPath:'/site4'})} />
                    <Route exact path='/site5' component={DashboardContainer.bind(this, {mainPath:'/site5'})} />
                </div>
            </Router>
        );
    }
}

//export default App;

App.defaultProps = {

}

const mapStateToProps = (state, ownProps) => {

    return {
        siteName: state.siteChanger.site,
        tab: state.tabChanger.tab,
        clickTab: state.tabClick.clickTab
    };
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeTab: (data) => { dispatch(actions.changeTab(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(App);
