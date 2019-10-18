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

import * as service from '../services/service_compute_service';
import SiteFourCreateInstForm from "./siteFourCreateInstForm";
import Alert from "react-s-alert";
import SiteFourCreateFormDefault from "./siteFourCreateFormDefault";
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
    { menuItem: 'Cluster Instance Deployment', render: (props) => <Tab.Pane attached={false}><SiteFourCreateInstForm data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} onSubmit={() => console.log('submit form')}/></Tab.Pane> },
    // { menuItem: 'Docker deployment', render: () => <Tab.Pane  attached={false} pId={1}>None</Tab.Pane> },
    // { menuItem: 'VM deployment', render: () => <Tab.Pane attached={false} pId={2}>None</Tab.Pane> }
]
const ipaccessArr = ['Dedicated','Shared'];
class RegistryClusterInstViewer extends React.Component {
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
                    'Region':{label:'Region', type:'RenderSelect', necessary:true, tip:'Select region where you want to deploy the cluster.', active:true, items:[]},
                    'ClusterName':{label:'Cluster Name', type:'RenderInputCluster', necessary:true, tip:'Enter name of your cluster.', active:true},
                    'OrganizationName':{label:'Organization Name', type:'RenderInputDisabled', necessary:true, tip:'This is the name of the organization you are currently managing.', active:true, items:['','']},
                    'Operator':{label:'Operator', type:'RenderSelect', necessary:true, tip:'Which operator do you want to deploy this cluster? Please select one.', active:true, items:['','']},
                    'Cloudlet':{label:'Cloudlet', type:'RenderDropDown', necessary:true, tip:'Which cloudlet(s) do you want to deploy this cluster?', active:true, items:['','']},
                    'DeploymentType':{label:'Deployment Type', type:'RenderSelect', necessary:true, tip:'Do you plan to deploy your application in kubernetes cluster? Or do you plan to deploy it as a plain docker container?', active:true, items:['Docker', 'Kubernetes']},
                    'IpAccess':{label:'IP Access', type:'RenderSelect', necessary:false, tip:'Shared IP Access represents that you would be sharing a Root Load Balancer with other developers. Dedicated IP Access represents that you would have a dedicated Root Load Balancer.',items:ipaccessArr},
                    'Flavor':{label:'Flavor', type:'RenderSelect', necessary:true, tip:'What flavor is needed to run your application?', active:true, items:['','']},
                    'NumberOfMaster':{label:'Number of Masters', type:'RenderInputDisabled', necessary:false, tip:'This represents Kubernetes Master where it is responsible for maintaining the desired state for your cluster.', value:null},
                    'NumberOfNode':{label:'Number of Nodes', type:'RenderInputNum', necessary:false, tip:'What is the number of nodes you want in this cluster? The nodes in a cluster are the machines that run your applications.', value:null},
                },
                {

                }
            ],
            fakeData:[
                {
                    'Region':'',
                    'ClusterName':'',
                    'OrganizationName':'',
                    'Operator':'',
                    'Cloudlet':'',
                    'DeploymentType':'',
                    'IpAccess':'',
                    'Flavor':'',
                    'NumberOfMaster':'1',
                    'NumberOfNode':'1',
                }
            ]


        };

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
            search: 'pg=4'
        });
        _self.props.history.location.search = 'pg=4';
        _self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=4'})
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
    receiveSubmit = (result, body) => {
        
        let paseData = result.data;
        if(paseData.error && !this.state.errorClose) {
            //this.setState({clusterInstCreate:false})
            this.props.handleLoadingSpinner(false);
            if(paseData.error == 'Key already exists'){
                
            } else {
                this.props.handleAlertInfo('error',paseData.error)
            }
        }

        // if(paseData.message) {
        //     Alert.error(paseData.message, {
        //         position: 'top-right',
        //         effect: 'slide',
        //         onShow: function () {
        //             console.log('aye!')
        //         },
        //         beep: true,
        //         timeout: 5000,
        //         offset: 100
        //     });
        // } else {
        //     let splitData = JSON.parse( "["+paseData.split('}\n{').join('},\n{')+"]" );

        //     if(result.data.indexOf('successfully') > -1 || result.data.indexOf('ok') > -1) {
        //         Alert.success("Success!", {
        //             position: 'top-right',
        //             effect: 'slide',
        //             onShow: function () {
        //                 console.log('aye!')
        //             },
        //             beep: true,
        //             timeout: 5000,
        //             offset: 100
        //         });
        //         _self.props.success();
        //         _self.reqCount = 0;
        //     }
        // }

    }

    componentDidMount() {

        this.setFildData();

        /************
         * set Organization Name
         * **********/
        let assObj = Object.assign([], this.state.fakeData);
        assObj[0].OrganizationName = localStorage.selectOrg;
        this.setState({fakeData:assObj});
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
            
            const cluster = ['Region','ClusterName','OrganizationName','Operator','Cloudlet','DeploymentType','Flavor'];
            let error = [];
            cluster.map((item) => {
                if(!nextProps.validateValue[item]) {
                    error.push(item)
                }
            })

            //close tutorial
            this.props.handleStateTutor('done');

            if(nextProps.formClusterInst.submitSucceeded && error.length == 0){



                this.setState({toggleSubmit:true,validateError:error,regSuccess:true});
                this.props.handleLoadingSpinner(true);                
                service.createNewMultiClusterInst('CreateClusterInst',{params:nextProps.submitValues, token:store ? store.userToken : 'null'}, this.receiveSubmit, nextProps.validateValue.Cloudlet)
                setTimeout(() => {
                    this.props.handleLoadingSpinner(false);
                    this.props.gotoUrl();
                    this.setState({errorClose:true})
                }, 3000)
            } else {
                this.setState({validateError:error,toggleSubmit:true})
            }
            
        }

        /************
         * set list of flavors
         * **********/
        // if(nextProps.flavors) {
        //     let flavorGroup = reducer.groupBy(nextProps.flavors, 'FlavorName');
        //     let flavorKeys = Object.keys(flavorGroup);
        //     let assObj = Object.assign([], this.state.keysData);
        //     assObj[0].MasterFlavor.items = flavorKeys;
        //     assObj[0].NodeFlavor.items = flavorKeys;
        //     this.setState({keysData:assObj})
        //
        // }

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
    (str === 'Dedicated')? 1 :
    (str === 'Shared')? 3 : false
)
const createFormat = (data) => (
    {
        "region":data['Region'],
        "clusterinst":
            {
                "key":
                    {
                        "cluster_key":{"name":data['ClusterName']},
                        "cloudlet_key":{
                            "operator_key":{"name":data['Operator']},
                            "name":data['Cloudlet']
                        },
                        "developer":data['OrganizationName']
                    },
                "deployment":data['DeploymentType'],
                "flavor":{"name":data['Flavor']},
                "ip_access":parseInt(getInteger(data['IpAccess'])),
                "num_masters":parseInt(data['NumberOfMaster']),
                "num_nodes":parseInt(data['NumberOfNode'])
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
    let validateValue = null;

    if(state.form.createAppFormDefault) {
        if(state.form.createAppFormDefault.values.Region !== "") {
            selectedRegion = state.form.createAppFormDefault.values.Region;
        }
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
            if(enableValue.DeploymentType === "Docker"){
                enableValue.NumberOfMaster = 0;
                enableValue.NumberOfNode = 0;
                enableValue.DeploymentType = "docker"
            }
            if(enableValue.DeploymentType === "Kubernetes"){
                enableValue.DeploymentType = "kubernetes"
            }
            submitVal = createFormat(enableValue);
            validateValue = state.form.createAppFormDefault.values;
        }
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
    };
};

export default connect(mapStateToProps, mapDispatchProps)(RegistryClusterInstViewer);


