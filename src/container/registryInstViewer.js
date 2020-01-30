import React from 'react';
import {Tab} from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import PopDetailViewer from './popDetailViewer';
import PopUserViewer from './popUserViewer';
import PopAddUserViewer from './popAddUserViewer';
import './styles.css';
import _ from "lodash";
import * as reducer from '../utils'
import * as serviceMC from '../services/serviceMC';
import SiteFourCreateFormAppInstDefault from "./siteFourCreateFormAppInstDefault";
import {withRouter} from "react-router-dom";
import MexMessageDialog from '../hoc/mexDialogMessage';


var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0","minW":5,"minH":5,"moved":false,"static":false, "title":"Developer"}
]
let _self = null;

const panes = [
    { menuItem: 'App Instance Deployment', render: (props) => <Tab.Pane style={{overflow:'auto'}} attached={false}><SiteFourCreateFormAppInstDefault data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} autoClusterDisable={props.autoClusterDisable} onSubmit={props.onSubmit}/></Tab.Pane> },
]
class RegistryInstViewer extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        const layout = this.generateLayout();
        this.wsRequestCount = 0;
        this.wsRequestResponse = [];
        this.state = {
            dialogMessage:[],
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
    }
    onHandleClicAdd(dim, data) {
        this.setState({ dimmer:dim, openAdd: true, selected:data })
    }
    getDataDeveloper(token,_region) {
        serviceMC.sendRequest(_self,{ token: token, method: serviceMC.getEP().SHOW_APP, data: { region: _region } }, this.receiveResultApp)
        setTimeout(() => {
            if(localStorage.selectRole && localStorage.selectRole === 'AdminManager') {
                let requestList = [];
                requestList.push({ token: token, method: serviceMC.getEP().SHOW_CLOUDLET, data: { region: _region } })
                requestList.push({ token: token, method: serviceMC.getEP().SHOW_CLOUDLET_INFO, data: { region: _region } })
                serviceMC.sendMultiRequest(_self, requestList, _self.receiveResultCloudlet)
            } else {
                serviceMC.sendRequest(_self,{ token: token, method: serviceMC.getEP().SHOW_ORG_CLOUDLET, data: { region: _region, org:_self.props.selectOrg || localStorage.selectOrg } }, _self.receiveResultCloudlet)
            }
        }, 200);
            
        setTimeout(() => serviceMC.sendRequest(_self,{ token: token, method: serviceMC.getEP().SHOW_CLUSTER_INST, data: { region: _region } }, this.receiveResultClusterInst), 400);

    }
    receiveResultCloudlet = (mcRequestList) => {
        if(mcRequestList && mcRequestList.length>0)
        {
            let cloudletList = null;
            let cloudletInfoList = null;
            mcRequestList.map(mcRequest=>{
                if(mcRequest.request.method === serviceMC.getEP().SHOW_CLOUDLET)
                {
                    cloudletList = mcRequest.response.data
                }
                else if(mcRequest.request.method === serviceMC.getEP().SHOW_CLOUDLET_INFO)
                {
                    cloudletInfoList = mcRequest.response.data
                }
            })
            
            for (let i = 0; i < cloudletList.length; i++) {
                let cloudlet = cloudletList[i]
                for (let j = 0; j < cloudletInfoList.length; j++) {
                    let cloudletInfo = cloudletInfoList[j]
                    if(cloudlet.CloudletName === cloudletInfo.CloudletName)
                    {
                        cloudlet.CloudletInfoState = cloudletInfo.State
                        break;
                    }
                }
            }
            if (cloudletList) {
                let operatorGroup = reducer.groupBy(cloudletList, 'Operator')
                //let cloudletGroup = reducer.groupBy(result, 'CloudletName')
                let keys = Object.keys(operatorGroup);
                let assObj = Object.assign([], this.state.keysData);
                if (cloudletList[0].Operator) {
                    assObj[0].Operator.items = keys;
                } else {
                    assObj[0].Operator.items = [];
                }
                this.setState({ keysData: assObj, operators: operatorGroup })

                // set list of operators
                if (this.props.devData.length > 0) {
                    this.setState({ dummyData: this.props.devData, resultData: (!this.state.resultData) ? this.props.devData : this.state.resultData })
                } else {
                    this.setState({ dummyData: this.state.fakeData, resultData: (!this.state.resultData) ? this.props.devData : this.state.resultData })
                }
                this.props.handleLoadingSpinner(false);
            }   
            
        }
    }
    receiveResultApp = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let appGroup = reducer.groupBy(response.data, 'OrganizationName')
                let keys = Object.keys(appGroup);
                let assObj = Object.assign([], this.state.keysData);
                assObj[0].DeveloperName.items = keys;
                this.setState({ keysData: assObj, apps: appGroup })
                this.props.handleLoadingSpinner(false);
                
            }
        }
    }
    receiveResultClusterInst = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;

                let clinstGroup = reducer.groupBy(response.data, 'ClusterName')
                let cloudletGroup = reducer.groupBy(response.data, 'Cloudlet')
                this.setState({ clustinst: clinstGroup, cloudlets: cloudletGroup })

                // set list of operators
                if (this.props.devData.length > 0) {
                    this.setState({ dummyData: this.props.devData, resultData: (!this.state.resultData) ? this.props.devData : this.state.resultData })
                } else {
                    this.setState({ dummyData: this.state.fakeData, resultData: (!this.state.resultData) ? this.props.devData : this.state.resultData })
                }
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

    createAutoClusterName = (multiData)=>
    {
        let appName = multiData.AppName.replace(/(\s*)/g, "");
        appName = appName.replace(/[&!, ]/g,'');
        appName = appName.replace(/[_]/g,'-');
        appName = appName.toLowerCase();
        return ['autocluster' + appName];
    }

    autoClusterInstance = (serviceBody, submitData, itemCloudlet, itemCluster)=>
    {   
            serviceBody = JSON.parse(JSON.stringify(serviceBody));
            let data = JSON.parse(JSON.stringify(submitData));
            data.appinst.key.cluster_inst_key.cloudlet_key.name = itemCloudlet;
            data.appinst.key.cluster_inst_key.cluster_key.name = itemCluster;
            data.appinst.key.cluster_inst_key.developer = data.appinst.key.app_key.developer_key.name;
            serviceBody.uuid = serviceMC.generateUniqueId()
            serviceBody.data = data;
            
            this.wsRequestCount = this.wsRequestCount + 1;
            this.props.handleLoadingSpinner(true);
            serviceMC.sendWSRequest(serviceBody, _self.receiveResult) 
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
                this.props.handleSubmitObject(submitData)
                this.setState({ toggleSubmit: true, validateError: error, regSuccess: true });
                this.props.handleLoadingSpinner(true);


                let serviceBody = {
                    token: store ? store.userToken : null,
                    method: serviceMC.getEP().CREATE_APP_INST
                };

                let multiData = nextProps.validateValue;
                let filterData = this.state.cloudlets;
                let vmCheck = this.state.autoClusterDisable;

                this.wsRequestCount = 0;
                this.wsRequestResponse = [];
                multiData.Cloudlet.map((itemCloudlet) => {
                    if (vmCheck) multiData.ClusterInst = ['']
                    if (multiData.AutoClusterInst) {
                        multiData.ClusterInst = this.createAutoClusterName(multiData)
                    }
                    if (filterData[itemCloudlet] && filterData[itemCloudlet].length > 0) {
                        filterData[itemCloudlet].map((items) => {
                            multiData.ClusterInst.map((itemCluster) => {
                                if (items.ClusterName == itemCluster || itemCluster == '' || itemCluster.indexOf('autocluster') > -1) {
                                    this.autoClusterInstance(serviceBody,submitData, itemCloudlet, itemCluster)
                                }
                            })
                            if (String(multiData.ClusterInst[0]).indexOf('autocluster') > -1 || multiData.ClusterInst[0] == "") {
                                multiData.ClusterInst = [];
                            }
                        })
                    }// hasn't any cluster in selected cloudlets then it should be make the new autocluster.
                    else if (!filterData[itemCloudlet]) {
                        multiData.ClusterInst.map((itemCluster) => {
                            if (itemCluster == '' || itemCluster.indexOf('autocluster') > -1) {
                                this.autoClusterInstance(serviceBody,submitData, itemCloudlet, itemCluster)
                            }
                        })
                        if (String(multiData.ClusterInst[0]).indexOf('autocluster') > -1 || multiData.ClusterInst[0] == "") {
                            multiData.ClusterInst = [];
                        }
                    }
                    else if (vmCheck) {
                        multiData.Cloudlet.map((item) => {
                            let data = JSON.parse(JSON.stringify(submitData));
                            data.appinst.key.cluster_inst_key.cloudlet_key.name = item;
                            data.appinst.key.cluster_inst_key.cluster_key.name = '';
                            serviceBody.data = data;
                            serviceBody.uuid = serviceMC.generateUniqueId()
                            this.props.handleLoadingSpinner(true);
                            serviceMC.sendWSRequest(serviceBody, _self.receiveResult)
                        })
                    }
                })
            } else {
                this.setState({ validateError: error, toggleSubmit: true })
            }

        }

        /************
         * set list of Region
         * **********/
        if(nextProps.selectedRegion && nextProps.selectedRegion !== this.props.selectedRegion){
            this.getDataDeveloper(store ? store.userToken : 'null',nextProps.formAppInst.values.Region);
        }

        /************
         * set list of cloudlet
         * **********/
        if(nextProps.selectedOperator && this.state.operators[nextProps.selectedOperator]) {
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Cloudlet.items = [];
            assObj[0].ClusterInst.items = [];
            assObj[0].Cloudlet.items = this.state.operators[nextProps.selectedOperator].map(cld =>cld);
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

    receiveResult = (mcRequest) => {
        this.wsRequestCount = this.wsRequestCount - 1;
        let messageArray = [];
        if (mcRequest) {
            this.wsRequestResponse.push(mcRequest);
            if (this.wsRequestCount === 0) {
                this.props.handleLoadingSpinner(false);
                let valid = true;
                this.wsRequestResponse.map(mcRequest => {
                    if(mcRequest.response && mcRequest.response.data)
                    {
                        let data = mcRequest.response.data
                        messageArray.push(data.data.message)
                        if (data.code !== 200) {
                            valid = false;
                        }
                    }
                })
                if (valid) {
                    this.gotoUrl('submit');
                }
                else {
                   this.setState({
                    dialogMessage : messageArray
                   })
                }
            }
        }
    }

    closeDialog = ()=>{
        this.setState({
            dialogMessage:[]
        })
        this.props.handleLoadingSpinner(false);
        this.gotoUrl('submit');
    }

    componentWillUnmount() {
        this.props.handleAppLaunch({})
    }

    render() {
        const { open, dimmer, dummyData, editMode } = this.state;
        const { hiddenKeys } = this.props;
        return (
            <div className="regis_container">
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
                <MexMessageDialog close={this.closeDialog} message={this.state.dialogMessage}/>
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
        regionInfo: regionInfo,
        selectOrg: state.selectOrg.org ? state.selectOrg.org['Organization'] : null
    }
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


