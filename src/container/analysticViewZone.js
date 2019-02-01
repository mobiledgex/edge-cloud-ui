import React from 'react';
import { Dropdown, Image, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import CPUMEMListView from './usage/cpumemoryListView';
import NetworkIOView from '../components/networkIOView';
import DailyReportView from '../components/dailyReportView';
import NetworkTrafficIOView from '../components/networkTrafficIOView';
import SelectFromTo from '../components/selectFromTo';
import * as service from '../services/service_monitoring_cluster';

import './styles.css';

const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 13;
var layout = [
    {"w":6,"h":14,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"Cluster Health"},
    {"w":6,"h":14,"x":6,"y":0,"i":"1","moved":false,"static":false, "title":"Application Statistics"},
    {"w":6,"h":7,"x":0,"y":15,"i":"2","moved":false,"static":false, "title":"Daily Report"},
    {"w":6,"h":7,"x":6,"y":15,"i":"3","moved":false,"static":false, "title":"Top 5 Interface Traffic"}];

let _self = null;
class AnalysticViewZone extends React.Component {
    constructor(props) {
        super(props);
        this.onHandleClick = this.onHandleClick.bind(this);
        const layout = this.generateLayout();
        this.state = {
            layout,
            listData : [
                {alarm:'3', dName:'Cluster-A', values:{cpu:35, mem:55, sys:33}},
                {alarm:'5', dName:'Cluster-B', values:{cpu:78, mem:78, sys:12}},
                {alarm:'1', dName:'Cluster-C', values:{cpu:32, mem:33, sys:67}},
                {alarm:'2', dName:'Cluster-D', values:{cpu:23, mem:46, sys:41}},
                {alarm:'4', dName:'Cluster-E', values:{cpu:55, mem:67, sys:23}}
            ],
            networkData:[]
        };
        this.state.optionOne = [
            {key:'itm_1', value:'cpu', text:'CPU Usage'},
            {key:'itm_2', value:'memory', text:'MEM Usage'},
            {key:'itm_3', value:'filesys', text:'FileSys Usage'}
            ]
        _self = this;

        this.interval = null;

    }

    onHandleClick = function(e, data) {
        this.props.handleChangeSite(data.children.props.to)
    }

    makeHeader_noChild =(title)=> (
        <Header className='panel_title'>{title}</Header>
    )
    makeHeader_date =(title)=> (
        <Header className='panel_title' style={{display:'flex',flexDirection:'row'}}>
            <div style={{display:'flex', flexGrow:8}}>{title}</div>
            {/* <SelectFromTo></SelectFromTo> */}
        </Header>
    )
    makeHeader_select =(title)=> (
        <Header className='panel_title' style={{display:'flex',flexDirection:'row'}}>
            <div style={{display:'flex', flexGrow:14}}>{title}</div>
            <div style={{display:'flex',  flexGrow:2, alignSelf:'flex-end'}} className='panel_title_filter'>
                <Dropdown placeholder='CPU Usage' fluid search selection options={this.state.optionOne} />
            </div>
        </Header>
    )

    generateDOM() {

        return layout.map((item, i) => (
            <div className="round_panel" key={i}>
                {
                    (i === 1)? this.makeHeader_date(item.title) :
                        (i === 2)? this.makeHeader_select(item.title) : this.makeHeader_noChild(item.title)
                }
                {
                    (i === 0)? <CPUMEMListView listData={this.state.listData}></CPUMEMListView>
                    : (i === 1)? <NetworkIOView />
                    : (i === 2)? <DailyReportView />
                    : (i === 3)? <NetworkTrafficIOView listData={this.state.listData}></NetworkTrafficIOView>
                    : <span>{item.i}</span>
                }
            </div>
        ))
    }

    generateLayout() {
        const p = this.props;

        return layout
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
        console.log('changed layout = ', JSON.stringify(layout))
    }
    receiveClusterInfo(result) {
        _self.setState({listData:result})
    }
    componentDidMount() {
        _self.interval = setInterval(() => {
            service.getClusterHealth(['levcluster', 'skt-barcelona-1000realities'], _self.receiveClusterInfo)
        }, 3000)


    }
    componentWillUnmount() {
        clearTimeout(_self.interval)
    }

    render() {
        return (
            <ReactGridLayout
                layout={this.state.layout}
                onLayoutChange={this.onLayoutChange}
                {...this.props}
            >
                {this.generateDOM()}
            </ReactGridLayout>
        );
    }
    static defaultProps = {
        className: "layout",
        items: 20,
        rowHeight: 30,
        cols: 12,
        width: 1600
    };
}


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},

    };
};

export default connect(null, mapDispatchProps)(AnalysticViewZone);


