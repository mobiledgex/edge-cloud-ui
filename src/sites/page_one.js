
//TODO:
//tab 클릭 이벤트 받기 redux 구조
//tab 클릭 이벤트 발생하면 페이지 넘기, 페이지 넘김 애니메이션 적용

import React from 'react';


import { withRouter } from 'react-router-dom';
//
import Datamap from '../libs/datamaps';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

//speech



const ContainerOne = (props) => (

    <Datamap
        geographyConfig={{
            popupOnHover: false,
            highlightOnHover: false
        }}
        fills={{
            defaultFill: '#abdda4',
            USA: 'blue',
            RUS: 'red'
        }}
        bubbles={[
            {
                name: 'Not a bomb, but centered on Brazil',
                radius: 23,
                centered: 'BRA',
                country: 'USA',
                yeild: 0,
                fillKey: 'USA',
                date: '1954-03-01'
            },
            {
                name: 'Castle Bravo',
                radius: 25,
                yeild: 15000,
                country: 'USA',
                significance: 'First dry fusion fuel "staged" thermonuclear weapon; a serious nuclear fallout accident occurred',
                fillKey: 'USA',
                date: '1954-03-01',
                latitude: 11.415,
                longitude: 165.1619
            },
            {
                name: 'Tsar Bomba',
                radius: 70,
                yeild: 50000,
                country: 'USSR',
                fillKey: 'RUS',
                significance: 'Largest thermonuclear weapon ever tested-scaled down from its initial 100Mt design by 50%',
                date: '1961-10-31',
                latitude: 73.482,
                longitude: 54.5854
            }
        ]}
        bubbleOptions={{
            popupTemplate: (geo, data) =>
                `<div class="hoverinfo">Yield: ${data.yeild}\nExploded on ${data.date} by the ${data.country}`
        }}
    />

);

class pageOne extends React.Component  {
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
        return true;
    }
    render() {
        return (
            <ContainerOne ref={ref => this.container = ref} {...this.props} data={this.state.receivedData}></ContainerOne>
        );
    }
};

const mapStateToProps = (state) => {
    let site = state.siteChanger.site;
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
pageOne.defaultProps = {
    tabName : 0,
    onReceive: {data:null}
}
export default withRouter(connect(mapStateToProps, mapDispatchProps)(pageOne));
