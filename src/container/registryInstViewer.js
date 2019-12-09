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
    { menuItem: 'App Instance Deployment', render: (props) => <Tab.Pane style={{overflow:'auto'}} attached={false}><SiteFourCreateFormAppInstDefault data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} autoClusterDisable={props.autoClusterDisable} onSubmit={props.onSubmit}/></Tab.Pane> },
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
            operators:{},
            clustinst:[],
            apps:{},
            versions:{},
            toggleSubmit:false,
            validateError:[],
            regSuccess:true,
            autoClusterDisable:false,
            keysData:[
                {
                    'Region':{label:'Region', type:'RenderSelect', necessary:true, tip:'Select region where you want to deploy.', disable:(Object.keys(this.props.appLaunch).length == 0)?true:false, active:true, items:[]},
                    'DeveloperName':{label:'Organization Name', type:(Object.keys(this.props.appLaunch).length == 0)?'RenderSelect':'', disable:(Object.keys(this.props.appLaunch).length == 0)?true:false, necessary:true, tip:'The name of the organization you are currently managing.', active:true, items:[null]},
                    'AppName':{label:'App Name', type:(Object.keys(this.props.appLaunch).length == 0)?'RenderSelect':'', disable:(Object.keys(this.props.appLaunch).length == 0)?true:false, necessary:true, tip:'The name of the application to deploy.', active:true, items:[null]},
                    'Version':{label:'App Version', type:(Object.keys(this.props.appLaunch).length == 0)?'RenderSelect':'', disable:(Object.keys(this.props.appLaunch).length == 0)?true:false, necessary:true, tip:'The version of the application to deploy.', active:true, items:[null]},
                    'Operator':{label:'Operator', type:'RenderSelect', necessary:true, tip:'Which operator do you want to deploy this applicaton? Please select one.', active:true, items:[null]},
                    'Cloudlet':{label:'Cloudlet', type:'RenderDropDown', necessary:true, tip:'Which cloudlet(s) do you want to deploy this application?', active:true, items:[null]},
                    'AutoClusterInst':{label:'Auto Cluster Instance', type:'RenderCheckbox', necessary:false, tip:'If you have yet to create a cluster, you can select this to auto create cluster instance.'},
                    'ClusterInst':{label:'Cluster Instance', type:'RenderClusterDisabled', necessary:true,
                        tip:'Name of cluster instance to deploy this application.',
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
            ],
            editMode:false

        };

    }

    onHandleClick(dim, data) {
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClicAdd(dim, data) {
        this.setState({ dimmer:dim, openAdd: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    getDataDeveloper(token,_region) {
        services.getMCService('ShowApps',{token:token,region:_region}, this.receiveResultApp)
        setTimeout(() => services.getMCService('ShowCloudlet',{token:token,region:_region}, this.receiveResultCloudlet), 200);
        setTimeout(() => services.getMCService('ShowClusterInst',{token:token,region:_region}, this.receiveResultClusterInst), 400);
        
    }
    receiveResultCloudlet = (result) => {
        if(result.error){

        } else {
            let operatorGroup = reducer.groupBy(result, 'Operator')
            //let cloudletGroup = reducer.groupBy(result, 'CloudletName')
            let keys = Object.keys(operatorGroup);
            let assObj = Object.assign([], this.state.keysData);
            if(result[0].Operator){
                assObj[0].Operator.items = keys;
            } else{
                assObj[0].Operator.items = [];
            }
            this.setState({keysData:assObj, operators:operatorGroup})
            
        }
        // set list of operators
        if(this.props.devData.length > 0) {
            this.setState({dummyData:this.props.devData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        }
        this.props.handleLoadingSpinner(false);

    }
    receiveResultApp = (result) => {
        if(result.error) {
            this.props.handleAlertInfo('error',String(result.error))
        } else {
            let appGroup = reducer.groupBy(result, 'OrganizationName')
            let keys = Object.keys(appGroup);
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].DeveloperName.items = keys;
            this.setState({keysData:assObj, apps:appGroup})
            this.props.handleLoadingSpinner(false);
        }
    }
    receiveResultClusterInst = (result) => {
        if(result.error) {
            this.props.handleAlertInfo('error',String(result.error))
        } else {
            console.log('20191119 cluster result..', result)
            let clinstGroup = reducer.groupBy(result, 'ClusterName')
            let cloudletGroup = reducer.groupBy(result, 'Cloudlet')
            //let operatorGroup = reducer.groupBy(result, 'Operator')
            //let keys = Object.keys(operatorGroup);
            //let assObj = Object.assign([], this.state.keysData);
            //assObj[0].Operator.items = keys;
            this.setState({ clustinst:clinstGroup, cloudlets:cloudletGroup})
        }

        // set list of operators
        if(this.props.devData.length > 0) {
            this.setState({dummyData:this.props.devData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        }
    }

    receiveResult = (result, body) => {
        console.log("20191119 getState resultresultxxresult",result)
        /* code by inki : block this for not use tempfile.
        setTimeout(() => {
            services.errorTempFile(result.data, this.receiveStatusData)
        }, 3000);
        */

        //TODO: inki 20191129 : request call streamTemp data from server..
        

        _self.props.handleLoadingSpinner(false);
        if(result.data.error) {
            this.setState({regSuccess:false});
            this.props.handleAlertInfo('error',result.data.error)
            return;
        } else {
            


            // let toArray = result.data.split('\n')
            // toArray.pop();
            // let toJson = toArray.map((str)=>(JSON.parse(str)))
            //
            // toJson.map((item) => {
            //     if(item.result && item.result.code == 400){
            //         this.props.handleAlertInfo('error',item.result.message)
            //         return
            //     } else {
            //         this.props.handleAlertInfo('success','Your application instance created successfully')
            //     }
            // })

            if(result.data.message && parseInt(result.data.code) == 400) {
                this.props.handleAlertInfo('error',result.data.message)
                setTimeout(() => {
                    this.gotoUrl('submit', 'error');
                }, 3000)
                return;
            } else {
                setTimeout(() => {
                    this.gotoUrl('submit');
                }, 3000)
            }

            if(result && result.code == 400){
                this.props.handleAlertInfo('error',result.message)
                return
            } else {
                //this.props.handleAlertInfo('success','Your application instance created successfully')
            }

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

    gotoUrl(msg, state) {
        let pg = 'pg=6'
        let pgname = '';
        if(_self.props.location.goBack && msg !== 'submit') {
            pg = 'pg=5'
            localStorage.setItem('selectMenu', 'Apps')
        } else {
            localStorage.setItem('selectMenu', 'App Instances')
        }
        _self.props.history.push({
            pathname: '/site4',
            search: pg,
        });
        _self.props.history.location.search = pg;
        console.log('20191119 getState pgnameData --- ', _self.props.submitData, ":  submitValues=", _self.props.submitValues)
        if(state !== 'error' && _self.props.submitData.createAppFormDefault.values && _self.props.submitData.createAppFormDefault.values.AutoClusterInst){
            _self.props.history.location.pgname = 'appinst';
            _self.props.history.location.pgnameData = {
                AppName:_self.props.submitData.createAppFormDefault.values.AppName,
                Operator:_self.props.submitData.createAppFormDefault.values.Operator,
                Cloudlet:_self.props.submitData.createAppFormDefault.values.Cloudlet[0],
                ClusterInst:'autocluster'+_self.props.submitData.createAppFormDefault.values.AppName.replace(/(\s*)/g, ""),
                State:3
            }
        }
        _self.props.handleChangeSite({mainPath:'/site4', subPath: pg})
    }

    generateDOM(open, dimmer, data, keysData, hideHeader) {

        let panelParams = {data:data, keys:keysData, userrole:localStorage.selectRole, editMode:this.state.editMode, editData:this.props.editData}

        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i}>
                    <div className="grid_table">

                        <Tab className="grid_tabs" menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }} panes={panes}{...panelParams} gotoUrl={this.gotoUrl} toggleSubmit={this.state.toggleSubmit} error={this.state.validateError} autoClusterDisable={this.state.autoClusterDisable} onSubmit={this.onSubmit} />

                    </div>
                </div>
                :
                <div className="round_panel" key={i}>
                    
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

    onSubmit() {
        _self.props.handleSubmitInfo('submitAction')
    }


    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        //if(store && store.userToken) this.getDataDeveloper(store.userToken,'US');
        /************
         * set Organization Name
         * **********/
        let assObj = Object.assign([], this.state.fakeData);
        assObj[0].DeveloperName = localStorage.selectOrg;
        if(Object.keys(this.props.appLaunch).length > 0) {
            assObj[0].Region = this.props.appLaunch.Region;
            assObj[0].AppName = this.props.appLaunch.AppName;
            assObj[0].Version = this.props.appLaunch.Version;
            assObj[0].DeveloperName = this.props.appLaunch.OrganizationName;
        }
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
        if(nextProps.regionInfo.region.length){
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Region.items = nextProps.regionInfo.region;
        }
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({toggleSubmit:false});
        if(nextProps.submitValues && !this.state.toggleSubmit) {
            
            const apps = ['Region','DeveloperName','AppName','Version','Operator','Cloudlet','ClusterInst']
            if(nextProps.formAppInst.values.AutoClusterInst || this.state.autoClusterDisable) {
                apps.pop();
            }
            let error = [];
            apps.map((item) => {
                if(!nextProps.validateValue[item]) {
                    error.push(item)
                }
            })

            if(nextProps.formAppInst.submitSucceeded && error.length == 0){

                let submitData = nextProps.submitValues
                console.log('20191119 filtered cloudlet...', submitData, " state.cloudelts=", this.state.cloudlets)
                /*

                 */
                this.props.handleSubmitObject(submitData)
                this.setState({toggleSubmit:true,validateError:error,regSuccess:true});
                this.props.handleLoadingSpinner(true);

                services.createNewMultiAppInst('CreateAppInst', {params:submitData, token:store ? store.userToken : 'null'}, _self.receiveResult, nextProps.validateValue, this.state.cloudlets, this.state.autoClusterDisable)

            } else {
                this.setState({validateError:error,toggleSubmit:true})
            }
            
        }

        /************
         * set list of Region
         * **********/
        if(nextProps.selectedRegion && nextProps.selectedRegion !== this.props.selectedRegion){
            console.log("nextProps.selectedRegionnextProps.selectedRegion",nextProps.selectedRegion,":::",this.props.selectedRegion)
            this.getDataDeveloper(store ? store.userToken : 'null',nextProps.formAppInst.values.Region);
        }

        /************
         * set list of cloudlet
         * **********/
        if(nextProps.selectedOperator && this.state.operators[nextProps.selectedOperator]) {
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Cloudlet.items = [];
            assObj[0].ClusterInst.items = [];
            assObj[0].Cloudlet.items = this.state.operators[nextProps.selectedOperator].map((cld) => (cld.CloudletName));
            assObj[0].Cloudlet.items = reducer.removeDuplicate(assObj[0].Cloudlet.items)
            this.setState({keysData:assObj})
        }
        /************
         * set list of Organization
         * **********/
        if(nextProps.selectedOrgName && this.state.apps[nextProps.selectedOrgName]) {
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
        if(nextProps.selectedApp && this.state.versions[nextProps.selectedApp]) {
            if(Object.keys(this.props.appLaunch).length == 0) {
                let assObj = Object.assign([], this.state.keysData);
                assObj[0].Version.items = this.state.versions[nextProps.selectedApp].map((cld) => (cld.Version));
                this.setState({keysData:assObj})
            }
        }
        if(nextProps.selectedVersion  && this.state.versions[nextProps.selectedApp]) {
            if(Object.keys(this.state.versions).length !== 0 && this.state.versions[nextProps.selectedApp][0].DeploymentType === 'vm'){
                this.setState({autoClusterDisable:true})
            } else if(Object.keys(this.state.versions).length !== 0){
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
            if(nextProps.submitData.createAppFormDefault && nextProps.submitData.createAppFormDefault.values.Operator && nextProps.submitData.createAppFormDefault.values.Cloudlet) {
                let keys = Object.keys(this.state.clustinst);
                let arr = []
                let assObj = Object.assign([], this.state.keysData);
                console.log("20191119 dfdfdfdgsgsdg",nextProps.submitData.createAppFormDefault.values.Cloudlet)
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

        if(nextProps.editMode) this.setState({editMode:nextProps.editMode})
    }

    componentWillUnmount() {
        this.props.handleAppLaunch({})
    }

    receiveStatusData = (result) => {
        console.log("20191119 resultresultss",result)
        let toArray = null;
        let toJson = null;
        toArray = result.data.split('\n')
        toArray.pop();
        toJson = toArray.map((str)=>(JSON.parse(str)))
        console.log("toJsontoJson",toJson)
        this.props.handleLoadingSpinner(false);
        toJson.map((item) => {
            if(item.result && item.result.code == 400){
                console.log("item.result",item.result.message)
                this.setState({regSuccess:false});
                this.props.handleAlertInfo('error',item.result.message)
            }
        })
        if(this.state.regSuccess) {
            this.gotoUrl('submit');
        }
    }

    render() {
        const { open, dimmer, dummyData, editMode } = this.state;
        const { hiddenKeys } = this.props;
        return (
            <div className="regis_container">
                {/*<RegistNewListItem data={this.state.dummyData} resultData={this.state.resultData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close}/>*/}
                <div
                    draggableHandle
                    layout={this.state.layout}
                    onLayoutChange={this.onLayoutChange}
                    {...this.props}
                    useCSSTransforms={false}
                >
                    {this.generateDOM(open, dimmer, dummyData, this.state.keysData, hiddenKeys)}
                </div>
                <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail}></PopDetailViewer>
                <PopUserViewer data={this.state.detailViewData} dimmer={false} open={this.state.openUser} close={this.closeUser}></PopUserViewer>
                <PopAddUserViewer data={this.state.selected} dimmer={false} open={this.state.openAdd} close={this.closeAddUser}></PopAddUserViewer>
            </div>

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
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let submitVal = null;
    let selectedCloudlet = null;
    let selectedOperator = null;
    let selectedApp = null;
    let selectedVersion = null;
    let validateValue = null;
    let selectedOrgName = null;
    let selectedRegion = null;
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
        if(state.form.createAppFormDefault.values.Region !== "") {
            selectedRegion = state.form.createAppFormDefault.values.Region;
        }

        if(state.form.createAppFormDefault.values && state.form.createAppFormDefault.submitSucceeded) {
            let enableValue = reducer.filterDeleteKey(state.form.createAppFormDefault.values, 'Edit')
            console.log('20191119 createformat ...', enableValue)
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
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
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
        selectedOrgName : selectedOrgName,
        selectedRegion : selectedRegion,
        editData : state.editInstance.data,
        regionInfo: regionInfo
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
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
        handleSubmitInfo: (data) => {dispatch(actions.submitInfo(data))},
        handleSubmitObject: (data) => {dispatch(actions.submitObj(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistryInstViewer));


