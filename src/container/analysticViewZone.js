import React from 'react';
import { Dropdown, Button, Header, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import sizeMe from 'react-sizeme';
import ResizeSensor from './ResizeSensor';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import CPUMEMListView from './usage/cpumemoryListView';
import ApplicationView from '../components/applicationView';
import DailyReportView from '../components/dailyReportView';
import NetworkTcpUdpView from '../components/networkTcpUdpView';
import NetworkTcpUdpComposeView from '../components/networkTcpUdpComposeView';
import SelectFromTo from '../components/selectFromTo';

import * as serviceCluster from '../services/service_instance_service';
import * as serviceCompute from '../services/service_compute_service';

import './styles.css';

const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 13;
var layout = [
    {"w":6,"h":13,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"Cluster Health"},
    {"w":6,"h":13,"x":6,"y":0,"i":"1","moved":false,"static":false, "title":"Application Statistics"},
    {"w":6,"h":8,"x":0,"y":13,"i":"2","moved":false,"static":false, "title":"Network I/O Trend"},
    {"w":6,"h":8,"x":6,"y":13,"i":"3","moved":false,"static":false, "title":"Network I/O Trend"}];
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
                {alarm:'3', dName:'Cluster-A', values:{cpu:35, mem:55, sys:33, net:[10,15], time:'2019-07-19 12:00:00'}},
                {alarm:'5', dName:'Cluster-B', values:{cpu:78, mem:78, sys:12, net:[7,12], time:'2019-07-19 12:00:00'}},
                {alarm:'1', dName:'Cluster-C', values:{cpu:32, mem:33, sys:67, net:[3,18], time:'2019-07-19 12:00:00'}},
                {alarm:'2', dName:'Cluster-D', values:{cpu:23, mem:46, sys:41, net:[11,14], time:'2019-07-19 12:00:00'}},
                {alarm:'4', dName:'Cluster-E', values:{cpu:55, mem:67, sys:23, net:[7,11], time:'2019-07-19 12:00:00'}}
            ],
            networkData:[],
            tcpudpClusterData:[],
            tcpudpData:null,
            activeIndex:'tcp',
            tcpPositive:true,
            udpPositive:false,
            listCluster:null,
            selectedCloudlet:'barcelona-mexdemo',
            applications:null
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
        this.clusters = [];
        this.tcpudpCloumns = ['tcpConns', 'tcpRetrans', 'udpRecv', 'udpRecvErr', 'udpSend'];
        this.applications = [
            {cloudlet:'barcelona-mexdemo',
                clusters:[
                    {cluster:'tdg-barcelona-niantic', apps:[''], shortApps:['neon2']},
                    {cluster:'tdg-barcelona-mobiledgex-demoapp',
                        apps:[],
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
            <div style={{display:'flex', flexGrow:8}}>{title}</div>
            <div style={{display:'flex', flexGrow:2, alignSelf:'flex-end'}} className='panel_title_filter'>
                {/*<Dropdown placeholder='CPU Usage' fluid search selection options={this.state.optionOne} />*/}
            </div>
        </Header>
    )
    makeHeader_switch =(title, index)=> (
        <Header className='panel_title'>
            <div style={{display:'flex', flexGrow:1}}>{title}</div>
            <div style={{display:'flex'}} className='panel_title_filter'>
                <Button.Group className='tcpudpSwich'>
                    <Button positive={index === 0 ? true : false} onClick={(e,{value})=>this.handleTabChange('tcp')}>TCP</Button>
                    <Button positive={index === 1 ? true : false}  onClick={(e,{value})=>this.handleTabChange('udp')}>UDP</Button>
                </Button.Group>
            </div>
        </Header>
    )
    onResize = () => {
        // if neither width nor height is provided via props
        if (!this.props.width) {
            this.setState({
                width: this.mount.clientWidth,
                //width: 1600
            });
        }
        if (!this.props.height) {
            this.setState({
                height: this.mount.clientHeight,
                //height: 900
            });
        }

        console.log('20190719 resize event..', this.props)
    };
    generateDOM(_applications) {

        return layout.map((item, i) => (
            <div className="round_panel" key={i} >
                {
                    (i === 1)? this.makeHeader_date(item.title) :
                    (i === 2)? this.makeHeader_switch(item.title, 0) :
                    (i === 3)? this.makeHeader_switch(item.title, 1) : this.makeHeader_noChild(item.title)
                }
                {
                    (i === 0)? <CPUMEMListView listData={this.state.listData} cloudlets={this.cloudlets} clusters={this.clusters} applications={_applications}></CPUMEMListView>
                    : (i === 1)? <ApplicationView cloudlets={this.cloudlets} clusters={this.clusters} applications={_applications} selectedCloudlet={this.state.selectedCloudlet}/>
                    : (i === 2)? <NetworkTcpUdpComposeView applications={_applications} selectedCloudlet={this.state.selectedCloudlet}  activeIndex={this.state.activeIndex} netName={'TCP'}/>
                    : (i === 3)? <NetworkTcpUdpComposeView applications={_applications} selectedCloudlet={this.state.selectedCloudlet}  activeIndex={this.state.activeIndex} netName={'UDP'}/>
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
        //_self.setState({listData:result})
        console.log('20190719 result of cluster---', result)
    }


    receiveClusterApp(result) {

        let appIndex = null;
        result.map((obj) => (
            obj.map((obj2) => (
                obj2.series.map((seri) => (
                    seri.columns.map((column, i) => (
                        (column === 'app')? appIndex = i : null
                    ))

                ))
            ))
        ))
        console.log('app index = ', appIndex)
        let appNames = [];
        if(appIndex){
            result.map((obj) => (
                obj.map((obj2) => (
                    obj2.series.map((seri, i) => (
                        seri.values.map((value) => {
                            appNames.push({app:value[appIndex], cluster:value[appIndex+1]})
                        })

                    ))
                ))
            ))
            console.log('app names = ', appNames)
        }

        //appName 중에  neon2 인것 찾기
        let selectedApp = 'neon2';

        appNames.map((obj) => {
            if(obj.app.indexOf(selectedApp) > -1){
                _self.applications[0].clusters[0].apps[0] = obj.app
            }
        })
        console.log('set aplications ==', _self.applications, _self.state.applications)
        _self.setState({applications:_self.applications})

    }

    getClusterHealth (store) {
        if(_self.clusters.length) serviceCluster.getClusterHealth( _self.clusters, _self.receiveClusterInfo)
    }
    getAppClusterApp() {
        // 클러스터에 해당하는 앱의 이름
        serviceCluster.getAppClusterApp(this.clusters, _self.receiveClusterApp);
    }

    makeForm = (cluster, store) => (
        {
            "token":store,
            "params":{
                "region":"US",
                "clusterinst":{
                    "cluster_key":{"name":"mmmm"},
                    "cloudlet_key":{
                        "operator_key":{"name":"TDG"},
                        "name":"mexplat-stage-bonn-cloudlet"
                    },
                    "developer":"MobiledgeX"
                },
                "selector":"cpu",
                "starttime":"2019-07-17T22:39:58Z",
                "endtime":"2019-07-17T22:45:10Z"
            }

        }
    )
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('20190729 will receive props -- ', nextProps.clusterInstData)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(nextProps.clusterInstData && nextProps.clusterInstData.length) {
            nextProps.clusterInstData.map((cluster) => {
                this.clusters.push(this.makeForm(cluster, store.userToken));
            })
            _self.getClusterHealth(store.userToken)
        }
    }

    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        _self.interval = setInterval(() => {
            _self.getClusterHealth(store);
        }, 300000)
        let {width, height} = this.props.size;
        let rowHeight = 100; // h=3 then height = 30 * 3 = 90px
        let divideH = (height / rowHeight);

        let newHOne = Math.round(divideH*(2/3) - 1.5);
        let newHTwo = Math.round(divideH*(1/3));

        console.log('20190719 resize layout === ', width, height, newHOne, newHTwo)
        let resizeLayout = [
            {"w":6,"h":newHOne,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"Cluster Health"},
            {"w":6,"h":newHOne,"x":6,"y":0,"i":"1","moved":false,"static":false, "title":"Application Statistics"},
            {"w":6,"h":newHTwo,"x":0,"y":newHOne,"i":"2","moved":false,"static":false, "title":"Network I/O Trend"},
            {"w":6,"h":newHTwo,"x":6,"y":newHOne,"i":"3","moved":false,"static":false, "title":"Network I/O Trend"}]

        this.setState({layout:resizeLayout})

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
            <ReactGridLayout style={{backgroundColor:'green !important', height:'100%'}}
                layout={this.state.layout}
                onLayoutChange={this.onLayoutChange}
                {...this.props}
            >
                {this.generateDOM(this.state.applications)}
            </ReactGridLayout>
        );
    }
    static defaultProps = {
        className: "layout",
        items: 20,
        rowHeight: 100,
        cols: 12,
        width: 1900
    };
}


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))}
    };
};

export default connect(null, mapDispatchProps)(sizeMe({ monitorHeight: true })(AnalysticViewZone));
