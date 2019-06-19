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
    {"w":19,"h":20,"x":0,"y":0,"i":"0", "minW":8,"minH":5, "moved":false,"static":false, "title":"Developer"}
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
    { menuItem: 'Cluster Instance Deployment', render: (props) => <Tab.Pane attached={false}><SiteFourCreateInstForm data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} onSubmit={() => console.log('submit form')}/></Tab.Pane> },
    // { menuItem: 'Docker deployment', render: () => <Tab.Pane  attached={false} pId={1}>None</Tab.Pane> },
    // { menuItem: 'VM deployment', render: () => <Tab.Pane attached={false} pId={2}>None</Tab.Pane> }
]
const ipaccessArr = ['IpAccessDedicated','IpAccessShared'];
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
            keysData:[
                {
                    'Region':{label:'Region', type:'RenderSelect', necessary:true, tip:'Allows developer to upload app info to different controllers', active:true, items:['US', 'EU']},
                    'ClusterName':{label:'Cluster Name', type:'RenderInput', necessary:true, tip:null, active:true},
                    'OrganizationName':{label:'Organization Name', type:'RenderInputDisabled', necessary:true, tip:null, active:true, items:['','']},
                    'Operator':{label:'Operator', type:'RenderSelect', necessary:true, tip:null, active:true, items:['','']},
                    'Cloudlet':{label:'Cloudlet', type:'RenderSelect', necessary:true, tip:null, active:true, items:['','']},
                    'DeploymentType':{label:'Deployment Type', type:'RenderSelect', necessary:true, tip:'aaa', active:true, items:['Docker', 'Kubernetes']},
                    'IpAccess':{label:'Ip Access', type:'RenderSelect', necessary:false, tip:'When checked, this will inherit settings from application settings',items:ipaccessArr},
                    'Flavor':{label:'Flavor', type:'RenderSelect', necessary:true, tip:null, active:true, items:['','']},
                    'NumberOfMaster':{label:'Number of Master', type:'RenderInputDisabled', necessary:false, tip:'When checked, this will inherit settings from application settings', value:null},
                    'NumberOfNode':{label:'Number of Node', type:'RenderInputNum', necessary:false, tip:'When checked, this will inherit settings from application settings', value:null},
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
        this.reqCount = 0;

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


    generateDOM(open, dimmer, width, height, data, keysData, hideHeader, region) {

        let panelParams = {data:data, keys:keysData, region:region, handleLoadingSpinner:this.props.handleLoadingSpinner, userrole:localStorage.selectRole}

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

    setFildData() {
        //
        if(_self.props.devData.length > 0) {
            _self.setState({dummyData:_self.props.devData, resultData:(!_self.state.resultData)?_self.props.devData:_self.state.resultData})
        } else {
            _self.setState({dummyData:_self.state.fakeData, resultData:(!_self.state.resultData)?_self.props.devData:_self.state.resultData})
        }
    }
    receiveSubmit = (result, body) => {
        

        console.log('receive data ..', result.data, body)

        let paseData = result.data;
        if(paseData.error) {
            this.setState({clusterInstCreate:false});
            this.props.handleLoadingSpinner(false);
            Alert.error(paseData.error, {
                position: 'top-right',
                effect: 'slide',
                beep: true,
                timeout: 3000,
                offset: 100
            });
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
        console.log("jjjjkkkkkk",assObj);
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

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        let serviceBody = {};

        if(nextProps.submitValues && nextProps.submitSucceeded && this.reqCount === 0) {
            console.log('submit on...', nextProps.submitValues)
            //this.props.handleCreatingSpinner(true);
            this.props.handleLoadingSpinner(true);
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            serviceBody = {params:createFormat(nextProps.submitValues), token:store.userToken}
            service.createNewClusterInst('CreateClusterInst',serviceBody, this.receiveSubmit)
            setTimeout(() => {
                this.props.handleLoadingSpinner(false);
                if(this.state.clusterInstCreate) {
                    this.props.gotoUrl();
                }
            }, 3000)
            
            this.reqCount = 1;
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
                            {this.generateDOM(open, dimmer, width, height, dummyData, this.state.keysData, hiddenKeys, this.props.region)}
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
    (str === 'IpAccessDedicated')? 1 :
    (str === 'IpAccessShared')? 3 : false
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
                "deploymentType":data['DeploymentType'],
                "flavor":{"name":data['Flavor']},
                "ip_access":parseInt(getInteger(data['IpAccess'])),
                "num_masters":parseInt(data['NumberOfMaster']),
                "num_nodes":parseInt(data['NumberOfNode'])
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
    let selectedRegion = null;
    let selectedCloudlet = null;
    let selectedOperator = null;
    let selectedApp = null;
    let flavors = null;
    let submitSucceeded = null;

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

        submitSucceeded = state.form.createAppFormDefault.submitSucceeded;
        if(state.form.createAppFormDefault.values && submitSucceeded) {
            submitVal = reducer.filterDeleteKey(state.form.createAppFormDefault.values, 'Edit')
        } else {
            submitVal = null;
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
        submitSucceeded,
        itemLabel: state.computeItem.item,
        userToken : (state.user.userToken) ? state.userToken: null,
        submitValues: submitVal,
        region: region.value,
        flavors: (state.showFlavor) ? state.showFlavor.flavor : null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        // handleCreatingSpinner: (data) => { dispatch(actions.creatingSpinner(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(RegistryClusterInstViewer);


