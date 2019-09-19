import React, {Fragment} from 'react';
import {
    Grid,
    Image,
    Header,
    Menu,
    Dropdown,
    Button,
    Popup,
    Divider,
    Modal,
    Item,
    Input,
    Segment,
    Table, Icon,
    Container
} from 'semantic-ui-react';
import sizeMe from 'react-sizeme';

import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import ContainerDimensions from 'react-container-dimensions'
import {Motion, spring} from "react-motion";
import { Steps, Hints } from 'intro.js-react';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import {GridLoader, PulseLoader, ClipLoader} from "react-spinners";
import HeaderGlobalMini from '../container/headerGlobalMini';

//pages
import SiteFourPageFlavor from './siteFour_page_flavor';
import SiteFourPageUser from './siteFour_page_user';
import SiteFourPageAccount from './siteFour_page_account';

import SiteFourPageApps from './siteFour_page_apps';
import SiteFourPageAppInst from './siteFour_page_appinst';
import SiteFourPageClusterInst from './siteFour_page_clusterinst';
import SiteFourPageCloudlet from './siteFour_page_cloudlet';
import SiteFourPageCloudletReg from './siteFour_page_cloudletReg';
import SiteFourPageOrganization from './siteFour_page_organization';
import SiteFourPageAppReg from './siteFour_page_appReg';
import SiteFourPageAppInstReg from './siteFour_page_appInstReg';
import SiteFourPageCreateorga from './siteFour_page_createOrga';

import SiteFourPageClusterInstReg from './siteFour_page_clusterInstReg';
import PopLegendViewer from '../container/popLegendViewer';

import * as Service from '../services/service_login_api';
import * as computeService from '../services/service_compute_service';

import { organizationTutor, CloudletTutor } from '../tutorial'

import Alert from 'react-s-alert';

import '../css/introjs.css';
import '../css/introjs-dark.css';

let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]
const locationOptions = [
    { key: 'Arabic', text: 'Arabic', value: 'Arabic' },
    { key: 'Chinese', text: 'Chinese', value: 'Chinese' },
    { key: 'Danish', text: 'Danish', value: 'Danish' },
    { key: 'Dutch', text: 'Dutch', value: 'Dutch' },
    { key: 'English', text: 'English', value: 'English' },
    { key: 'French', text: 'French', value: 'French' },
    { key: 'German', text: 'German', value: 'German' },
    { key: 'Greek', text: 'Greek', value: 'Greek' },
    { key: 'Hungarian', text: 'Hungarian', value: 'Hungarian' },
    { key: 'Italian', text: 'Italian', value: 'Italian' },
    { key: 'Japanese', text: 'Japanese', value: 'Japanese' },
    { key: 'Korean', text: 'Korean', value: 'Korean' },
    { key: 'Lithuanian', text: 'Lithuanian', value: 'Lithuanian' },
    { key: 'Persian', text: 'Persian', value: 'Persian' },
    { key: 'Polish', text: 'Polish', value: 'Polish' },
    { key: 'Portuguese', text: 'Portuguese', value: 'Portuguese' },
    { key: 'Russian', text: 'Russian', value: 'Russian' },
    { key: 'Spanish', text: 'Spanish', value: 'Spanish' },
    { key: 'Swedish', text: 'Swedish', value: 'Swedish' },
    { key: 'Turkish', text: 'Turkish', value: 'Turkish' },
    { key: 'Vietnamese', text: 'Vietnamese', value: 'Vietnamese' },
]
let defaultMotion = {left: window.innerWidth/2,top: window.innerHeight/2, position: 'absolute', opacity:1}

const orgaSteps = organizationTutor();
const cloudletSteps = CloudletTutor();
let _self = null;
class SiteFour extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight:0,
            contWidth:0,
            bodyHeight:0,
            headerTitle:'',
            activeItem: 'Organizations',
            page: 'pg=0',
            email: store ? store.email : 'Administrator',
            role: '', //db에서
            onlyView: false,
            userToken:null,
            profileViewData:null,
            userName:'',
            controllerRegions:null,
            regions:[
                { key: 1, text: 'All', value: 'All' },
                { key: 2, text: 'US', value: 'US' },
                { key: 3, text: 'KR', value: 'KR' },
                { key: 4, text: 'EU', value: 'EU' }
            ],
            nextPosX:window.innerWidth / 2 ,
            nextPosY:window.innerHeight / 2,
            nextOpacity:1,
            setMotion:defaultMotion,
            OrganizationName:'',
            adminShow:false,
            createState:'',
            // toggleState:true,
            noData:false,
            viewMode:'listView',
            toggleDisable:true,
            currentVersion:'v-',
            searchChangeValue:'Username',
            menuClick:false,
            showItem:false,
            learned:false,

            stepsEnabled: false,
            initialStep: 0,
            steps:[],

            openLegend:false,

            enable:false,
            hideNext: true,
            camBtnStat:'leave'
            // hintsEnabled: true,
            // hints: [
            //     {
            //         element: '.selector3',
            //         hint: 'Hello hint',
            //         hintPosition: 'middle-right',
            //     }
            // ]
        };
        //this.controllerOptions({controllerRegions})
        this.headerH = 70;
        this.menuW = 240;
        this.hgap = 0;
        this.OrgMenu = [
            {label:'Organizations', icon:'people', pg:0},
            {label:'User Roles', icon:'dvr', pg:1},
            {label:'Accounts', icon:'dvr', pg:101}
        ]
        this.menuItems = [
            {label:'Cloudlets', icon:'cloud_queue', pg:2},
            {label:'Flavors', icon:'free_breakfast', pg:3},
            {label:'Cluster Instances', icon:'storage', pg:4},
            {label:'Apps', icon:'apps', pg:5},
            {label:'App Instances', icon:'storage', pg:6}
        ]
        this.auth_three = [this.menuItems[0]] //OperatorManager, OperatorContributor, OperatorViewer
        this.auth_list = [
            {role:'AdminManager', view:[]},
            {role:'DeveloperManager', view:[2,3]},
            {role:'DeveloperContributor', view:[1,2,3]},
            {role:'DeveloperViewer', view:[1,2,3,4,5,6]},
            {role:'OperatorManager', view:[]},
            {role:'OperatorContributor', view:[1]},
            {role:'OperatorViewer', view:[1,2]}
        ]
        this.searchOptions = [
            {
                key:'Username',
                text:'Username',
                value:'Username'
            },
            {
                key:'Organization',
                text:'Organization',
                value:'Organization'
            }
        ]

        this.speed = { stiffness: 500, damping: 100 }
        this.speedOpacity = { stiffness: 500, damping: 100 }

        this.selectedfilters = [];
    }


    //go to
    gotoPreview(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=0';
        _self.props.handleChangeViewBtn(false)

        //_self.props.handleChangeClickCity([]);
        _self.props.handleSelectOrg('')
        _self.props.handleUserRole('')

        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})
    }
    gotoUrl(site, subPath) {
        let mainPath = site;
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})
        _self.setState({ page:subPath})
    }
    handleItemClick ( id, label, pg, role ) {
        _self.setState({menuClick:true})
        _self.props.handleDetail({data:null, viewMode:'listView'})
        _self.props.handleChangeViewBtn(false);
        _self.props.handleChangeClickCity([]);
        _self.props.handleChangeComputeItem(label);
        _self.props.handleSearchValue('')
        _self.props.handleChangeRegion('All')
        _self.props.history.push({
            pathname: '/site4',
            search: "pg="+pg
        });
        let mainPath = '/site4';
        let subPath = 'pg='+pg;
        _self.props.history.location.search = "pg="+pg;
        _self.props.handleChangeStep(pg)
        _self.setState({ page:'pg='+pg, activeItem: label, headerTitle:label })
        localStorage.setItem('selectMenu', label)
    }

    onHandleRegistry() {
        if(localStorage.selectMenu === 'Organizations') {
            this.setState({page:'pg=newOrg'})
            this.gotoUrl('/site4', 'pg=newOrg')
        } else if(localStorage.selectMenu === 'Cloudlets') {
            this.setState({page: 'pg=createCloudlet'})
            this.gotoUrl('/site4', 'pg=createCloudlet')
        } else if(localStorage.selectMenu === 'Apps') {
            this.setState({page: 'pg=createApp'})
            this.gotoUrl('/site4', 'pg=createApp')
        } else if(localStorage.selectMenu === 'App Instances') {
            this.setState({page:'pg=createAppInst'})
            this.gotoUrl('/site4', 'pg=createAppInst')
        } else if(localStorage.selectMenu === '') {
            this.setState({page:'pg=createAppInst'})
            this.gotoUrl('/site4', 'pg=createAppInst')
        } else if(localStorage.selectMenu === 'Cluster Flavors') {
            this.setState({page:'pg=createClusterFlavor'})
            this.gotoUrl('/site4', 'pg=createClusterFlavor')
        } else if(localStorage.selectMenu === 'Cluster Instances') {
            this.setState({page:'pg=createClusterInst'})
            this.gotoUrl('/site4', 'pg=createClusterInst')
        } else {
            this.props.handleInjectDeveloper('newRegist');
        }
    }
    receiveCurrentUser(result) {
        _self.props.handleUserInfo(result.data);
    }
    receiveResult(result) {
        _self.controllerOptions(result.data);
    }
    receiveAdminInfo = (result) => {
        this.props.handleRoleInfo(result.data)
        if(result.error) {

        } else {
            result.data.map((item,i) => {
                if(item.role.indexOf('Admin') > -1){
                    this.setState({adminShow:true});
                    this.props.handleUserRole(item.role);
                    localStorage.setItem('selectRole', item.role)
                }
            })
        }

    }
    receiveVersion(result) {
        _self.setState({currentVersion:result.data.version})
    }
    controllerOptions(option){
        let arr = []
        if(option) {
            option.map((item)=> {
                arr.push({
                    key: item.Region,
                    text: item.Region,
                    value: item.Region,
                    content: item.Region
                })
            })
        }
        //잠시 막음 : superuser 일 때만 데이터 불러옴.
        //if(arr.length > 0) _self.setState({regions: arr})
    }

    menuAddItem = () => (
        <Button.Group vertical>

            <Modal trigger={<Button>Create Control</Button>} centered={false}>
                <Modal.Header>Select a Photo</Modal.Header>
                <Modal.Content image>
                    <Image wrapped size='medium' src='/images/avatar/large/rachel.png' />
                    <Modal.Description>
                        <Header>Default Profile Image</Header>
                        <p>We've found the following gravatar image associated with your e-mail address.</p>
                        <p>Is it okay to use this photo?</p>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
            <Button>Create User</Button>
            <Button>New Organization</Button>
        </Button.Group>

    )

    menuSupport = () => (
        <Button.Group vertical>
            <Button>Send Email to : support@mobiledgex.com</Button>
        </Button.Group>

    )

    getHelpPopup =(key)=> (
        <Popup
            trigger={<Icon name='question circle outline' size='small' style={{marginTop:0,paddingLeft:10}}/>}
            content=
                {(key=='Cloudlets')? 'A Cloudlet is a set of compute resources at a particular location, provided by an Operator.'
                    :(key=='Cluster Instances')? 'ClusterInst is an instance of a Cluster on a Cloudlet. It is defined by a Cluster, Cloudlet, and Developer key.'
                        :(key=='Apps')? 'App belongs to developers and is used to provide information about their application.'
                            :(key=='App Instances')? 'AppInst is an instance of an App on a Cloudlet where it is defined by an App plus a ClusterInst key. Many of the fields here are inherited from the App definition.'
                                : key
                }
            // content={this.state.tip}
            // style={style}
            inverted
        />
    )
    getGuidePopup =(key)=> (
        <button className="ui circular icon button" onClick={this.enalbeSteps}><i aria-hidden="true" className="info icon"></i></button>
    )

    enalbeSteps =()=> {
        let enable = false;
        let currentStep = null;
        console.log('20190821 siteName==', this.props, 'change org step..', this.props.changeStep, 'steps data=', orgaSteps, 'userRole=', this.props.userRole,this.props.userInfo.info, 'this.props.dataExist==',this.props.dataExist)
        let site = this.props.siteName;
        let userName = (this.props.userInfo)?this.props.userInfo.info.Name:'';
        if(this.props.params.mainPath === "/site4" && this.props.params.subPath === "pg=newOrg") {
            if(this.props.changeStep === '02'){
                currentStep = orgaSteps.stepsNewOrg2;
            } else if(this.props.changeStep === '03') {
                currentStep = orgaSteps.stepsNewOrg3;
            } else {
                currentStep = orgaSteps.stepsNewOrg;
            }
            

            enable = true;
        } else if(this.props.params.subPath === "pg=0") {
            if(this.props.dataExist){
                if(userName === 'mexadmin') {
                    currentStep = orgaSteps.stepsOrgDataAdmin;
                } else {
                    currentStep = orgaSteps.stepsOrgDataDeveloper;
                }
            } else {
                if(userName === 'mexadmin') {
                    currentStep = orgaSteps.stepsOrgAdmin;
                } else {
                    currentStep = orgaSteps.stepsOrgDeveloper;
                }
            }

            enable = true;
        } else if(this.props.params.subPath === "pg=2")  {
            //Cloudlets  
            currentStep = cloudletSteps.stepsCloudlet;
            enable = true;
        } else if(this.props.params.subPath === "pg=3")  {
            //Flavors
            currentStep = orgaSteps.stepsFlavors;
            enable = true;
        } else if(this.props.params.subPath === "pg=4")  {
            //Cluster Instances
            currentStep = orgaSteps.stepsClusterInst;
            enable = true;
        } else if(this.props.params.subPath === "pg=5")  {
            //Apps
            currentStep = orgaSteps.stepsApp;
            enable = true;
        } else if(this.props.params.subPath === "pg=6")  {
            //App Instances
            currentStep = orgaSteps.stepsAppInst;
            enable = true;
        } else if(this.props.params.subPath === "pg=createClusterInst") {
            currentStep = orgaSteps.stepsClusterInstReg;
            enable = true;
        } else if(this.props.params.subPath === "pg=createApp") {
            currentStep = orgaSteps.stepsCreateApp;
            enable = true;
        } else if(this.props.params.subPath === "pg=createAppInst") {
            currentStep = orgaSteps.stepsCreateAppInst;
            enable = true;
        } else if(this.props.params.subPath === "pg=createCloudlet") {
            currentStep = cloudletSteps.stepsCloudletReg;
            enable = true;
        }

        this.setState({steps : currentStep})
        console.log('20190826 this.steps==', this.steps, currentStep)

        let elmentName = (this.steps)?currentStep:null;
        //this.steps.props.options.hideNext = true;
        let element = (elmentName)?document.getElementsByClassName(elmentName[0].element.replace('.', '')):[];
        console.log('20190821 step..', this.steps, element)
        if(enable) {
            console.log("elementelement111",element)
            this.setState({stepsEnabled:true, enable: true})
        }

    }
    getAdminInfo(token) {
        Service.getCurrentUserInfo('currentUser', {token:token}, this.receiveCurrentUser, this);
        computeService.getMCService('showController', {token:token}, this.receiveResult, this);
        computeService.getMCService('ShowRole',{token:token}, this.receiveAdminInfo)
        computeService.getMCService('Version',{token:token}, this.receiveVersion, this)
    }
    componentWillMount() {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
        this.setState({contWidth:(window.innerWidth-this.menuW)})
        //this.selectedfilters = [];

    }
    componentDidMount() {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        this.setState({activeItem: (localStorage.selectMenu)?localStorage.selectMenu:'Organizations', headerTitle:(localStorage.selectMenu)?localStorage.selectMenu:'Organizations'})
        //get list of customer's info
        // if(store.userToken) {
        //     Service.getCurrentUserInfo('currentUser', {token:store.userToken}, this.receiveCurrentUser, this);
        //     computeService.getMCService('showController', {token:store.userToken}, this.receiveResult, this);
        // }
        //if there is no role
        //site1으로 이동할 수 없는 문제로 아래 코드 주석처리 by inki
        //show you create the organization view
        //this.setState({page:'pg=0'})
        //this.gotoUrl('/site4', 'pg=0')
        //this.gotoPreview('/site4');
        //this.props.history.location.search = "pg=0";


        this.disableBtn();

        if(store) this.getAdminInfo(store.userToken);
        setTimeout(() => {
            let elem = document.getElementById('animationWrapper')
            if(elem){
                //_self.makeGhost(elem, _self)


            }
        }, 4000)

        this.setState({steps: orgaSteps.stepsZero})
    }
    componentWillReceiveProps(nextProps) {
        console.log("this.props.changeStep",this.props,":::",nextProps)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        this.setState({contWidth:(window.innerWidth-this.menuW)})
        this.setState({userToken: nextProps.userToken})
        this.setState({userName: (nextProps.userInfo && nextProps.userInfo.info) ? nextProps.userInfo.info.Name : null})
        if(nextProps.params && nextProps.params.subPath) {
            this.setState({page:nextProps.params.subPath})
        }

        // if(localStorage.selectRole && this.state.menuClick) {
        //     this.disableBtn();
        //     this.setState({menuClick:false})
        // }



        // if(nextProps.creatingSpinner && this.state.toggleState) {
        //     this.getIntervalData();
        //     this.setState({toggleState:false})
        // }

        if(nextProps.viewMode){
            this.setState({viewMode:nextProps.viewMode})
        } else {
            this.setState({viewMode:'listView'})
        }
        // if(nextProps.params.subPath && this.state.viewMode == 'detailView') {
        //     this.setState({viewMode:'listView'})
        // }

        //Redux Alert
        if(nextProps.alertInfo.mode) {
            Alert.closeAll();
            if(nextProps.alertInfo.mode === 'success') {
                Alert.success(nextProps.alertInfo.msg, {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 5000,
                    offset: 100
                });
            } else if(nextProps.alertInfo.mode === 'error') {
                Alert.error(nextProps.alertInfo.msg, {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 5000,
                    offset: 100
                });
            }
            nextProps.handleAlertInfo('','');
        }

        //set filters
        if(nextProps.tableHeaders) {
            this.setState({showItem:false})
            if(nextProps.tableHeaders.length) {
                this.setState({tableHeaders:nextProps.tableHeaders})
            } else {

            }
        }

        // set step value of guide
        console.log('20190821 step==', this.props.changeStep)

        // saved tutorial
        let tutorial = localStorage.getItem('TUTORIAL')

        let formKey = Object.keys(nextProps.formInfo);
        console.log('submitSucceeded formKey= ', formKey)
        //let submitSucceeded = (nextProps.formInfo) ? nextProps.formInfo[formKey[0]]['submitSucceeded']: null
        if(formKey.length){
            console.log('submitSucceeded = ', nextProps.formInfo[formKey[0]], nextProps.formInfo[formKey[0]]['submitSucceeded'])
            if(nextProps.formInfo[formKey[0]]['submitSucceeded']) {
                if(nextProps.formInfo[formKey[0]]['submitSucceeded'] === true) {
                    _self.setState({stepsEnabled:false})
                }
            }
        }
        if(tutorial === 'done') {
            //_self.setState({stepsEnabled:false})
        }
        //
        let enable = true;
        setTimeout(() => {
            let elem = document.getElementById('animationWrapper')
            if(elem){
                //_self.makeGhost(elem, _self)

            }
            console.log('20190822 tutorial=', tutorial)
            if(enable && !this.state.learned && !tutorial) {
                this.enalbeSteps();
                _self.setState({stepsEnabled:true, learned:true})
                localStorage.setItem('TUTORIAL', 'done')
            }

        }, 1000)

        let site = this.props.siteName;
        if(!this.props.changeStep || this.props.changeStep === '02') {
            this.setState({enable : true})
        } else {
            this.setState({enable:false})
        }

    }

    componentDidUpdate() {
        if(localStorage.selectRole && this.state.menuClick) {
            this.disableBtn();
            this.setState({menuClick:false})
        }
    }
    componentWillUnmount() {
        this.setState({learned:false})
    }

    //compute page menu view
    menuItemView = (item, i, activeItem) => (
        <Menu.Item
            className={'leftMenu_'+item.label}
            key={i}
            name={item.label}
            active={activeItem === item.label}
            onClick={() => this.handleItemClick(i, item.label, item.pg, localStorage.selectRole)}
        >
            <div className="left_menu_item">
                <MaterialIcon icon={item.icon}/>
                <div className='label'>{item.label}</div>
                {(activeItem === item.label)?
                    <div style={{position:'absolute', right:'10px', top:'center'}}>
                        <ClipLoader
                            size={20}
                            sizeUnit={'px'}
                            color={'rgba(136,221,0,.85)'}
                            loading={this.props.loadingSpinner}
                            // loading={true}
                        />
                    </div>
                    :null}
            </div>

        </Menu.Item>
    )

    searchClick = (e) => {
        this.props.handleSearchValue(e.target.value,this.state.searchChangeValue)
    }
    makeGhost(elem, self) {

        let child = document.createElement('div')
        child.style.cssText = 'position:absolute; width:100px; height:30px; line-height:30px; text-align:center; opacity:0.8; left:0px; z-index:100; background:#aaaaaa; border-radius:5px';
        child.innerHTML = '<div>Cloudlet Name</div>'
        elem.appendChild(child);
        //
        let nextPosX = 15
        let nextPosY = 90;
        setTimeout(() => self.setState({setMotion:{left: spring(nextPosX, self.speed),top: spring(nextPosY, self.speed), position: 'absolute', opacity:0}}), 200);
    }
    resetMotion() {
        let self = _self;
        this.setState({setMotion:defaultMotion})
        let nextPosX = 15
        let nextPosY = 180;
        setTimeout(() => self.setState({setMotion:{left: spring(nextPosX, self.speed),top: spring(nextPosY, self.speed), position: 'absolute', opacity:spring(0, self.speedOpacity)}}), 500);
    }
    onChangeRegion = (e, {value}) => {
        _self.props.handleChangeRegion(value)

    }

    computeRefresh = () => {
        this.props.handleLoadingSpinner(true);
        this.props.handleComputeRefresh(true);
    }
    disableBtn = () => {
        const menuArr = ['Organization','User Roles','Cloudlets','Flavors','Cluster Instances','Apps','App Instances']
        this.auth_list.map((item,i) => {
            if(item.role == localStorage.selectRole) {
                item.view.map((item) => {
                    if(menuArr[item] == localStorage.selectMenu) {
                        this.props.handleChangeViewBtn(true);
                    }
                })
            }
        })


    }

    searchChange = (e, {value}) => {
        this.setState({searchChangeValue:value})
        this.props.handleSearchValue(this.props.searchValue,value)
    }


    options = [
        {
            key: 1,
            text: 'Mobile',
            value: 1,
            content: <Header icon='mobile' content='Mobile' subheader='The smallest size' />,
        },
        {
            key: 2,
            text: 'Tablet',
            value: 2,
            content: <Header icon='tablet' content='Tablet' subheader='The size in the middle' />,
        },
        {
            key: 3,
            text: 'Desktop',
            value: 3,
            content: <Header icon='desktop' content='Desktop' subheader='The largest size' />,
        },
    ]
    onExit() {
        _self.setState({stepsEnabled: false})
    }

    orgTypeLegendShow=()=> {
        _self.setState({openLegend: true})
    }
    closeLegend = () => {
        this.setState({ openLegend: false })
    }


    render() {
        const {shouldShowBox, shouldShowCircle, viewMode } = this.state;
        const { stepsEnabled, initialStep,hintsEnabled,hints, steps } = this.state;
        console.log('20190821 stepsEnabled..', stepsEnabled)
        return (
            <Grid className='view_body'>
                <Steps
                    enabled={stepsEnabled}
                    steps={steps}
                    initialStep={initialStep}
                    onExit={this.onExit}
                    showButtons={true}
                    options ={{hideNext:false}}
                    ref={steps => (this.steps = steps)}
                />
                <Hints
                    enabled={hintsEnabled}
                    hints={hints}
                />
                {(this.props.loadingSpinner==true)?
                    <div className="loadingBox" style={{zIndex:9999}}>
                        <GridLoader
                            sizeUnit={"px"}
                            size={25}
                            color={'#70b2bc'}
                            loading={this.props.loadingSpinner}
                            //loading={this.props.creatingSpinner}
                            //loading={true}
                        />
                        {/*<span className={this.props.loadingSpinner ? '' : 'loading'} style={{fontSize:'22px', color:'#70b2bc'}}>Loading...</span>*/}
                    </div>:null}
                {/* <div className="creatingBox">
                    <PulseLoader
                        sizeUnit={"px"}
                        size={20}
                        color={'#70b2bc'}
                        loading={this.props.creatingSpinner}
                        //loading={true}
                    />
                    <span className={this.props.creatingSpinner ? '' : 'create'} style={{fontSize:'18px', color:'#70b2bc'}}>Creating...</span>
                </div> */}
                {(this.props.creatingSpinner==true)?
                    <div className="loadingBox" style={{zIndex:9999}}>
                        <GridLoader
                            sizeUnit={"px"}
                            size={25}
                            color={'#70b2bc'}
                            loading={this.props.creatingSpinner}
                            //loading={true}
                        />
                        {/*<span className={this.props.creatingSpinner ? '' : 'loading'} style={{fontSize:'22px', color:'#70b2bc'}}>Creating...</span>*/}
                    </div>:null}

                <Grid.Row className='gnb_header'>
                    <Grid.Column width={6} className='navbar_left'>
                        <Header>
                            <Header.Content onClick={() => this.gotoPreview('/site1')}  className='brand' />
                        </Header>
                    </Grid.Column>
                    <Grid.Column width={10} className='navbar_right'>
                        <div style={{cursor:'pointer'}} onClick={this.computeRefresh}>
                            <MaterialIcon icon={'refresh'} />
                        </div>
                        <div style={{cursor:'pointer'}} onClick={() => this.gotoUrl('/site1','pg=0')}>
                            <MaterialIcon icon={'public'} />
                        </div>
                        <div style={{cursor:'pointer', display:'none'}}>
                            <MaterialIcon icon={'notifications_none'} />
                        </div>
                        <Popup
                            trigger={<div style={{cursor:'pointer', display:'none'}}>
                                <MaterialIcon icon={'add'} />
                            </div>}
                            content={this.menuAddItem()}
                            on='click'
                            position='bottom center'
                            className='gnb_logout'
                        />
                        {/* 프로필 */}
                        <HeaderGlobalMini email={this.state.email} data={this.props.userInfo.info} dimmer={false}/>
                        <Popup
                            trigger={<div style={{cursor:'pointer'}}> Support </div>}
                            content={this.menuSupport()}
                            on='click'
                            position='bottom center'
                            className='gnb_logout'
                        />
                    </Grid.Column>
                </Grid.Row>
                <Container className='view_left_container' style={{width:this.menuW}}>
                    {/* show name of organization */}
                    <Grid.Row>
                        <div>Organization</div>
                        <div>{localStorage.selectOrg?localStorage.selectOrg:'Select Organization'}</div>
                    </Grid.Row>
                    {/* show role of user */}
                    <Grid.Row className='view_contents'>
                        <Grid.Column style={{height:this.state.bodyHeight}} className='view_left'>
                            <Menu secondary vertical className='view_left_menu org_menu'>
                                <Grid.Row>
                                    <Segment>
                                        <Grid className="stepOrgDeveloper2">
                                            <Grid.Row columns={2} style={{cursor:'pointer'}} onClick={this.orgTypeLegendShow}>
                                                <Grid.Column width={5}>
                                                    <div className="markBox">
                                                        {
                                                            (localStorage.selectRole == 'AdminManager')? null
                                                                :
                                                                (localStorage.selectRole == 'DeveloperManager')?
                                                                    <div className="mark markD markM">M</div>
                                                                    :
                                                                    (localStorage.selectRole == 'DeveloperContributor')?
                                                                        <div className="mark markD markC">C</div>
                                                                        :
                                                                        (localStorage.selectRole == 'DeveloperViewer')?
                                                                            <div className="mark markD markV">V</div>
                                                                            :
                                                                            (localStorage.selectRole == 'OperatorManager')?
                                                                                <div className="mark markO markM">M</div>
                                                                                :
                                                                                (localStorage.selectRole == 'OperatorContributor')?
                                                                                    <div className="mark markO markC">C</div>
                                                                                    :
                                                                                    (localStorage.selectRole == 'OperatorViewer')?
                                                                                        <div className="mark markO markV">V</div>
                                                                                        :
                                                                                        <div>Type and Role</div>
                                                        }
                                                    </div>
                                                </Grid.Column>
                                                <Grid.Column width={11} style={{lineHeight:'24px'}}>
                                                    {
                                                        (localStorage.selectRole == 'AdminManager') ? localStorage.selectRole : localStorage.selectRole
                                                    }
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Grid.Row>
                                {
                                    this.OrgMenu.map((item, i)=>(
                                        (item.label == 'Accounts' && localStorage.selectRole !== 'AdminManager') ? null
                                            : (localStorage.selectRole == 'AdminManager') ? this.menuItemView(item, i, localStorage.selectMenu)
                                            : this.menuItemView(item, i, localStorage.selectMenu)
                                    ))
                                }

                            </Menu>
                            <Menu secondary vertical className='view_left_menu'>
                                {
                                    (localStorage.selectRole == 'AdminManager')?
                                        this.menuItems.map((item, i)=>(
                                            this.menuItemView(item, i, localStorage.selectMenu)
                                        ))
                                        :
                                        (localStorage.selectRole == 'DeveloperManager' || localStorage.selectRole == 'DeveloperContributor' || localStorage.selectRole == 'DeveloperViewer')?
                                            this.menuItems.map((item, i)=>(
                                                this.menuItemView(item, i, localStorage.selectMenu)
                                            ))
                                            :
                                            (localStorage.selectRole == 'OperatorManager' || localStorage.selectRole == 'OperatorContributor' || localStorage.selectRole == 'OperatorViewer')?
                                                this.auth_three.map((item, i)=>(
                                                    this.menuItemView(item, i, localStorage.selectMenu)
                                                ))
                                                :
                                                null
                                }

                            </Menu>
                            <div style={{position:'fixed', bottom:10, zIndex:'100', color:'rgba(255,255,255,.2)'}}>
                                {
                                    (localStorage.selectRole == 'AdminManager')? this.state.currentVersion : null
                                }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Container>
                <Container className='contents_body_container' style={{top:this.headerH, left:this.menuW}}>
                    <Grid.Row  className='view_contents'>
                        <Grid.Column className='contents_body'>
                            <Grid.Row className='content_title' style={{width:'fit-content', display:'inline-block'}}>
                                <Grid.Column className='title_align' style={{lineHeight:'36px'}}>{this.state.headerTitle}</Grid.Column>
                                {
                                    (this.props.location.search !== 'pg=1' && this.props.location.search !== 'pg=101' && viewMode !== 'detailView') ?
                                        <Grid.Column className='title_align'>
                                            <Item className={'stepOrg2'} style={{marginLeft:20, marginRight:10}}>
                                                <Button color='teal' disabled={this.props.viewBtn.onlyView} onClick={() => this.onHandleRegistry()}>New</Button>
                                            </Item>
                                        </Grid.Column>
                                        : null
                                }
                                {
                                    (viewMode === 'detailView') ?
                                        <Grid.Column className='title_align' style={{marginLeft:20}}>
                                            <Button onClick={()=>this.props.handleDetail({data:null, viewMode:'listView'})}>Close Details</Button>
                                        </Grid.Column>
                                        : null
                                }
                                {/* {
                                    //filtering for column of table
                                    (viewMode !== 'detailView' && (this.state.headerTitle === 'App Instances' || this.state.headerTitle === 'Apps' || this.state.headerTitle === 'Cluster Instances')) ?
                                        <Grid.Column>
                                            <DropDownFilter></DropDownFilter>
                                        </Grid.Column>
                                        :
                                        null
                                } */}
                                <div style={{marginLeft:'10px'}}>
                                    {/* {(this.state.enable)?this.getGuidePopup(this.state.headerTitle):null} */}
                                    {
                                        (
                                            this.state.headerTitle !== 'User Roles' &&
                                            this.state.headerTitle !== 'Accounts' &&
                                            this.state.headerTitle !== 'Flavors'
                                        )?this.getGuidePopup(this.state.headerTitle):null}
                                </div>
                                <div style={{position:'absolute', top:25, right:25}}>
                                    {this.getHelpPopup(this.state.headerTitle)}
                                </div>

                            </Grid.Row>
                            {
                                (this.state.headerTitle !== 'Organizations' && this.state.headerTitle !== 'User Roles' && this.state.headerTitle !== 'Accounts'  && viewMode !== 'detailView') ?
                                    <Grid.Row style={{padding:'10px 10px 0 10px',display:'inline-block'}}>
                                        <label style={{padding:'0 10px'}}>Region</label>
                                        <Dropdown className='selection'
                                                  options={this.state.regions}
                                            // defaultValue={this.state.regions[0].value}
                                                  value={this.props.changeRegion}
                                                  onChange={this.onChangeRegion}
                                        />
                                    </Grid.Row>
                                    : null
                            }
                            {
                                (this.state.headerTitle == 'User Roles') ?
                                    <div className='user_search' style={{top:15, right:65, position:'absolute',zIndex:99}}>
                                        <Input icon='search' placeholder={'Search '+this.state.searchChangeValue} style={{marginRight:'20px'}}  onChange={this.searchClick} />
                                        <Dropdown defaultValue={this.searchOptions[0].value} search selection options={this.searchOptions} onChange={this.searchChange} />
                                    </div>
                                    : null
                            }

                            <Grid.Row className='site_content_body'>
                                <Grid.Column>
                                            <div className="table-no-resized" style={{height:'100%', display:'flex', overflow:'hidden'}}>
                                                {
                                                    (this.state.page === 'pg=0')?<SiteFourPageOrganization></SiteFourPageOrganization> :
                                                        (this.state.page === 'pg=1')?<SiteFourPageUser></SiteFourPageUser> :
                                                            (this.state.page === 'pg=101')?<SiteFourPageAccount></SiteFourPageAccount> :
                                                                (this.state.page === 'pg=2')?<SiteFourPageCloudlet></SiteFourPageCloudlet> :
                                                                    (this.state.page === 'pg=3')?<SiteFourPageFlavor></SiteFourPageFlavor> :
                                                                        (this.state.page === 'pg=4')?<SiteFourPageClusterInst></SiteFourPageClusterInst>:
                                                                            (this.state.page === 'pg=5')?<SiteFourPageApps></SiteFourPageApps>:
                                                                                (this.state.page === 'pg=6')? <SiteFourPageAppInst></SiteFourPageAppInst> :
                                                                                    (this.state.page === 'pg=newOrg')? <SiteFourPageCreateorga></SiteFourPageCreateorga> :
                                                                                        (this.state.page === 'pg=createApp')? <SiteFourPageAppReg></SiteFourPageAppReg> :
                                                                                            (this.state.page === 'pg=createAppInst')? <SiteFourPageAppInstReg editable={false}></SiteFourPageAppInstReg> :
                                                                                            (this.state.page === 'pg=editAppInst')? <SiteFourPageAppInstReg editable={true}></SiteFourPageAppInstReg> :
                                                                                                (this.state.page === 'pg=createClusterInst')? <SiteFourPageClusterInstReg></SiteFourPageClusterInstReg> :
                                                                                                (this.state.page === 'pg=createCloudlet')? <SiteFourPageCloudletReg></SiteFourPageCloudletReg> :
                                                                                                    <div> </div>
                                                }
                                            </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Container>
                <PopLegendViewer data={this.state.detailViewData} dimmer={false} open={this.state.openLegend} close={this.closeLegend} siteId={this.props.siteId}></PopLegendViewer>
                <Motion defaultStyle={defaultMotion} style={this.state.setMotion}>
                    {interpolatingStyle => <div style={interpolatingStyle} id='animationWrapper'></div>}
                </Motion>
            </Grid>
        );
    }

};

const mapStateToProps = (state) => {
    let viewMode = null;
    if(state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
    }
    let action = state.action;
    let tutorState = (state.tutorState)?state.tutorState.state:null;
    let formInfo = (state.form)?state.form:null;
    let submitInfo = (state.submitInfo)?state.submitInfo:null;
    return {
        viewBtn : state.btnMnmt?state.btnMnmt:null,
        userToken : (state.userToken) ? state.userToken: null,
        userInfo : state.userInfo?state.userInfo:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        loadingSpinner : state.loadingSpinner.loading?state.loadingSpinner.loading:null,
        creatingSpinner : state.creatingSpinner.creating?state.creatingSpinner.creating:null,
        injectData: state.injectData ? state.injectData : null,
        viewMode : viewMode,
        alertInfo : {
            mode: state.alertInfo.mode,
            msg: state.alertInfo.msg
        },
        searchValue : (state.searchValue.search) ? state.searchValue.search: null,
        changeRegion : (state.changeRegion.region) ? state.changeRegion.region : null,
        tableHeaders : (state.tableHeader)? state.tableHeader.headers : null,
        filters : (state.tableHeader)? state.tableHeader.filters : null,
        siteName: (state.siteChanger)?state.siteChanger.site:null,
        changeStep: (state.changeStep.step)?state.changeStep.step:null,
        dataExist : state.dataExist.data,
        tutorState : tutorState,
        formInfo:formInfo,
        submitInfo:submitInfo
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleChangeStep: (data) => { dispatch(actions.changeStep(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleChangeViewBtn: (data) => { dispatch(actions.btnManagement(data))},
        handleChangeComputeItem: (data) => { dispatch(actions.computeItem(data))},
        handleChangeClickCity: (data) => { dispatch(actions.clickCityList(data))},
        handleUserInfo: (data) => { dispatch(actions.userInfo(data))},
        handleSearchValue: (data,value) => {dispatch(actions.searchValue(data,value))},
        handleChangeRegion: (data) => {dispatch(actions.changeRegion(data))},
        handleSelectOrg: (data) => { dispatch(actions.selectOrganiz(data))},
        handleUserRole: (data) => { dispatch(actions.showUserRole(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        // handleCreatingSpinner: (data) => { dispatch(actions.creatingSpinner(data))},
        handleDetail: (data) => { dispatch(actions.changeDetail(data))},
        handleRoleInfo: (data) => { dispatch(actions.roleInfo(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFour)));
