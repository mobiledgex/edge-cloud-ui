
//TODO:
//tab 클릭 이벤트 받기 redux 구조
//tab 클릭 이벤트 발생하면 페이지 넘기, 페이지 넘김 애니메이션 적용

import React from 'react/lib/React';
import { Grid } from 'semantic-ui-react';
//

import { withRouter } from 'react-router-dom';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

//pages
import PageSeven from './page_seven';

//service



const ContainerOne = (props) => (
    <Grid padded className='pageSevenGrid'>
        <div className="page">
            <PageSeven/>
        </div>
    </Grid>
)

class SiteFMS extends React.Component  {
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

    }
    componentWillReceiveProps(nextProps) {

        /*
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


    }

    render() {
        return (
            <ContainerOne ref={ref => this.container = ref} {...this.props} data={this.state.receivedData}></ContainerOne>
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
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};
SiteFMS.defaultProps = {
    tabName : 0,
    onReceive: {data:null}
}
export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFMS));
