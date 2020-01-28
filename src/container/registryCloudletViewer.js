import React from 'react';
import {Tab} from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import {withRouter} from "react-router-dom";
import PopDetailViewer from './popDetailViewer';
import PopUserViewer from './popUserViewer';
import PopAddUserViewer from './popAddUserViewer';
import './styles.css';
import _ from "lodash";
import * as reducer from '../utils'

import * as serviceMC from '../services/serviceMC';
import SiteFourCreateInstForm from "./siteFourCreateInstForm";
const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"x":0,"y":0,"i":"0", "minW":8, "moved":false,"static":false, "title":"Developer"}
]
let _self = null;

const panes = [
    { menuItem: 'Cloudlet Deployment', render: (props) => <Tab.Pane attached={false}><SiteFourCreateInstForm data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} onSubmit={() => console.log('submit form')}/></Tab.Pane> },
    // { menuItem: 'Docker deployment', render: () => <Tab.Pane  attached={false} pId={1}>None</Tab.Pane> },
    // { menuItem: 'VM deployment', render: () => <Tab.Pane attached={false} pId={2}>None</Tab.Pane> }
]
/*
Web UI - need to add new fields for creating a new cloudlet

we need to add the following fields when creating a new cloudlet:Type - with pulldown values of 'Openstack', 'Azure', 'GCP'. Location - this is a freeform string value but has to match what is configured in the vault. Right now we use the values of 'hamburg' and 'bonn'. Should we use a pulldown with the pulldown of 'Hamburg', 'Bonn'?

Type needs to send the following in the create cloudlet message:for openstack: "platform_type":2for azure: "platform_type":3for gcp: "platform_type":4

Location needs to send the following in the create cloudlet message:"physical_name":"hamburg""physical_name":"bonn"
 */
const ipaccessArr = ['Dedicated','Shared'];
class RegistryCloudletViewer extends React.Component {
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
            clusterInstCreate:true,
            toggleSubmit:false,
            validateError:[],
            regSuccess:true,
            errorClose:false,
            keysData:[
                {
                    'Region':{label:'Region', type:'RenderSelect', necessary:true, tip:'Select region where you want to deploy.', active:true, items:[]},
                    'CloudletName':{label:'Cloudlet Name', type:'RenderInputCluster', necessary:true, tip:'Name of the cloudlet.', active:true},
                    'OperatorName':{label:'Operator Name', type:'RenderInputDisabled', necessary:true, tip:'Name of the organization you are currently managing.', active:true, items:['','']},
                    'CloudletLocation':{label:'Cloudlet Location', type:'CloudletLocation', necessary:true, tip:'Cloudlet Location', active:true, items:['','']},
                    'IPSupport':{label:'IP Support', type:'RenderSelect', necessary:true, tip:'Ip Support indicates the type of public IP support provided by the Cloudlet. Static IP support indicates a set of static public IPs are available for use, and managed by the Controller. Dynamic indicates the Cloudlet uses a DHCP server to provide public IP addresses, and the controller has no control over which IPs are assigned.', active:true, items:['Dynamic']},
                    'NumberOfDynamicIPs':{label:'Number of Dynamic IPs', type:'RenderInput', necessary:true, tip:'Number of dynamic IPs available for dynamic IP support.'},
                    'PhysicalName':{label:'Physical Name', type:'RenderInput', necessary:true, tip:'Physical infrastructure cloudlet name.', active:true},
                    'PlatformType':{label:'Platform Type', type:'RenderSelect', necessary:true, tip:'Supported list of cloudlet types.', active:true, items:['Openstack']}
                },
                {

                }
            ],
            fakeData:[
                {
                    'Region':'',
                    'CloudletName':'',
                    'OperatorName':'',
                    'CloudletLocation':'',
                    'IPSupport':'',
                    'NumberOfDynamicIPs':'',
                    'PhysicalName':'',
                    'PlatformType':'',
                    'OpenRCData':'',
                    'CACertData':''
                }
            ]


        };

        this.pauseRender =false;

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
            search: 'pg=2'
        });
        _self.props.history.location.search = 'pg=2';
        _self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=2'})
    }


    generateDOM(open, dimmer, data, keysData, hideHeader, region) {

        let panelParams = {data:data, keys:keysData, region:region, handleLoadingSpinner:this.props.handleLoadingSpinner, userrole:localStorage.selectRole}

        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i}>
                    <div className="grid_table">
                        <Tab className="grid_tabs" menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }} panes={panes}{...panelParams} gotoUrl={this.gotoUrl} toggleSubmit={this.state.toggleSubmit} error={this.state.validateError} />
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

    setFildData() {
        //
        if(_self.props.devData.length > 0) {
            _self.setState({dummyData:_self.props.devData, resultData:(!_self.state.resultData)?_self.props.devData:_self.state.resultData})
        } else {
            _self.setState({dummyData:_self.state.fakeData, resultData:(!_self.state.resultData)?_self.props.devData:_self.state.resultData})
        }
    }
    receiveSubmit = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response.data
                if (response.code === 200) {
                    _self.props.gotoUrl();
                    _self.setState({ errorClose: true })
                }
                else {
                    this.props.handleAlertInfo('error', response.data.message)
                }
            }
        }
        _self.props.handleLoadingSpinner(false);
    }

    componentDidMount() {

        this.setFildData();

        /************
         * set Organization Name
         * **********/
        let assObj = Object.assign([], this.state.fakeData);
        assObj[0].OperatorName = localStorage.selectOrg;
        this.setState({fakeData:assObj});

    }
    componentWillUnmount() {
        _self.props.handleGetRegion(null)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.regionInfo.region.length){
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Region.items = nextProps.regionInfo.region;
        }
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
        if(nextProps.submitValues && !this.state.toggleSubmit) {
            const cluster = ['Region','CloudletName','OperatorName','IPSupport','NumberOfDynamicIPs','PhysicalName','PlatformType','Latitude','Longitude'];
             //add if platform_type is openstack  (placement should be better)
            if(nextProps.submitValues.cloudlet.platform_type !== 2)
            {
                nextProps.submitValues.cloudlet.accessvars = undefined
            }
            let error = [];
            cluster.map((item) => {
                if(!nextProps.validateValue[item]) {
                    error.push(item)
                }
            })
            //close tutorial
            this.props.handleStateTutor('done');
            if(!this.pauseRender && nextProps.formClusterInst.submitSucceeded && error.length == 0){
                this.setState({toggleSubmit:true,validateError:error,regSuccess:true});
                this.props.handleLoadingSpinner(true);
                serviceMC.sendWSRequest({ uuid:serviceMC.generateUniqueId(),token: store.userToken, method: serviceMC.getEP().CREATE_CLOUDLET, data: nextProps.submitValues }, this.receiveSubmit)
                setTimeout(() => {
                    this.props.handleLoadingSpinner(false);
                    this.props.gotoUrl();
                    this.setState({errorClose:true})
                }, 3000)
                this.pauseRender = true;
            } else {
                this.setState({validateError:error,toggleSubmit:true})
            }
            
        }


    }

    render() {
        const { open, dimmer, dummyData } = this.state;
        const { hiddenKeys } = this.props;
        return (
            <div className="regis_container">
                {/*<RegistNewListItem data={this.state.dummyData} resultData={this.state.resultData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close}/>*/}
                <div
                    draggableHandle
                    layout={this.state.layout}
                    onLayoutChange={this.onLayoutChange}
                    {...this.props}
                    style={{overflowY:'visible'}}
                    useCSSTransforms={false}
                >
                    {this.generateDOM(open, dimmer, dummyData, this.state.keysData, hiddenKeys, this.props.region)}
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
  "Region": "US",
  "ClusterName": "myClusterInst0513",
  "OrganizationName": "TDG",
  "Operator": "RCI",
  "Cloudlet": "toronto-cloudlet",
  "Flavor": "m4.large",
  "IpAccess": "IpAccessDedicated",
  "NumberOfMaster": "1",
  "NumberOfNode": "2"
}
 */
const getInteger = (str) => (
    (str === 'Openstack')? 2 :
    (str === 'Azure')? 3 :
    (str === 'GCP')? 4 : false
)
const getInteger_ip = (str) => (
    (str === 'Static')? 1 :
    (str === 'Dynamic')? 2 : false
)
const createFormat = (data,loc) => (
    {
        "region":data['Region'],
        "cloudlet":{
            "key":{
                "operator_key":{"name":data['OperatorName']},
                "name":data['CloudletName']
            },
            "location":{
                // "latitude":Number((loc)?loc.lat:0),
                // "longitude":Number((loc)?loc.long:0),
                "latitude":Number(data['Latitude']),
                "longitude":Number(data['Longitude']),
                "timestamp":{}
            },
            "ip_support":getInteger_ip(data['IPSupport']),
            "num_dynamic_ips":Number(data['NumberOfDynamicIPs']),
            "physical_name":data['PhysicalName'],
            "platform_type":getInteger(data['PlatformType']),
            "accessvars":{
            "OPENRC_DATA":data['OpenRCData'],
            "CACERT_DATA":data['CACertData']
            }
        }
    }
)
const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let submitVal = null;
    let selectedRegion = null;
    let selectedCloudlet = null;
    let selectedOperator = null;
    let selectedApp = null;
    let flavors = null;
    let validateValue = {};
    
    //TODO : 건희 20190902 새롭게 추가된 필드 'Cloudlet Type'데 대한 기능 구현 ()
    /**
     * EDGECLOUD-1187 Web UI - need to add new fields for creating a new cloudlet
     * Web UI - need to add new fields for creating a new cloudlet

     we need to add the following fields when creating a new cloudlet:
     Type - with pulldown values of 'Openstack', 'Azure', 'GCP'.
     Location - this is a freeform string value but has to match what is configured in the vault. Right now we use the values of 'hamburg' and 'bonn'. Should we use a pulldown with the pulldown of 'Hamburg', 'Bonn'?

     Type needs to send the following in the create cloudlet message:
     for openstack: "platform_type":2
     for azure: "platform_type":3
     for gcp: "platform_type":4

     Location needs to send the following in the create cloudlet message:
     "physical_name":"hamburg"
     "physical_name":"bonn"
     */
    if(state.form.createAppFormDefault && state.form.createAppFormDefault.values && state.getRegion.region){
        state.form.createAppFormDefault.values.Latitude = state.getRegion.region.lat;
        state.form.createAppFormDefault.values.Longitude = state.getRegion.region.long;
    }
    
    if(state.form.createAppFormDefault && state.form.createAppFormDefault.values && state.form.createAppFormDefault.submitSucceeded) {
        let enableValue = reducer.filterDeleteKey(state.form.createAppFormDefault.values, 'Edit')
        submitVal = createFormat(enableValue,state.getRegion.region);
        validateValue = state.form.createAppFormDefault.values;
    }
    
    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};

    let formClusterInst= state.form.createAppFormDefault
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
        flavors: (state.showFlavor) ? state.showFlavor.flavor : null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        validateValue:validateValue,
        formClusterInst : formClusterInst,
        getRegion : (state.getRegion)?state.getRegion.region:null,
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
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
        handleStateTutor: (data) => { dispatch(actions.tutorStatus(data))},
        handleGetRegion: (data) => { dispatch(actions.getRegion(data)) },
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistryCloudletViewer));

