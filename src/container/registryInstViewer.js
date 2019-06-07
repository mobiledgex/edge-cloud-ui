import React from 'react';
import {Header, Button, Table, Icon, Input, Tab, Item} from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";

import PopDetailViewer from './popDetailViewer';
import PopUserViewer from './popUserViewer';
import PopAddUserViewer from './popAddUserViewer';
import './styles.css';
import ContainerDimensions from 'react-container-dimensions'
import _ from "lodash";
import * as reducer from '../utils'
import MaterialIcon from "material-icons-react";
import * as services from '../services/service_compute_service';
import SiteFourCreateFormAppDefault from "./siteFourCreateFormAppDefault";
import Alert from "react-s-alert";
import {withRouter} from "react-router-dom";
const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0", "minW":19,"minH":20, "maxW":19,"maxH":20,"moved":false,"static":false, "title":"Developer"},
    // {"w":19,"h":20,"x":0,"y":0,"i":"0","minW":5,"minH":5,"moved":false,"static":false, "title":"Developer"}, //resize
]
let _self = null;
const colors = [
    'red',
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown',
    'grey',
]

const panes = [
    { menuItem: 'App Instance Deployment', render: (props) => <Tab.Pane attached={false}><SiteFourCreateFormAppDefault data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} onSubmit={() => console.log('submit form')}/></Tab.Pane> },
    // { menuItem: 'Docker deployment', render: () => <Tab.Pane  attached={false} pId={1}>None</Tab.Pane> },
    // { menuItem: 'VM deployment', render: () => <Tab.Pane attached={false} pId={2}>None</Tab.Pane> }
]
class RegistryInstViewer extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        const layout = this.generateLayout();
        this.state = {
            layout,
            open: false,
            openAdd: false,
            openDetail:false,
            dimmer:false,
            activeItem:'',
            dummyData : [],
            detailViewData:null,
            selected:{},
            openUser:false,
            orgData:{},
            selectUse:null,
            resultData:null,
            cloudlets:[],
            operators:[],
            clustinst:[],
            apps:[],
            loopCancel:true,
            keysData:[
                {
                    'Region':{label:'Region', type:'RenderSelect', necessary:true, tip:'Allows developer to upload app info to different controllers', active:true, items:['US', 'EU']},
                    'DeveloperName':{label:'Organization Name', type:'RenderInputDisabled', necessary:true, tip:null, active:true},
                    'AppName':{label:'App Name', type:'RenderSelect', necessary:true, tip:null, active:true, items:[null]},
                    'Version':{label:'App Version', type:'RenderSelect', necessary:true, tip:null, active:true, items:[null]},
                    'Operator':{label:'Operator', type:'RenderSelect', necessary:true, tip:null, active:true, items:[null]},
                    'Cloudlet':{label:'Cloudlet', type:'RenderSelect', necessary:true, tip:null, active:true, items:[null]},
                    'AutoClusterInst':{label:'Auto-ClusterInt', type:'RenderCheckbox', necessary:false, tip:'When checked, this will inherit settings from application settings'},
                    'ClusterInst':{label:'ClusterInst', type:'RenderSelect', necessary:true,
                        tip:' When selecting clusterinst, default flavor and ipaccess specified in app setting gets overridden',
                        active:true, items:[null]},
                },
                {

                }
            ],
            fakeData:[
                {
                    'Region':'US',
                    'DeveloperName':'',
                    'AppName':'',
                    'Version':'',
                    'Operator':'',
                    'Cloudlet':'',
                    'AutoClusterInst':'',
                    'ClusterInst':'',
                }
            ]


        };

    }

    onHandleClick(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClicAdd(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, openAdd: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    getDataDeveloper(token) {
        //get data cloudlet list , app list
        // let rgn = ['US','EU'];
        // if(this.props.region !== 'All'){
        //     rgn = [this.props.region]
        // } 
        // rgn.map((item) => {
        //     services.getMCService('ShowCloudlet',{token:token,region:item}, this.receiveResultCloudlet)
        //     services.getMCService('ShowApps',{token:token,region:item}, this.receiveResultApp)
        //     services.getMCService('ShowClusterInst',{token:token,region:item}, this.receiveResultClusterInst)
        // })
        services.getMCService('ShowCloudlet',{token:token,region:'US'}, this.receiveResultCloudlet)
        services.getMCService('ShowApps',{token:token,region:'US'}, this.receiveResultApp)
        services.getMCService('ShowClusterInst',{token:token,region:'US'}, this.receiveResultClusterInst)
        
    }
    receiveResultCloudlet = (result) => {
        if(result.error){

        } else {
            let operatorGroup = reducer.groupBy(result, 'Operator')
            console.log('submit receiveResultCloudlet 1...', operatorGroup)
            let keys = Object.keys(operatorGroup);
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Operator.items = keys;
            this.setState({keysData:assObj, operators:operatorGroup})
        }
        // set list of operators
        if(this.props.devData.length > 0) {
            this.setState({dummyData:this.props.devData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        }

    }
    receiveResultApp = (result) => {
        if(result.error) {
            Alert.error(String(result.error), {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
        } else {

            let appGroup = reducer.groupBy(result, 'AppName')
            console.log('submit receiveResultApp 2...', appGroup)
            let keys = Object.keys(appGroup);
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].AppName.items = keys;
            this.setState({keysData:assObj, apps:appGroup})
        }
    }
    receiveResultClusterInst = (result) => {
        if(result.error) {
            Alert.error(String(result.error), {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
        } else {

            let clinstGroup = reducer.groupBy(result, 'ClusterName')
            console.log('submit clinstGroup 2...', clinstGroup)
            let keys = Object.keys(clinstGroup);
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].ClusterInst.items = keys;
            this.setState({keysData:assObj, clustinst:clinstGroup})
        }
    }

    receiveResult = (result, body) => {
        console.log('result creat appInst ...', result.data.error, body)
        _self.props.handleLoadingSpinner(false);
        this.setState({loopCancel:true});
        if(result.data.error) {
            Alert.error(result.data.error, {
                position: 'top-right',
                effect: 'slide',
                onShow: function () {
                    console.log('error!')
                },
                beep: true,
                timeout: 5000,
                offset: 100
            });
            return;
        } else {
            //this.props.gotoApp();
            Alert.success('Your application instance created successfully', {
                position: 'top-right',
                effect: 'slide',
                onShow: function () {
                    console.log('aye!')
                },
                beep: true,
                timeout: 5000,
                offset: 100
            });
            setTimeout(() => {
                this.gotoUrl();
            }, 1000)
            //_self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=6'})
        }
    }
    
    show = (dim) => this.setState({ dimmer:dim, openDetail: true })
    close = () => {
        this.setState({ open: false })
        this.props.handleInjectDeveloper(null)
    }
    closeDetail = () => {
        this.setState({ openDetail: false })
    }
    closeUser = () => {
        this.setState({ openUser: false })
    }
    closeAddUser = () => {
        this.setState({ openAdd: false })
    }

    gotoUrl() {
        _self.props.history.push({
            pathname: '/site4',
            search: 'pg=6'
        });
        _self.props.history.location.search = 'pg=6';
        _self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=6'})
    }

    generateDOM(open, dimmer, width, height, data, keysData, hideHeader) {

        let panelParams = {data:data, keys:keysData, userrole:localStorage.selectRole}

        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} style={{ width:width, minWidth:670, height:height, display:'flex', flexDirection:'column'}} >
                    <div className="grid_table" style={{width:'100%', height:height, overflowY:'auto'}}>

                        <Tab menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }} panes={panes}{...panelParams} gotoUrl={this.gotoUrl} />

                    </div>
                </div>
                :
                <div className="round_panel" key={i} style={{ width:width, height:height, display:'flex', flexDirection:'column'}} >
                    <div style={{width:'100%', height:'100%', overflowY:'auto'}}>

                    </div>
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

    loadingBox = (params,tokens) => {
        console.log("loadingbox in#@")
        this.setState({loopCancel:false});
        _self.props.handleLoadingSpinner(true);
        // services.createNewApp('CreateApp', serviceBody, _self.receiveResult)
        services.createNewAppInst('CreateAppInst', {params:params, token:tokens}, _self.receiveResult)
    }

    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(store.userToken) this.getDataDeveloper(store.userToken);
        console.log('nextProps inst...nextProps.devData=',this.props.devData);
        /************
         * set Organization Name
         * **********/
        let assObj = Object.assign([], this.state.fakeData);
        assObj[0].DeveloperName = localStorage.selectOrg;
        this.setState({fakeData:assObj})

    }
    componentWillReceiveProps(nextProps, nextContext) {

        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.devData.length > 1) {
            this.setState({dummyData:nextProps.devData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        }

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        if(nextProps.submitValues) {
            console.log('submit on...', nextProps.submitValues)
            if(this.state.loopCancel) this.loadingBox(nextProps.submitValues,store.userToken);
            // services.createNewAppInst('CreateAppInst', {params:nextProps.submitValues, token:store.userToken}, _self.receiveResult)
        }

        /************
         * set list of cloudlet
         * **********/
        if(nextProps.selectedOperator) {
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Cloudlet.items = this.state.operators[nextProps.selectedOperator].map((cld) => (cld.CloudletName));
            this.setState({keysData:assObj})

        }
        /************
         * set list of version
         * **********/
        if(nextProps.selectedApp) {
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Version.items = this.state.apps[nextProps.selectedApp].map((cld) => (cld.Version));
            this.setState({keysData:assObj})

        }
        
        //set list of clusterInst filter
        if(nextProps.submitData.createAppFormDefault.values.Operator && nextProps.submitData.createAppFormDefault.values.Cloudlet) {
            let keys = Object.keys(this.state.clustinst);
            let arr = []
            let assObj = Object.assign([], this.state.keysData);
            keys.map((item,i) => {
                this.state.clustinst[item].map((items,j) => {
                    if(items.Operator == nextProps.submitData.createAppFormDefault.values.Operator && items.Cloudlet == nextProps.submitData.createAppFormDefault.values.Cloudlet) {
                        arr.push(item);
                    }
                })
            })
            assObj[0].ClusterInst.items = arr;
            this.setState({keysData:assObj})
        }
    }

    render() {
        const { open, dimmer, dummyData } = this.state;
        const { hiddenKeys } = this.props;
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'hidden'}}>
                        {/*<RegistNewListItem data={this.state.dummyData} resultData={this.state.resultData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close}/>*/}
                        <ReactGridLayout
                            draggableHandle
                            layout={this.state.layout}
                            onLayoutChange={this.onLayoutChange}
                            {...this.props}
                            style={{width:width, height:height-20}}
                        >
                            {this.generateDOM(open, dimmer, width, height, dummyData, this.state.keysData, hiddenKeys)}
                        </ReactGridLayout>
                        <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail}></PopDetailViewer>
                        <PopUserViewer data={this.state.detailViewData} dimmer={false} open={this.state.openUser} close={this.closeUser}></PopUserViewer>
                        <PopAddUserViewer data={this.state.selected} dimmer={false} open={this.state.openAdd} close={this.closeAddUser}></PopAddUserViewer>
                    </div>
                }
            </ContainerDimensions>

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
/*
{
    "region":"US",
    "appinst":
    {
        "key":{
            "app_key":{"developer_key":{"name":"bicinkiOrg"},"name":"myapp","version":"1.0.0"},
            "cloudlet_key":{"operator_key":{"name":"TDG"},"name":"bonn-mexdemo"}
        },
        "cluster_inst_key":{
            "cluster_key":{"name":"mexdemo-app-cluster"},
            "cloudlet_key":{"operator_key":{"name":"TDG"},"name":"bonn-mexdemo"}
        }
    }
}
 */
const createFormat = (data) => (
    {
        "region":data['Region'],
        "appinst":{
            "key":{
                "app_key":{"developer_key":{"name":data['DeveloperName']},"name":data['AppName'],"version":data['Version']},
                "cluster_inst_key":{
                    "cloudlet_key":{"name":data['Cloudlet'],"operator_key":{"name":data['Operator']}},
                    "cluster_key":{"name":data['ClusterInst']},
                    "developer":data['DeveloperName']
                }
            },
        }
    }
)
const mapStateToProps = (state) => {
    console.log("store state:::",state);
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    console.log('account -- '+account)
    
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let submitVal = null;
    let selectedCloudlet = null;
    let selectedOperator = null;
    let selectedApp = null;

    if(state.form.createAppFormDefault) {
        if(state.form.createAppFormDefault.values.Cloudlet !== "") {
            selectedCloudlet = state.form.createAppFormDefault.values.Cloudlet;
        }
        if(state.form.createAppFormDefault.values.Operator !== "") {
            selectedOperator = state.form.createAppFormDefault.values.Operator;
        }
        if(state.form.createAppFormDefault.values.AppName !== "") {
            selectedApp = state.form.createAppFormDefault.values.AppName;
        }
        // if(state.form.createAppFormDefault.values.AppName !== "") {
        //     selectedApp = state.form.createAppFormDefault.values.AppName;
        // }


        if(state.form.createAppFormDefault.values && state.form.createAppFormDefault.submitSucceeded) {
            let enableValue = reducer.filterDeleteKey(state.form.createAppFormDefault.values, 'Edit')
            submitVal = createFormat(enableValue)
        }
    }


    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};

    return {
        accountInfo,
        dimmInfo,
        itemLabel: state.computeItem.item,
        userToken : (state.user.userToken) ? state.userToken: null,
        submitValues: submitVal,
        region: region.value,
        selectedApp: selectedApp,
        selectedCloudlet: selectedCloudlet,
        selectedOperator: selectedOperator,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        submitData : state.form?state.form : null,
        userRole : state.showUserRole?state.showUserRole.role:null,
    }
    
    // return (dimm) ? {
    //     dimmInfo : dimm
    // } : (account)? {
    //     accountInfo: account + Math.random()*10000
    // } : null;
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistryInstViewer));


