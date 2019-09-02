import React from 'react';
import {Header, Button, Table, Icon, Input, Tab, Item} from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import {withRouter} from "react-router-dom";

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
import * as service from "../services/service_compute_service";
const ReactGridLayout = WidthProvider(RGL);


let itData = '';
let submitImgPath = '';
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
    { menuItem: 'App Deployment', render: (props) => <Tab.Pane attached={false}><SiteFourCreateFormAppDefault data={props} pId={0} getOptionData={props.regionf} flavorData={props.devoptionsf} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} onSubmit={() => console.log('submit form')}/></Tab.Pane> },
    // { menuItem: 'Docker Deployment', render: (props) => <Tab.Pane attached={false}><SiteFourCreateFormAppDefault data={props} pId={0} onSubmit={() => console.log('submit form')}/></Tab.Pane> },
    // { menuItem: 'VM Deployment', render: (props) => <Tab.Pane attached={false}><SiteFourCreateFormAppDefault data={props} pId={0} onSubmit={() => console.log('submit form')}/></Tab.Pane> },
]
class RegistryViewer extends React.Component {
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
            devoptionsf:[],
            toggleSubmit:false,
            validateError:[]
        };
        this.keysData = [
            {
                'Region':{label:'Region', type:'RegionSelect', necessary:true, tip:'Allows developer to upload app info to different controllers', active:true, items:['US','KR', 'EU']},
                'OrganizationName':{label:'Organization Name', type:'RenderInputDisabled', necessary:true, tip:'Organization or Company Name that a Developer is part of', active:true},
                'AppName':{label:'App Name', type:'RenderInputApp', necessary:true, tip:'App name', active:true},
                'Version':{label:'App Version', type:'RenderInput', necessary:true, tip:'App version', active:true},
                'DeploymentType':{label:'Deployment Type', type:'RenderSelect', necessary:true, tip:'Deployment type (Kubernetes, Docker, or VM)', active:true, items:['Docker', 'Kubernetes', 'VM']},
                'ImageType':{label:'Image Type', type:'RenderDT', necessary:true, tip:'ImageType specifies image type of an App',items:''},
                'ImagePath':{label:'Image Path', type:'RenderPath', necessary:true, tip:'URI of where image resides', active:true,items:''},
                'AuthPublicKey':{label:'Auth Public Key', type:'RenderTextArea', necessary:false, tip:'auth_public_key', active:true},
                'DefaultFlavor':{label:'Default Flavor', type:'FlavorSelect', necessary:true, tip:'FlavorKey uniquely identifies a Flavor.', active:true},
                'Ports':{label:'Ports', type:'CustomPorts', necessary:false, tip:'Comma separated list of protocol:port pairs that the App listens on i.e. TCP:80,UDP:10002,http:443', active:true, items:['tcp', 'udp']},
                'DefaultFQDN':{label:'Default FQDN', type:'RenderInput', necessary:false, tip:'Default FQDN', active:true},
                'PackageName':{label:'Package Name', type:'RenderInput', necessary:false, tip:'Package Name', active:true},
                // 'IpAccess':{label:'IP Access', type:'IPSelect', necessary:false, tip:'aaa', active:true, items:['IpAccessShared', 'IpAcessDedicaterd']},
                'ScaleWithCluster':{label:'Scale With Cluster', type:'RenderCheckbox', necessary:false, items:false},
                'Command':{label:'Command', type:'RenderInput', necessary:false, tip:'Command that the container runs to start service', active:true},
                'DeploymentMF':{label:'Deployment Manifest', type:'RenderTextArea', necessary:false, tip:'Deployment manifest is the deployment specific manifest file/config For docker deployment, this can be a docker-compose or docker run file For kubernetes deployment, this can be a kubernetes yaml or helm chart file', active:true},
            },
            {

            }
        ]
        this.fakeData = [
            {
                'Region':'',
                'OrganizationName':'',
                'AppName':'',
                'Version':'',
                'DeploymentType':'',
                'ImageType':'',
                'ImagePath':'',
                'AuthPublicKey':'',
                'DefaultFlavor':'',
                'Ports':'',
                'DefaultFQDN':'',
                'PackageName':'',
                // 'IpAccess':'',
                'ScaleWithCluster':'',
                'Command':'',
                'DeploymentMF':'',
            }
        ]
        //this.hiddenKeys = ['CloudletLocation', 'URI', 'Mapped_ports']


    }

    onHandleClick(dim, data) {
        this.setState({ dimmer:dim, open: true, selected:data })
    }
    onHandleClicAdd(dim, data) {
        this.setState({ dimmer:dim, openAdd: true, selected:data })
    }

    receiveResult = (result, body) => {
        _self.props.handleLoadingSpinner(false);
        this.setState({toggleSubmit:false})
        if(result.data.error) {
            this.props.handleAlertInfo('error',result.data.error)
        } else {
            //this.props.gotoApp();
            this.props.handleAlertInfo('success','Your application '+body.params.app.key.name+' created successfully')
            setTimeout(() => {
                this.gotoUrl();
            }, 1000)
            //this.gotoUrl();
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
            search: 'pg=5'
        });
        _self.props.history.location.search = 'pg=5';
        _self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=5'})
    }

    generateDOM(open, dimmer, width, height, data, keysData, hideHeader) {

        let panelParams = {data:data, keys:keysData, regionf:this.getOptionData, devoptionsf:this.state.devoptionsf, userrole:localStorage.selectRole}

        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} style={{ width:width, minWidth:670, height:height, display:'flex', flexDirection:'column'}} >
                    <div className="grid_table" style={{width:'100%', height:height, overflowY:'auto'}}>

                        <Tab menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }} panes={panes}{...panelParams} gotoUrl={this.gotoUrl} toggleSubmit={this.state.toggleSubmit} error={this.state.validateError} />

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
    handleSort = clickedColumn => () => {
        const { column, dummyData, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                dummyData: _.sortBy(dummyData, [clickedColumn]),
                direction: 'ascending',
            })

            return
        }

        this.setState({
            dummyData: dummyData.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }
    makeHeader(_keys, headL, visibles) {
        const { column, direction } = this.state
        let keys = Object.keys(_keys);
        //hide column filtered...
        let filteredKeys = (visibles) ? reducer.filterDefine(keys, visibles) : keys;

        let widthDefault = Math.round(16/filteredKeys.length);
        return filteredKeys.map((key, i) => (
            (i === filteredKeys.length -1) ?
                <Table.HeaderCell width={3} textAlign='center' sorted={column === key ? direction : null} onClick={this.handleSort(key)}>
                    {key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell textAlign='center' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={this.handleSort(key)}>
                    {key}
                </Table.HeaderCell>
        ));
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
    }
    onPortClick() {

    }
    detailView(item) {
        if(!item['UserName']){
            this.setState({detailViewData:item, openDetail:true})
        } else {
            this.setState({detailViewData:item, openUser:true})
        }
    }
    roleMark = (role) => (
        (role.indexOf('Developer')!==-1 && role.indexOf('Manager')!==-1) ? <div className="mark markD markM">M</div> :
        (role.indexOf('Developer')!==-1 && role.indexOf('Contributor')!==-1) ? <div className="mark markD markC">C</div> :
        (role.indexOf('Developer')!==-1 && role.indexOf('Viewer')!==-1) ? <div className="mark markD markV">V</div> :
        (role.indexOf('Operator')!==-1 && role.indexOf('Manager')!==-1) ? <div className="mark markO markM">M</div> :
        (role.indexOf('Operator')!==-1 && role.indexOf('Contributor')!==-1) ? <div className="mark markO markC">C</div> :
        (role.indexOf('Operator')!==-1 && role.indexOf('Viewer')!==-1) ? <div className="mark markO markV">V</div> : <div></div>
    )

    getOptionData = (region) => {
        if(localStorage.selectMenu == "Apps") {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            // clusterFlavor
            service.getMCService('ShowFlavor',{token:store.userToken,region:region}, _self.receiveF)
        }
    }

    receiveF(result) {
        let arr = []
        result.map((item,i) => {
            arr.push(item.FlavorName)
        })
        _self.setState({devoptionsf: arr});
    }


    componentDidMount() {
        if(this.props.devData.length > 0) {
            this.setState({dummyData:this.props.devData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.fakeData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        }

        /************
         * set Organization Name
         * **********/
        let assObj = Object.assign([], this.fakeData);
        assObj[0].OrganizationName = localStorage.selectOrg;
        //assObj[0].ImagePath.items = "docker.mobiledgex.net/OrganizationName/images/AppName:AppVersion";
        //this.setState({fakeData:assObj});

    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }

        ////////
        if(nextProps.devData.length > 1) {
            this.setState({dummyData:nextProps.devData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.fakeData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        }
        ///////

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({toggleSubmit:false});
        if(nextProps.submitValues && !this.state.toggleSubmit) {
            
            const apps = ['Region','OrganizationName','AppName','Version','DeploymentType','DefaultFlavor']
            let error = [];
            apps.map((item) => {
                if(!nextProps.validateValue[item]) {
                    error.push(item)
                }
            })

            if(nextProps.formApps.submitSucceeded && error.length == 0){
                let serviceBody = {}
                this.setState({toggleSubmit:true,validateError:error});
                this.props.handleLoadingSpinner(true);
                //TODO: // 20190430 add spinner...(loading)
                serviceBody = {
                    "token":store.userToken,
                    "params": nextProps.submitValues
                }
                services.createNewApp('CreateApp', serviceBody, this.receiveResult)
            } else {
                this.setState({validateError:error,toggleSubmit:true})
            }
            
        }

        if(nextProps.formApps.values && nextProps.formApps.values.DeploymentType) {
            let assObj = Object.assign([], this.keysData);
            let selectType = '';
            let defaultPath = '';
            if(nextProps.formApps.values.DeploymentType == "Kubernetes" || nextProps.formApps.values.DeploymentType == "Docker") {
                selectType = 'Docker';
                defaultPath = 'docker.mobiledgex.net/OrganizationName/images/AppName:AppVersion';
            } else if(nextProps.formApps.values.DeploymentType == "VM") {
                selectType = 'Qcow';
                defaultPath = 'https://artifactory.mobiledgex.net/artifactory/repo-OrganizationName';
            }
            let ImagePath = (nextProps.formApps.values.ImagePath)? nextProps.formApps.values.ImagePath : defaultPath;
            assObj[0].ImageType.items = selectType;
            itData = (selectType == 'Docker') ? 'ImageTypeDocker' :
                    (selectType == 'Qcow') ? 'ImageTypeQcow' : 
                    selectType;
            if(nextProps.formApps.values.OrganizationName){
                ImagePath = ImagePath.replace('OrganizationName',nextProps.formApps.values.OrganizationName.toLowerCase())
            }
            if(nextProps.formApps.values.AppName) {
                ImagePath = ImagePath.replace('AppName', nextProps.formApps.values.AppName.toLowerCase())
            }
            if(nextProps.formApps.values.Version) {
                ImagePath = ImagePath.replace('AppVersion',nextProps.formApps.values.Version.toLowerCase())
            }
            assObj[0].ImagePath.items = ImagePath;
            submitImgPath = ImagePath;
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
                            useCSSTransforms={false}
                        >
                            {this.generateDOM(open, dimmer, width, height, dummyData, this.keysData, hiddenKeys)}
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
const createFormat = (data) => (
    {
        "region":data['Region'],
        "app":
            {
                "key":{"developer_key":{"name":data['OrganizationName']},"name":data['AppName'],"version":data['Version']},
                "scale_with_cluster":data['ScaleWithCluster'],
                "deployment":data['DeploymentType'],
                "image_type":itData,
                "image_path":data['ImagePath'],
                "access_ports":accessport(data),
                "default_flavor":{"name":data['DefaultFlavor']},
                "cluster":{"name":""},
                "auth_public_key":data['AuthPublicKey'],
                "official_fqdn":data['DefaultFQDN'],
                "android_package_name":data['PackageName'],
                "command":data['Command'],
                "deployment_manifest":data['DeploymentMF']
            }
    }
)
// access_ports combine
const accessport = (data) => {
    let key = Object.keys(data);
    let num = 0;
    let portSum = '';
    key.map((item,i) => {
        if(data['Ports_'+num] && data['Portsselect_'+num]){
            portSum = portSum + data['Portsselect_'+num]+":"+data['Ports_'+num]+',';
        }
        num++;
    })
    portSum = portSum.substr(0, portSum.length -1)
    return portSum;
}

//'{"region":"US","app":{"key":{"developer_key":{"name":"kgh0505"},"name":"kghtest22","version":"1.0.0"},
//"image_path":"registry.mobiledgex.net:5000/mobiledgex/simapp",
//"image_type":1,"access_ports":"udp:12001,tcp:80,http:7777","default_flavor":{"name":"x1.medium"},"cluster":{"name":""},"ipaccess":"IpAccessShared","command":"test","deployment_manifest":"test1111"}}'
const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let submitVal = null;
    let selectedDeploymentType = null;
    let validateValue = null;
    if(state.form.createAppFormDefault) {
        if(state.form.createAppFormDefault.value) {
            if(state.form.createAppFormDefault.values.DeploymentType !== "") {
                selectedDeploymentType = state.form.createAppFormDefault.values.DeploymentType;
            }
        }
    }
    
    if(state.form.createAppFormDefault && state.form.createAppFormDefault.values && state.form.createAppFormDefault.submitSucceeded) {
        
        let enableValue = reducer.filterDeleteKey(state.form.createAppFormDefault.values, 'Edit')
        
        if(enableValue.ImagePath == "") enableValue.ImagePath = submitImgPath;
        if(enableValue.DeploymentType === "Docker") enableValue.DeploymentType = "docker"
        if(enableValue.DeploymentType === "Kubernetes") enableValue.DeploymentType = "kubernetes"
        if(enableValue.DeploymentType === "VM") enableValue.DeploymentType = "vm"
        if(enableValue.ScaleWithCluster == "") enableValue.ScaleWithCluster = false
        submitVal = createFormat(enableValue)
        validateValue = state.form.createAppFormDefault.values;
    }
    
    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};

    let formApps= state.form.createAppFormDefault
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
        region: region,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        computeItem : state.computeItem?state.computeItem.item:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        selectedDeploymentType : selectedDeploymentType,
        validateValue:validateValue,
        formApps : formApps
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
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistryViewer));


