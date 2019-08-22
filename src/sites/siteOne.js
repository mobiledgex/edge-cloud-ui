
//TODO:
//tab 클릭 이벤트 받기 redux 구조
//tab 클릭 이벤트 발생하면 페이지 넘기, 페이지 넘김 애니메이션 적용

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
//
import BrowserRouter from 'react-router-dom/es/BrowserRouter';
import HashRouter from 'react-router-dom/es/HashRouter';

import { withRouter } from 'react-router-dom';
//

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

//speech

//pages
import PageOne from './page_one';
import PageTwo from './page_two';

//
// HTML5 History API 지원여부 파악
const isBrowserHistory = window.history.pushState;
const Router = isBrowserHistory ? BrowserRouter : HashRouter;


const ContainerOne = (props) => (
    <Grid padded relaxed>
        <div className="page">
                {props.params.subPath === 'pg=0' && <PageOne/>}
                {props.params.subPath === 'pg=1' && <PageTwo/>}
        </div>
    </Grid>
)
// const ContainerOne = (props) => (
//     <Grid padded relaxed>
//         <HeaderContainer/>
//         <div className="page" style={{width:"100%"}}>
//             <TransitionGroup>
//                 <Router>
//                     <div>
//                     <Switch>
//                         <Route path='/:number' component={PGTwo} />
//                         <Route exact path='/' component={PGOne}/>
//                     </Switch>
//                     </div>
//                 </Router>
//             </TransitionGroup>
//         </div>
//     </Grid>
// )
class SiteOne extends Component  {
    constructor(props){
        super(props)
        this.state = {
            receivedData:null,
            url:''
        }
    }
    clearData() {


    }
    /*********************
    * Call Data from Server as REST
    **********************/
    componentDidMount() {
        //test speech


    }
    componentWillReceiveProps(nextProps) {
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
        //   pathname: nextProps.location.pathname,
        //   search: 'pg='+nextProps['tabName'],
        //   state: { some: 'state' }
        // });

    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    render() {
        let {location} = this.props;
        return (
            <ContainerOne ref={ref => this.container = ref} {...this.props} data={this.state.receivedData}></ContainerOne>
        );
    }
};

const mapStateToProps = (state) => {
    let site = state.siteChanger.site;
    let tab = state.tabChanger.tab;
    return {
        tabName: tab,
        site: site
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};
SiteOne.defaultProps = {
    tabName : 0,
    onReceive: {data:null}
}
export default connect(mapStateToProps, mapDispatchProps)(SiteOne);
