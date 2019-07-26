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
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import './siteThree.css';
import {GridLoader, PulseLoader, ClipLoader} from "react-spinners";
import HeaderGlobalMini from '../container/headerGlobalMini';

//pages
import SiteFourPageFlavor from './siteFour_page_flavor';
import SiteFourPageUser from './siteFour_page_user';
import SiteFourPageAccount from './siteFour_page_account';
import SiteFourPageCluster from './siteFour_page_cluster';
import SiteFourPageApps from './siteFour_page_apps';
import SiteFourPageAppInst from './siteFour_page_appinst';
import SiteFourPageClusterInst from './siteFour_page_clusterinst';
import SiteFourPageCloudlet from './siteFour_page_cloudlet';
import SiteFourPageOrganization from './siteFour_page_organization';
import SiteFourPageAppReg from './siteFour_page_appReg';
import SiteFourPageAppInstReg from './siteFour_page_appInstReg';
import SiteFourPageCreateorga from './siteFour_page_createOrga';

import SiteFourPageClusterInstReg from './siteFour_page_clusterInstReg';

import * as Service from '../services/service_login_api';
import * as computeService from '../services/service_compute_service';

import Alert from 'react-s-alert';


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
                { key: 3, text: 'EU', value: 'EU' }
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
            tableHeaders: []
        };
        //this.controllerOptions({controllerRegions})
        this.headerH = 70;
        this.menuW = 240;
        this.hgap = 0;
        this.OrgMenu = [
            {label:'Organizations', icon:'people', pg:0},
            {label:'Users', icon:'dvr', pg:1},
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
    PopupExampleFlowing = () => (
        <Popup trigger={<Button>Show flowing popup</Button>} flowing hoverable>
            <Grid centered divided columns={3}>
                <Grid.Column textAlign='center'>
                    <Header as='h4'>Basic Plan</Header>
                    <p>
                        <b>2</b> projects, $10 a month
                    </p>
                    <Button>Choose</Button>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                    <Header as='h4'>Business Plan</Header>
                    <p>
                        <b>5</b> projects, $20 a month
                    </p>
                    <Button>Choose</Button>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                    <Header as='h4'>Premium Plan</Header>
                    <p>
                        <b>8</b> projects, $25 a month
                    </p>
                    <Button>Choose</Button>
                </Grid.Column>
            </Grid>
        </Popup>
    )

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
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
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
        _self.props.history.location.search = "pg="+pg;
        _self.setState({ page:'pg='+pg, activeItem: label, headerTitle:label })
        localStorage.setItem('selectMenu', label)
    }

    onHandleRegistry() {
        if(localStorage.selectMenu === 'Organizations') {
            this.setState({page:'pg=newOrg'})
            this.gotoUrl('/site4', 'pg=newOrg')
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
        console.log('receive user info ---', result.data)
        _self.props.handleUserInfo(result.data);
    }
    receiveResult(result) {
        console.log("controllerList",result.data);
        //this.setState({ controllerRegions:result.data })
        _self.controllerOptions(result.data);
    }
    receiveAdminInfo = (result) => {
        console.log("adminInfo@@@",result.data,this.props,this.state);
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

    openModalCreate() {

    }
    getAdminInfo(token) {
        console.log("showrole@@@@@@")
        Service.getCurrentUserInfo('currentUser', {token:token}, this.receiveCurrentUser, this);
        computeService.getMCService('showController', {token:token}, this.receiveResult, this);
        computeService.getMCService('ShowRole',{token:token}, this.receiveAdminInfo)
        computeService.getMCService('Version',{token:token}, this.receiveVersion, this)
    }
    componentWillMount() {
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
        this.setState({contWidth:(window.innerWidth-this.menuW)})
        //this.selectedfilters = [];

    }
    componentDidMount() {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        console.log("stateProps@@",this.props,this.state)
        console.log('store.. ', store.user)
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
        
        this.getAdminInfo(store.userToken);
        setTimeout(() => {
            let elem = document.getElementById('animationWrapper')
            if(elem){ 
                //_self.makeGhost(elem, _self)
            }
        }, 4000)


    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        this.setState({contWidth:(window.innerWidth-this.menuW)})
        this.setState({userToken: nextProps.userToken})
        this.setState({userName: (nextProps.userInfo && nextProps.userInfo.info) ? nextProps.userInfo.info.Name : null})
        if(nextProps.params && nextProps.params.subPath) {
            this.setState({page:nextProps.params.subPath})
        }

        // if(localStorage.selectRole && this.state.menuClick) {
        //     console.log("Dddfdfdfdfdfdf")
        //     this.disableBtn();
        //     this.setState({menuClick:false})
        // }

        

        // if(nextProps.creatingSpinner && this.state.toggleState) {
        //     this.getIntervalData();
        //     this.setState({toggleState:false})
        // }

        if(nextProps.viewMode){
            console.log("viewmode@@@",nextProps.viewMode)
            this.setState({viewMode:nextProps.viewMode})
        } else {
            this.setState({viewMode:'listView'})
        }
        // if(nextProps.params.subPath && this.state.viewMode == 'detailView') {
        //     console.log("viewMode!!!@")
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
    }

    componentDidUpdate() {
        if(localStorage.selectRole && this.state.menuClick) {
            this.disableBtn();
            this.setState({menuClick:false})
        }
    }

    //compute page menu view
    menuItemView = (item, i, activeItem) => (
        <Menu.Item
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
        console.log('region change...', value)
        _self.props.handleChangeRegion(value)

    }

    computeRefresh = () => {
        //window.location.reload()
        this.props.handleLoadingSpinner(true);
        this.props.handleComputeRefresh(true)
    }
    disableBtn = () => {
        const menuArr = ['Organization','Users','Cloudlets','Flavors','Cluster Instances','Apps','App Instances']
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
    selectFilter = (a, {name, value}) => {
        this.setState({showItem:true})
    }
    selectFilterItem = (a, {name, value}) => {
        this.setState({showItem:true})
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
    DropdownIconFilter = () => (
        <Dropdown text='Filter' icon='filter' floating labeled button fluid multiple onClick={this.selectFilter}>
            {
                (this.state.showItem)?
                    <Dropdown.Menu>
                        {
                            this.state.tableHeaders.map((item, i) => (
                                <Dropdown.Item icon='attention' text='Important' name='name1' value={1} onClick={this.selectFilterItem}/>
                            ))
                        }

                    </Dropdown.Menu>
                    :
                    null
            }

        </Dropdown>
    )

    render() {
        const {shouldShowBox, shouldShowCircle, viewMode } = this.state;
        const { activeItem, controllerRegions } = this.state
        console.log('viewMode!!!',viewMode)
        return (
            <Grid className='view_body'>
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
                    <span className={this.props.loadingSpinner ? '' : 'loading'} style={{fontSize:'22px', color:'#70b2bc'}}>Loading...</span>
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
                    <span className={this.props.creatingSpinner ? '' : 'loading'} style={{fontSize:'22px', color:'#70b2bc'}}>Creating...</span>
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
                        <div style={{cursor:'pointer', display:'none'}} onClick={() => console.log('')}>
                            <MaterialIcon icon={'notifications_none'} />
                        </div>
                        <Popup
                            trigger={<div style={{cursor:'pointer', display:'none'}} onClick={() => console.log('')}>
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
                <Grid.Row className='view_contents'>
                    <Grid.Column style={{height:this.state.bodyHeight}} className='view_left'>
                        <Menu secondary vertical className='view_left_menu org_menu'>
                            {
                                this.OrgMenu.map((item, i)=>(
                                    (item.label == 'Accounts' && localStorage.selectRole !== 'AdminManager') ? null
                                    : (localStorage.selectRole == 'AdminManager') ? this.menuItemView(item, i, localStorage.selectMenu)
                                    : this.menuItemView(item, i, localStorage.selectMenu)
                                ))
                            }
                            <Grid.Row>
                                <Segment>
                                    <Grid>
                                        <Grid.Row columns={2}>
                                            <Grid.Column width={11} style={{lineHeight:'24px'}}>
                                                {
                                                    (localStorage.selectRole == 'AdminManager') ? localStorage.selectRole : localStorage.selectOrg
                                                }  
                                            </Grid.Column>
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
                                                                                <div></div>
                                                    }
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            </Grid.Row>
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
                <Container className='contents_body_container' style={{width:this.state.contWidth, top:this.headerH, left:this.menuW}}>
                <Grid.Row  className='view_contents' style={{minWidth:1024-this.menuW}}>
                    <Grid.Column style={{height:this.state.bodyHeight}} className='contents_body'>
                        <Grid.Row className='content_title' style={{width:'fit-content', display:'inline-block'}}>
                            <Grid.Column className='title_align' style={{lineHeight:'36px'}}>{this.state.headerTitle}</Grid.Column>
                            {
                                (this.props.location.search !== 'pg=1' && this.props.location.search !== 'pg=101') ?
                                <Grid.Column className='title_align'>
                                    <Item style={{marginLeft:20, marginRight:10}}>
                                        <Button color='teal' disabled={this.props.viewBtn.onlyView} onClick={() => this.onHandleRegistry()}>New</Button>
                                    </Item>
                                </Grid.Column>
                                : null
                            }
                            {
                                (viewMode === 'detailView') ?
                                <Grid.Column className='title_align'>
                                    <Button onClick={()=>this.props.handleDetail({data:null, viewMode:'listView'})}>Close Details</Button>
                                </Grid.Column>
                                : null
                            }
                            {
                                //filtering for column of table
                                (viewMode !== 'detailView') ?
                                <Grid.Column>
                                    {/*<div>{this.DropdownIconFilter()}</div>*/}
                                </Grid.Column>
                                :
                                null
                            }

                            <div style={{position:'absolute', top:25, right:25}}>
                                {this.getHelpPopup(this.state.headerTitle)}
                            </div>

                        </Grid.Row>
                        {
                            (this.state.headerTitle !== 'Organizations' && this.state.headerTitle !== 'Users' && this.state.headerTitle !== 'Accounts') ?
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
                            (this.state.headerTitle == 'Users') ?
                            <div className='user_search' style={{top:15, right:65, position:'absolute',zIndex:99}}>
                                <Input icon='search' placeholder={'Search '+this.state.searchChangeValue} style={{marginRight:'20px'}}  onChange={this.searchClick} />
                                <Dropdown defaultValue={this.searchOptions[0].value} search selection options={this.searchOptions} onChange={this.searchChange} />
                            </div>
                            : null
                        }
                        <Grid.Row className='site_content_body' style={{height:'100%'}}>
                            <Grid.Column style={{height:'100%'}}>
                                <ContainerDimensions>
                                    { ({ width, height }) =>
                                        <div className="table-no-resized" style={{width:width, height:height, display:'flex', overflow:'hidden'}}>
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
                                                (this.state.page === 'pg=createAppInst')? <SiteFourPageAppInstReg></SiteFourPageAppInstReg> :
                                                (this.state.page === 'pg=createClusterInst')? <SiteFourPageClusterInstReg></SiteFourPageClusterInstReg> : <div> </div>
                                            }
                                        </div>
                                    }
                                </ContainerDimensions>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>
                </Container>
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
        tableHeaders : (state.tableHeader)? state.tableHeader.headers : null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
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
