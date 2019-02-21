import React from 'react';
import { Dropdown, Button, Header, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import CPUMEMListView from './usage/cpumemoryListView';
import ApplicationView from '../components/applicationView';
import DailyReportView from '../components/dailyReportView';
import NetworkTcpUdpView from '../components/networkTcpUdpView';
import NetworkTcpUdpComposeView from '../components/networkTcpUdpComposeView';
import SelectFromTo from '../components/selectFromTo';

import * as serviceCluster from '../services/service_clusters_service';
import * as serviceCompute from '../services/service_compute_service';

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
    {"w":6,"h":7,"x":0,"y":15,"i":"2","moved":false,"static":false, "title":"Network I/O"},
    {"w":6,"h":7,"x":6,"y":15,"i":"3","moved":false,"static":false, "title":"Network I/O"}];
const panes = [
    { menuItem: 'TCP' },
    { menuItem: 'UDP' },
]
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
            networkData:[],
            tcpudpClusterData:[],
            tcpudpData:null,
            activeIndex:'tcp',
            tcpPositive:true,
            udpPositive:false,
            listCluster:null,
            selectedCloudlet:'barcelona-mexdemo'
        };
        this.state.optionOne = [
            {key:'itm_1', value:'cpu', text:'CPU Usage'},
            {key:'itm_2', value:'memory', text:'MEM Usage'},
            {key:'itm_3', value:'filesys', text:'FileSys Usage'}
            ]
        _self = this;

        this.interval = null;
        this.intervalTab = null;

        //before MWC show.... untile 2019.02.30
        this.clusters = ['tdg-barcelona-niantic', 'tdg-barcelona-mobiledgex-demoapp'];
        this.tcpudpCloumns = ['tcpConns', 'tcpRetrans', 'udpRecv', 'udpRecvErr', 'udpSend'];
        this.applications = [
            {cloudlet:'barcelona-mexdemo',
                clusters:[
                    {cluster:'tdg-barcelona-niantic', apps:['neon2-deployment-6885d6b975-hpxdb'], shortApps:['neon2']},
                    {cluster:'tdg-barcelona-mobiledgex-demoapp',
                        apps:['mobiledgexsdkdemo-deployment-54bfd95f5f-ncs8q', 'facedetectiondemo-deployment-79547dc46b-b2v5n'],
                        shortApps:['mobiledgexsdkdemo', 'facedetectiondemo']
                    }
                ]
            },
            {cloudlet:'sk-mwc',
                clusters:[
                    {cluster:'skt-barcelona-1000realities', apps:['thousandrealitiesapp','facedetectiondemo','mobiledgexsdkdemo']}
                ]
            }
        ]

    }

    onHandleClick = function(e, data) {
        this.props.handleChangeSite(data.children.props.to)
    }
    handleTabChange (activeIndex) {
        if(activeIndex === 'tcp'){
            this.setState({tcpPositive:true})
            this.setState({udpPositive:false})
        } else {
            this.setState({tcpPositive:false})
            this.setState({udpPositive:true})
        }
        this.setState({ activeIndex:activeIndex })
        this.forceUpdate();
    }
    makeHeader_noChild =(title)=> (
        <Header className='panel_title'>{title}</Header>
    )
    makeHeader_date =(title)=> (
        <Header className='panel_title'>
            <div style={{display:'flex', flexGrow:8}}>{title}</div>
            {/* <SelectFromTo></SelectFromTo> */}
        </Header>
    )
    makeHeader_select =(title)=> (
        <Header className='panel_title'>
            <div style={{display:'flex', flexGrow:14}}>{title}</div>
            <div style={{display:'flex', flexGrow:2, alignSelf:'flex-end'}} className='panel_title_filter'>
                {/*<Dropdown placeholder='CPU Usage' fluid search selection options={this.state.optionOne} />*/}
            </div>
        </Header>
    )
    makeHeader_switch =(title, index)=> (
        <Header className='panel_title' style={{display:'flex',flexDirection:'row'}}>
            <div style={{display:'flex', flexGrow:1}}>{title}</div>
            <div style={{display:'flex'}} className='panel_title_filter'>
                <Button.Group className='tcpudpSwich'>
                    <Button positive={index === 0 ? true : false} onClick={(e,{value})=>this.handleTabChange('tcp')}>TCP</Button>
                    <Button positive={index === 1 ? true : false}  onClick={(e,{value})=>this.handleTabChange('udp')}>UDP</Button>
                </Button.Group>
            </div>
        </Header>
    )

    generateDOM() {

        return layout.map((item, i) => (
            <div className="round_panel" key={i}>
                {
                    (i === 1)? this.makeHeader_date(item.title) :
                    (i === 2)? this.makeHeader_switch(item.title, 0) :
                    (i === 3)? this.makeHeader_switch(item.title, 1) : this.makeHeader_noChild(item.title)
                }
                {
                    (i === 0)? <CPUMEMListView listData={this.state.listData} cloudlets={this.cloudlets} clusters={this.clusters} applications={this.applications}></CPUMEMListView>
                    : (i === 1)? <ApplicationView cloudlets={this.cloudlets} clusters={this.clusters} applications={this.applications} selectedCloudlet={this.state.selectedCloudlet}/>
                    : (i === 2)? <NetworkTcpUdpComposeView applications={this.applications} selectedCloudlet={this.state.selectedCloudlet}  activeIndex={this.state.activeIndex} netName={'TCP'}/>
                    : (i === 3)? <NetworkTcpUdpComposeView applications={this.applications} selectedCloudlet={this.state.selectedCloudlet}  activeIndex={this.state.activeIndex} netName={'UDP'}/>
                    : (i === 4)? <NetworkTcpUdpView listData={this.state.tcpudpClusterData} activeIndex={this.state.activeIndex}></NetworkTcpUdpView>
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

    }
    receiveClusterInfo(result) {
        _self.setState({listData:result})


    }

    receiveTcpUdp(result) {
        console.log('receceive tcp-upd info <<<<<<<<====', result)
        _self.props.handleInjectData({tcpudpClusterData:result})
    }

    receiveTcpUdpCluster(result) {


        let clsdbArray = [];
        if(result.length){
            result.map((res, i) => {
                let valueKeys = {clusterName:'',tcp:{tcpConns:'', tcpRetrans:''}, udp:{udpRecv:'', udpRecvErr:'', udpSend:''}};
                res[0].series.map((ser) => {
                    valueKeys.clusterName = ser.values[0][1];
                    valueKeys.tcp.tcpConns = ser.values[0][7];
                    valueKeys.tcp.tcpRetrans = ser.values[0][8];
                    valueKeys.udp.udpRecv = ser.values[0][9];
                    valueKeys.udp.udpSend = ser.values[0][11];
                })
                clsdbArray.push(valueKeys)
            })
        }


        _self.setState({tcpudpClusterData:clsdbArray})

    }
    componentDidMount() {
        _self.interval = setInterval(() => {
            serviceCluster.getClusterHealth(_self.clusters, _self.receiveClusterInfo)
        }, 3000)


        // TCP UDP 정보를 표현하기
        serviceCluster.getTcpUdpSeriesInfo(this.clusters[0], [this.tcpudpCloumns[0],this.tcpudpCloumns[2]],this.receiveTcpUdp)
        // 클러스터에 해당하는 tcp udp 정보
        serviceCluster.getTcpUdpClusterInfo(this.clusters,this.receiveTcpUdpCluster)

        // _self.intervalTab = setInterval((e) => {
        //     _self.handleTabChange(e, (_self.state.activeIndex === 0)? {activeIndex:1} : {activeIndex:0})
        // }, 6000)
    }
    componentWillUnmount() {
        clearInterval(_self.interval)
        clearInterval(_self.intervalTab)
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
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};

export default connect(null, mapDispatchProps)(AnalysticViewZone);


