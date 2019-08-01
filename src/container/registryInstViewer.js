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
import SiteFourCreateFormAppInstDefault from "./siteFourCreateFormAppInstDefault";
import Alert from "react-s-alert";
import {withRouter} from "react-router-dom";
const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0","minW":5,"minH":5,"moved":false,"static":false, "title":"Developer"}
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
    { menuItem: 'App Instance Deployment', render: (props) => <Tab.Pane attached={false}><SiteFourCreateFormAppInstDefault data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} autoClusterDisable={props.autoClusterDisable} onSubmit={() => console.log('submit form')}/></Tab.Pane> },
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
            versions:[],
            toggleSubmit:false,
            validateError:[],
            regSuccess:true,
            autoClusterDisable:false,
            keysData:[
                {
                    'Region':{label:'Region', type:'RenderSelect', necessary:true, tip:'Allows developer to upload app info to different controllers', active:true, items:['US', 'EU']},
                    'DeveloperName':{label:'Organization Name', type:(Object.keys(this.props.appLaunch).length == 0)?'RenderSelect':'', necessary:true, tip:'Organization or Company Name that a Developer is part of', active:true, items:[null]},
                    'AppName':{label:'App Name', type:(Object.keys(this.props.appLaunch).length == 0)?'RenderSelect':'', necessary:true, tip:'App name', active:true, items:[null]},
                    'Version':{label:'App Version', type:(Object.keys(this.props.appLaunch).length == 0)?'RenderSelect':'', necessary:true, tip:'App version', active:true, items:[null]},
                    'Operator':{label:'Operator', type:'RenderSelect', necessary:true, tip:'Company or Organization name of the operator', active:true, items:[null]},
                    'Cloudlet':{label:'Cloudlet', type:'RenderDropDown', necessary:true, tip:'Name of the cloudlet', active:true, items:[null]},
                    'AutoClusterInst':{label:'Auto Cluster Instance', type:'RenderCheckbox', necessary:false, tip:'When checked, this will inherit settings from application settings'},
                    'ClusterInst':{label:'Cluster Instance', type:'RenderClusterDisabled', necessary:true,
                        tip:'When selecting cluster inst, default flavor and ip access specified in app setting gets overridden',
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
                    'AutoClusterInst':false,
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

        services.getMCService('ShowApps',{token:token,region:'US'}, this.receiveResultApp)
        //setTimeout(() => services.getMCService('ShowCloudlet',{token:token,region:'US'}, this.receiveResultCloudlet), 200);
        setTimeout(() => services.getMCService('ShowClusterInst',{token:token,region:'US'}, this.receiveResultClusterInst), 200);
        
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
            this.props.handleAlertInfo('error',String(result.error))
        } else {
            let appGroup = reducer.groupBy(result, 'OrganizationName')
            console.log('submit receiveResultApp 2...', appGroup)
            let keys = Object.keys(appGroup);
            let assObj = Object.assign([], this.state.keysData);
            console.log("assObjassObjassObj",assObj)
            assObj[0].DeveloperName.items = keys;
            this.setState({keysData:assObj, apps:appGroup})
        }
    }
    receiveResultClusterInst = (result) => {
        if(result.error) {
            this.props.handleAlertInfo('error',String(result.error))
        } else {
            let clinstGroup = reducer.groupBy(result, 'ClusterName')
            let cloudletGroup = reducer.groupBy(result, 'Cloudlet')
            let operatorGroup = reducer.groupBy(result, 'Operator')
            console.log('submit receiveResultCloudlet 1...', operatorGroup)
            let keys = Object.keys(operatorGroup);
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Operator.items = keys;
            this.setState({keysData:assObj, operators:operatorGroup, clustinst:clinstGroup, cloudlets:cloudletGroup})
        }

        // set list of operators
        if(this.props.devData.length > 0) {
            this.setState({dummyData:this.props.devData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        }
    }

    receiveResult = (result, body) => {
        console.log('result creat appInst ...', result.data.error, body)
        _self.props.handleLoadingSpinner(false);
        if(result.data.error) {
            this.setState({regSuccess:false});
            this.props.handleAlertInfo('error',result.data.error)
            return;
        } else {
            this.props.handleAlertInfo('success','Your application instance created successfully')
            setTimeout(() => {
                this.gotoUrl();
            }, 1000)
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
        console.log("eessajajaj@@",_self.props)
        let pg = 'pg=6'
        if(_self.props.location.goBack) {
            pg = 'pg=5'
            localStorage.setItem('selectMenu', 'Apps')
        }
        _self.props.history.push({
            pathname: '/site4',
            search: pg
        });
        _self.props.history.location.search = pg;
        _self.props.handleChangeSite({mainPath:'/site4', subPath: pg})
    }

    generateDOM(open, dimmer, width, height, data, keysData, hideHeader) {

        let panelParams = {data:data, keys:keysData, userrole:localStorage.selectRole}

        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} style={{ width:width, minWidth:670, height:height, display:'flex', flexDirection:'column'}} >
                    <div className="grid_table" style={{width:'100%', height:height, overflowY:'auto'}}>

                        <Tab menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }} panes={panes}{...panelParams} gotoUrl={this.gotoUrl} toggleSubmit={this.state.toggleSubmit} error={this.state.validateError} autoClusterDisable={this.state.autoClusterDisable} />

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


    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(store.userToken) this.getDataDeveloper(store.userToken);
        console.log('nextProps inst...nextProps.appLaunch=',this.props.appLaunch);
        /************
         * set Organization Name
         * **********/
        let assObj = Object.assign([], this.state.fakeData);
        //assObj[0].DeveloperName = localStorage.selectOrg;
        if(Object.keys(this.props.appLaunch).length > 0) {
            assObj[0].AppName = this.props.appLaunch.AppName;
            assObj[0].Version = this.props.appLaunch.Version;
            assObj[0].DeveloperName = this.props.appLaunch.OrganizationName;
        }
        this.setState({fakeData:assObj})

    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log("enenennen",nextProps)
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.devData.length > 1) {
            this.setState({dummyData:nextProps.devData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        }

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({toggleSubmit:false});
        console.log("submitSucceededsubmitSucceeded2",nextProps.formAppInst.values)
        if(nextProps.submitValues && !this.state.toggleSubmit) {
            
            const apps = ['Region','DeveloperName','AppName','Version','Operator','Cloudlet','ClusterInst']
            if(nextProps.formAppInst.values.AutoClusterInst || this.state.autoClusterDisable) {
                apps.pop();
            }
            console.log("validateValuevalidateValue",nextProps.validateValue,":::",nextProps.formAppInst.submitSucceeded)
            let error = [];
            apps.map((item) => {
                if(!nextProps.validateValue[item]) {
                    error.push(item)
                }
            })

            if(nextProps.formAppInst.submitSucceeded && error.length == 0){
                console.log("clusterTest33333",this.state.cloudlets)
                let submitData = nextProps.submitValues
                this.setState({toggleSubmit:true,validateError:error,regSuccess:true});
                this.props.handleLoadingSpinner(true);
                console.log("autoClusterDisable!!!",this.state.autoClusterDisable,":::",submitData.appinst.key.cluster_inst_key.cluster_key.name)
                // if(this.state.autoClusterDisable){
                //     submitData.appinst.key.cluster_inst_key.cluster_key.name = 'somecluster';
                // }
                services.createNewMultiAppInst('CreateAppInst', {params:submitData, token:store.userToken}, _self.receiveResult, nextProps.validateValue, this.state.cloudlets, this.state.autoClusterDisable)
                setTimeout(() => {
                    if(this.state.regSuccess) {
                        this.props.handleLoadingSpinner(false);
                        this.gotoUrl();
                    }
                }, 1000)
            } else {
                this.setState({validateError:error,toggleSubmit:true})
            }
            
        }

        // if(nextProps.history.location.appdata) {
        //     console.log("appdata@@",nextProps.history.location.appdata)
        // }

        /************
         * set list of cloudlet
         * **********/
        if(nextProps.selectedOperator) {
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Cloudlet.items = this.state.operators[nextProps.selectedOperator].map((cld) => (cld.Cloudlet));
            assObj[0].Cloudlet.items = reducer.removeDuplicate(assObj[0].Cloudlet.items)
            this.setState({keysData:assObj})

        }
        /************
         * set list of Organization
         * **********/
        if(nextProps.selectedOrgName) {
            if(Object.keys(this.props.appLaunch).length == 0) {
                let assObj = Object.assign([], this.state.keysData);
                assObj[0].AppName.items = this.state.apps[nextProps.selectedOrgName].map((cld) => (cld.AppName));
                this.setState({keysData:assObj})
                let appGroup = reducer.groupBy(this.state.apps[nextProps.selectedOrgName], 'AppName');
                this.setState({versions:appGroup})
            }
        }
        /************
         * set list of version
         * **********/
        if(nextProps.selectedApp) {
            if(Object.keys(this.props.appLaunch).length == 0) {
                let assObj = Object.assign([], this.state.keysData);
                assObj[0].Version.items = this.state.versions[nextProps.selectedApp].map((cld) => (cld.Version));
                this.setState({keysData:assObj})
                console.log("keysDatakeysDatakeysData",assObj,":::",this.state.versions)
            }
        }

        if(nextProps.selectedVersion) {
            if(this.state.versions.length !== 0 && this.state.versions[nextProps.selectedApp][0].DeploymentType === 'vm'){
                this.setState({autoClusterDisable:true})
            } else if(this.state.versions.length !== 0){
                this.setState({autoClusterDisable:false})
            }

            if(Object.keys(nextProps.appLaunch).length !== 0) {
                if(nextProps.appLaunch.DeploymentType === 'vm'){
                    this.setState({autoClusterDisable:true})
                } else {
                    this.setState({autoClusterDisable:false})
                }
            }
        }

        //set list of clusterInst filter
        if(Object.keys(nextProps.submitData).length > 0){
            if(nextProps.submitData.createAppFormDefault.values.Operator && nextProps.submitData.createAppFormDefault.values.Cloudlet) {
                let keys = Object.keys(this.state.clustinst);
                let arr = []
                let assObj = Object.assign([], this.state.keysData);
                keys.map((item,i) => {
                    this.state.clustinst[item].map((items,j) => {
                        nextProps.submitData.createAppFormDefault.values.Cloudlet.map((cItem) => {
                            if(cItem == items.Cloudlet && nextProps.submitData.createAppFormDefault.values.DeveloperName == items.OrganizationName) {
                                arr.push(item);
                            }
                        })
                    })
                })
                arr = reducer.removeDuplicate(arr)
                assObj[0].ClusterInst.items = arr;
                this.setState({keysData:assObj})
            }
        }
    }

    componentWillUnmount() {
        console.log("unmount@@")
        this.props.handleAppLaunch({})
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
                    "cluster_key":{"name":data['ClusterInst']},
                    "cloudlet_key":{"operator_key":{"name":data['Operator']},"name":data['Cloudlet']}
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
    let selectedVersion = null;
    let validateValue = null;
    let selectedOrgName = null;
    // alert(JSON.stringify(state.form.createAppFormDefault))

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
        if(state.form.createAppFormDefault.values.Version !== "") {
            selectedVersion = state.form.createAppFormDefault.values.Version;
        }
        if(state.form.createAppFormDefault.values.DeveloperName !== "") {
            selectedOrgName = state.form.createAppFormDefault.values.DeveloperName;
        }


        if(state.form.createAppFormDefault.values && state.form.createAppFormDefault.submitSucceeded) {
            let enableValue = reducer.filterDeleteKey(state.form.createAppFormDefault.values, 'Edit')
            console.log("state.form.createAppFormDefault.valuessssss",enableValue)
            // if(state.form.createAppFormDefault.values.AutoClusterInst){
            //     enableValue.ClusterInst = 'autocluster'+state.form.createAppFormDefault.values.AppName.replace(/(\s*)/g, "");
            // }
            submitVal = createFormat(enableValue);
            validateValue = state.form.createAppFormDefault.values;
        }
    }


    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
        
    let formAppInst= state.form.createAppFormDefault
        ? {
            values: state.form.createAppFormDefault.values,
            submitSucceeded: state.form.createAppFormDefault.submitSucceeded
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
        selectedVersion : selectedVersion,
        selectedCloudlet: selectedCloudlet,
        selectedOperator: selectedOperator,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        submitData : state.form?state.form : null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        appLaunch : state.appLaunch?state.appLaunch.data:null,
        validateValue:validateValue,
        formAppInst : formAppInst,
        selectedOrgName : selectedOrgName
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAppLaunch: (data) => { dispatch(actions.appLaunch(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistryInstViewer));


