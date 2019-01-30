
//TODO:
//tab 클릭 이벤트 받기 redux 구조
//tab 클릭 이벤트 발생하면 페이지 넘기, 페이지 넘김 애니메이션 적용

import React from 'react';
import { Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
//
import Datamap from '../libs/datamaps';
import SiteTwoPageOne from './siteTwo_page_one';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

//header
import HeaderGlobal from '../container/headerGlobal';

//style
import Styles from './styles';


const ContainerOne = (props) => (

        <SiteTwoPageOne/>

);
const Footer = () => (
    <div className='console_footer'>
        <div className='console_footer_img' />
    </div>
)

class SiteTwo extends React.Component  {
    constructor(props){
        super(props)
        this.state = {
            receivedData:null,
            url:''
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
    render() {
        return (
            <div id="mainCont">
                <ContainerOne ref={ref => this.container = ref} {...this.props} data={this.state.receivedData}></ContainerOne>
                <HeaderGlobal />
                <Footer></Footer>
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
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};
SiteTwo.defaultProps = {
    tabName : 0,
    onReceive: {data:null}
}
export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteTwo));
