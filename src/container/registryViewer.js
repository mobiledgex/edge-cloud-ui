import React from 'react';
import {Table, Tab} from 'semantic-ui-react';
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
import SiteFourCreateFormAppDefault from "./siteFourCreateFormAppDefault";


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
    { menuItem: 'App Deployment', render: (props) => <Tab.Pane style={{overflow:'auto'}} attached={false}><SiteFourCreateFormAppDefault data={props} pId={0} getOptionData={props.regionf} provPolicyData={props.provPolicyList} privacyPolicyData={props.privacyPolicyList} flavorData={props.devoptionsf} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} onSubmit={() => console.log('submit form')}/></Tab.Pane> },
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
            provPolicyList:[],
            privacyPolicyList:[],
            toggleSubmit:false,
            validateError:[],
            keysData:[
                {
                    'Region':{label:'Region', type:'RegionSelect', necessary:true, tip:'Allows developer to upload app info to different controllers', active:true, items:[], editDisabled:true},
                    'OrganizationName':{label:'Organization Name', type:'RenderInputDisabled', necessary:true, tip:'Organization or Company Name that a Developer is part of', active:true, editDisabled:true},
                    'AppName':{label:'App Name', type:'RenderInputApp', necessary:true, tip:'App name', active:true, editDisabled:true},
                    'Version':{label:'App Version', type:'RenderInput', necessary:true, tip:'App version', active:true, editDisabled:true},
                    'DeploymentType':{label:'Deployment Type', type:'RenderSelect', necessary:true, tip:'Deployment type (Kubernetes, Docker, or VM)', active:true, items:['Docker', 'Kubernetes', 'VM'], editDisabled:true},
                    'ImageType':{label:'Image Type', type:'RenderDT', necessary:true, tip:'ImageType specifies image type of an App',items:''},
                    'ImagePath':{label:'Image Path', type:'RenderInput', necessary:true, tip:'URI of where image resides', active:true,items:''},
                    'AuthPublicKey':{label:'Auth Public Key', type:'RenderTextArea', necessary:false, tip:'auth_public_key', active:true},
                    'DefaultFlavor':{label:'Default Flavor', type:'FlavorSelect', necessary:true, tip:'FlavorKey uniquely identifies a Flavor.', active:true},
                    'DefaultPrivacyPolicy':{label:'Default Privacy Policy', type:'PrivacyPolicySelect', necessary:false, tip:'Privacy policy when creating auto cluster', active:true},
                    'Ports':{label:'Ports', type:'CustomPorts', necessary:false, tip:'Comma separated list of protocol:port pairs that the App listens on i.e. TCP:80,UDP:10002,http:443', active:true, items:['tcp', 'udp']},
                    'AutoProvPolicy':{label:'Auto Provisioning Policy', type:'ProvPolicySelect', necessary:false, tip:'Select Auto Provisioning Policy', active:true},
                    'DefaultFQDN':{label:'Official FQDN', type:'RenderInput', necessary:false, tip:'Official FQDN', active:true},
                    'PackageName':{label:'Package Name', type:'RenderInput', necessary:false, tip:'Package Name', active:true},
                    // 'IpAccess':{label:'IP Access', type:'IPSelect', necessary:false, tip:'aaa', active:true, items:['IpAccessShared', 'IpAcessDedicaterd']},
                    'ScaleWithCluster':{label:'Scale With Cluster', type:'RenderCheckbox', necessary:false, items:false},
                    'Command':{label:'Command', type:'RenderInput', necessary:false, tip:'Command that the container runs to start service', active:true},
                    'DeploymentMF':{label:'Deployment Manifest', type:'RenderTextArea', necessary:false, tip:'Deployment manifest is the deployment specific manifest file/config For docker deployment, this can be a docker-compose or docker run file For kubernetes deployment, this can be a kubernetes yaml or helm chart file', active:true},
                },
                {

                }
            ],
            fakeData:[
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
                    'DefaultPrivacyPolicy':'',
                    'Ports':'',
                    'AutoProvPolicy':'',
                    'DefaultFQDN':'',
                    'PackageName':'',
                    // 'IpAccess':'',
                    'ScaleWithCluster':'',
                    'Command':'',
                    'DeploymentMF':'',
                }
            ],
            editMode:false
        };

        //this.hiddenKeys = ['CloudletLocation', 'URI', 'Mapped_ports']


    }

    onHandleClick(dim, data) {
        this.setState({ dimmer:dim, open: true, selected:data })
    }
    onHandleClicAdd(dim, data) {
        this.setState({ dimmer:dim, openAdd: true, selected:data })
    }

    receiveResult = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let result = mcRequest.response;
                let request = mcRequest.request;
                let resource = request.method === serviceMC.getEP().CREATE_APP ? 'created' : 'updated'
                _self.props.handleLoadingSpinner(false);
                this.setState({ toggleSubmit: false })
                this.props.handleAlertInfo('success', 'Your application ' + request.data.app.key.name + ' ' + resource + ' successfully')
                setTimeout(() => {
                    this.gotoUrl();
                }, 1000)
            }
            else if(mcRequest.error)
            {
                let error = mcRequest.error;
                if(error.message == 'Key already exists') error.message = 'App already exists';
                this.props.handleAlertInfo('error',error.message)
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


    gotoUrl() {
        _self.props.history.push({
            pathname: '/site4',
            search: 'pg=5'
        });
        _self.props.history.location.search = 'pg=5';
        _self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=5'})
    }

    generateDOM(open, dimmer, data, keysData, hideHeader) {

        let panelParams = {data:data, keys:keysData, regionf:this.getOptionData,privacyPolicyList:this.state.privacyPolicyList,provPolicyList:this.state.provPolicyList, devoptionsf:this.state.devoptionsf, userrole:localStorage.selectRole, editMode:this.state.editMode, editData:this.props.editData}

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
            serviceMC.sendRequest(_self, { token: store.userToken, method: serviceMC.getEP().SHOW_FLAVOR, data: { region: region } }, _self.receiveF)
            serviceMC.sendRequest(_self, { token: store.userToken, method: serviceMC.getEP().SHOW_AUTO_PROV_POLICY, data: { region: region } }, _self.autoProvPolicyResponse)
            serviceMC.sendRequest(_self, { token: store.userToken, method: serviceMC.getEP().SHOW_PRIVACY_POLICY, data: { region: region } }, _self.privacyPolicyResponse)
        }
    }

    receiveF(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let arr = []
                response.data.map((item, i) => {
                    arr.push(item.FlavorName)
                })
                _self.setState({ devoptionsf: arr });
            }
        }
    }

    autoProvPolicyResponse(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let arr = ['Unchecked']
                response.data.map((item, i) => {
                    arr.push(item.AutoPolicyName)
                })
                _self.setState({ provPolicyList: arr });
            }
        } else {
            _self.setState({ provPolicyList: ['Unchecked'] });
        }
    }

    privacyPolicyResponse(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let arr = ['Unchecked']
                response.data.map((item, i) => {
                    arr.push(item.PrivacyPolicyName)
                })
                _self.setState({ privacyPolicyList: arr });
            }
        } else {
            _self.setState({ privacyPolicyList: ['Unchecked'] });
        }
    }

    

    updateFields(initData,updateData){
        let fieldArr = [];
        const fields = {
            AppFieldImagePath:"4",
            AppFieldAccessPorts:"7",
            AppFieldDefaultFlavorName:"9.1",
            AppFieldAuthPublicKey:"12",
            AppFieldCommand:"13",
            AppFieldDeploymentManifest:"16",
            AppFieldAndroidPackageName:"18",
            AppFieldScaleWithCluster:"22",
            AppFieldOfficialFqdn:"25"
        }

        if(initData.ImagePath !== updateData.image_path) fieldArr.push(fields.AppFieldImagePath)
        if(initData.Ports !== updateData.access_ports) fieldArr.push(fields.AppFieldAccessPorts)
        if(initData.DefaultFlavor !== updateData.default_flavor.name) fieldArr.push(fields.AppFieldDefaultFlavorName)
        if(initData.AuthPublicKey !== updateData.auth_public_key) fieldArr.push(fields.AppFieldAuthPublicKey)
        if(initData.Command !== updateData.command) fieldArr.push(fields.AppFieldCommand)
        if(initData.DeploymentMF !== updateData.deployment_manifest) fieldArr.push(fields.AppFieldDeploymentManifest)
        if(initData.PackageName !== updateData.android_package_name) fieldArr.push(fields.AppFieldAndroidPackageName)
        if(initData.ScaleWithCluster !== updateData.scale_with_cluster) fieldArr.push(fields.AppFieldScaleWithCluster)
        if(initData.DefaultFQDN !== updateData.official_fqdn) fieldArr.push(fields.AppFieldOfficialFqdn)

        return fieldArr;

    }


    componentDidMount() {
        //edit(call flavorlist)
        if(this.props.editMode && this.props.editData){
            let region = this.props.editData.Region;
            this.getOptionData(region);
        }
        if(this.props.devData.length > 0) {
            this.setState({dummyData:this.props.devData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?this.props.devData:this.state.resultData})
        }

        /************
         * set Organization Name
         * **********/
        let assObj = Object.assign([], this.state.fakeData);
        assObj[0].OrganizationName = localStorage.selectOrg;
        //assObj[0].ImagePath.items = "docker.mobiledgex.net/OrganizationName/images/AppName:AppVersion";
        //this.setState({fakeData:assObj});


    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.regionInfo.region.length){
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Region.items = nextProps.regionInfo.region;
        }
        ////////
        if(nextProps.devData.length > 1) {
            this.setState({dummyData:nextProps.devData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        }
        ///////

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({toggleSubmit:false});
        if(nextProps.submitValues && !this.state.toggleSubmit) {
            const apps = ['Region','OrganizationName','AppName','Version','DeploymentType','DefaultFlavor']
            let error = [];
            // edit mode 일 때와 new 일 떼 구분하기
            if(!nextProps.editMode) apps.map((item) => {
                if(nextProps.validateValue[item] === "") {
                    error.push(item)
                }
            })
            
            if(nextProps.formApps.submitSucceeded && error.length == 0){
                let method = serviceMC.getEP().CREATE_APP;
                let newBodyData = nextProps.submitValues;
                /* 
                * ================== update start ===================
                * make body code by @Smith 
                */
               let sValue = nextProps.submitValues.app;
               let keys = Object.keys(sValue);
                if(nextProps.editMode) {
                    method = serviceMC.getEP().UPDATE_APP;
                    nextProps.submitValues.app['fields'] = this.updateFields(nextProps.editData, nextProps.submitValues.app)
                    nextProps.submitValues.region = nextProps.editData.Region;
                    // TODO 20200207 @Smith: we need formating to app properly body to send to update url 
                    this.setState({toggleSubmit:true,validateError:error});
                    // reset submitValues as use the editData and the submitValues
                    newBodyData = createFormat(nextProps.editData);
                    let key = {
                        "developer_key":{"name":nextProps.editData['OrganizationName']},
                        "name":nextProps.editData['AppName'],
                        "version":nextProps.editData['Version']
                    }
                    newBodyData.app['key'] = key;
                    newBodyData.app['image_type'] = nextProps.editData['ImageType'];
                    newBodyData.app['official_fqdn'] = nextProps.editData['DefaultFQDN'];
                    newBodyData.app['fields'] = nextProps.submitValues.app['fields'];
                    nextProps.submitValues.app['key'] = key;

                    // concat submitValues with newBodyData
                    keys.map((key) => {
                        if(sValue[key] !== "" && typeof sValue[key] === 'string') {
                            newBodyData.app[key] = sValue[key];
                        }
                        if(sValue[key] !== "" && typeof sValue[key] === 'object') {
                            if(key === 'default_flavor' && sValue[key]['name'] !== '') {
                                newBodyData.app[key]['name'] = sValue[key]['name']
                            }
                        }

                    }) 
                    // combin ports
                    let combinPorts = "";
                    if(nextProps.editData && (nextProps.editData.Ports !== "" && nextProps.submitValues.app['access_ports'] !== "")) {
                        //has delete port
                        if(nextProps.submitValues.app['access_ports'].indexOf('[object Object]')>-1) {
                            combinPorts = nextProps.editData.Ports
                        } else {
                            combinPorts = nextProps.editData.Ports+","+nextProps.submitValues.app['access_ports']
                        }
                        newBodyData.app['access_ports'] = combinPorts;
                    }
                    // if delete port
                    if(nextProps.editData && (nextProps.editData.Ports !== "" && nextProps.submitValues.app['delete_ports'].length > 0)) {
                        let deletePorts = nextProps.submitValues.app['delete_ports'];
                        let portArray = nextProps.editData.Ports.split(',');
                        let addedPort = nextProps.submitValues.app['access_ports'].split(',');
                        let deleteIndexs = [];
                        deletePorts.map((port) => {
                            let nm = parseInt(port['value'])
                            deleteIndexs.push(nm);
                        })
                        portArray = portArray.filter(function(value, index) { 
                            return deleteIndexs.indexOf(index) == -1; 
                        })
                        let portString = "";
                        portArray.map((portValue, i) => {
                            portString += ((i === 0)? '' : ',') +portValue;
                        })
                        //added port
                        addedPort.map(port => {
                            if(port.indexOf('[object Object]') === -1) {
                                portString += (','+port)
                            }
                        })
                        newBodyData.app['access_ports'] = portString;
                    }
                    
                    console.log('new body =', newBodyData)
                }
                /**
                 * ======================= update end =====================
                 */
                keys.map((key) => {
                    if(newBodyData.app[key] === 'Unchecked') {
                        newBodyData.app[key] = ""
                    }
                })
                this.setState({toggleSubmit:true,validateError:error});
                this.props.handleLoadingSpinner(true);
                let serviceBody = {
                    method : method,
                    token:store ? store.userToken : 'null',
                    data: newBodyData
                }
                serviceMC.sendRequest(_self, serviceBody, this.receiveResult)
            } else {
                this.setState({validateError:error,toggleSubmit:true})
            }

        }

        if(nextProps.formApps.values && nextProps.formApps.values.DeploymentType) {
            let assObj = Object.assign([], this.state.keysData);
            let selectType = '';
            let defaultPath = '';
            if(nextProps.formApps.values.DeploymentType == "Kubernetes" || nextProps.formApps.values.DeploymentType == "Docker") {
                selectType = 'Docker';
                defaultPath = 'docker.mobiledgex.net/OrganizationName/images/AppName:AppVersion';
            } else if(nextProps.formApps.values.DeploymentType == "VM") {
                selectType = 'Qcow';
                defaultPath = 'https://artifactory.mobiledgex.net/artifactory/repo-OrganizationName';
            }
            console.log('nextProps.formApps.values.ImagePath',nextProps.formApps.values.ImagePath,"::::",this.props.formApps.values.ImagePath)
            let ImagePath = (nextProps.formApps.values.ImagePath)? nextProps.formApps.values.ImagePath : (nextProps.formApps.values.ImagePath != this.props.formApps.values.ImagePath)? '': defaultPath;

            assObj[0].ImageType.items = selectType;
            itData = (selectType == 'Docker') ? 'ImageTypeDocker' :
                (selectType == 'Qcow') ? 'ImageTypeQcow' :
                    selectType;
            if(nextProps.formApps.values.OrganizationName){
                ImagePath = ImagePath.replace('OrganizationName',(nextProps.formApps.values.DeploymentType == "VM")?nextProps.formApps.values.OrganizationName:nextProps.formApps.values.OrganizationName.toLowerCase())
            }
            if(nextProps.formApps.values.AppName) {
                ImagePath = ImagePath.replace('AppName', nextProps.formApps.values.AppName.toLowerCase().replace(/(\s*)/g, ""))
            }
            if(nextProps.formApps.values.Version) {
                ImagePath = ImagePath.replace('AppVersion',nextProps.formApps.values.Version.toLowerCase())
            }
            //if(ImagePath == '') ImagePath = ''
            assObj[0].ImagePath.items = ImagePath;
            submitImgPath = ImagePath;

        }
        

        if(nextProps.editMode) this.setState({editMode:nextProps.editMode})
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
                "delete_ports":deleteport(data),
                "auto_prov_policy":data['AutoProvPolicy'],
                "default_flavor":{"name":data['DefaultFlavor']},
                "default_privacy_policy":data['DefaultPrivacyPolicy'],
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

const deleteport = (data) => {
    let key = Object.keys(data);
    let num = 0;
    let portSum = [];
    key.map((item,i) => {
        if(data['Ports_'+num] && data['Portsselect_'+num]){
            if(data['Portsselect_'+num]['key'] && data['Portsselect_'+num]['key'] === 'delete') {
                // if delete port
                portSum.push(data['Ports_'+num]);
            } 
        }
        num++;
    })
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
        if(state.form && state.form.createAppFormDefault){
            let objArr = Object.keys(state.form.createAppFormDefault.values)
            let first = [];
            let second = [];
            let num = [];
            objArr.map((item) => {
                if(item.indexOf('multiF')>-1){
                    first.push(state.form.createAppFormDefault.values[item]);
                    num.push(item.charAt(item.length-1));
                }
                if(item.indexOf('multiS')>-1){
                    second.push(state.form.createAppFormDefault.values[item]);
                }
            })
            if(first.length && second.length && num.length){
                num.map((item,key) => {
                    state.form.createAppFormDefault.values['Ports_'+item] = first[key]+"-"+second[key];
                })
            }
        }

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
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
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
        formApps : formApps,
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
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistryViewer));


