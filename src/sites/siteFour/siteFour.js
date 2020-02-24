import React from 'react';
import {
    Button,
    Container,
    Dropdown,
    Grid,
    Header,
    Icon,
    Image,
    Input,
    Label,
    Menu,
    Modal,
    Popup,
    Segment
} from 'semantic-ui-react';
import sizeMe from 'react-sizeme';

import {withRouter} from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import {Motion, spring} from "react-motion";
import {Hints, Steps} from 'intro.js-react';
//redux
import {connect} from 'react-redux';
import * as actions from '../../actions';

import {ClipLoader, GridLoader} from "react-spinners";
import HeaderGlobalMini from '../../container/headerGlobalMini';
//pages
import SiteFourPageFlavor from './flavors/siteFour_page_flavor';
import SiteFourPageUser from './userRole/siteFour_page_user';
import SiteFourPageAccount from './accounts/siteFour_page_account';
import SiteFourPageApps from './apps/siteFour_page_apps';
import SiteFourPageAppInst from './appInst/siteFour_page_appinst';
import SiteFourPageClusterInst from './clusterInst/siteFour_page_clusterinst';
import SiteFourPageCloudlet from './cloudlets/siteFour_page_cloudlet';
import SiteFourPageCloudletReg from './cloudlets/siteFour_page_cloudletReg';
import SiteFourPageFlavorReg from './flavors/siteFour_page_flavorReg';
import SiteFourPageOrganization from './organization/siteFour_page_organization';
import SiteFourPageAppReg from './apps/siteFour_page_appReg';
import SiteFourPageAppInstReg from './appInst/siteFour_page_appInstReg';
import SiteFourPageCreateorga from './organization/siteFour_page_createOrga';
import SiteFourPageAudits from './audits/siteFour_page_audits';
import SiteFourPageClusterInstReg from './clusterInst/siteFour_page_clusterInstReg';
import SiteFourPageCloudletPool from './cloudletPool/siteFour_page_cloudletPool';
import SiteFourPageCloudletPoolReg from './cloudletPool/siteFour_page_cloudletPoolReg';
import SiteFourPageLinkOrganizeReg from './cloudletPool/siteFour_page_linkOrganizeReg';
import SiteFourPageCloudletPoolUpdate from './cloudletPool/siteFour_page_cloudletPoolUpdate';
import PageMonitoringMain from './monitoring/PageMonitoringMain'
import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import AutoProvPolicy from './policy/autoProvPolicy';
import AutoPrivacyPolicy from './policy/autoPrivacyPolicy';
import AutoPrivacyPolicyReg from './policy/autoPrivacyPolicyReg';
import SiteFourAutoProvPolicyReg from './policy/autoProvPolicyReg';


import PopLegendViewer from '../../container/popLegendViewer';
import * as serviceMC from '../../services/serviceMC';
import * as reducer from '../../utils'

import {CloudletTutor, organizationTutor} from '../../tutorial';

import Alert from 'react-s-alert';

import '../../css/introjs.css';
import '../../css/introjs-dark.css';
import PageDevMonitoring from "./monitoring/dev/PageDevMonitoring";
import PageOperMonitoring from "./monitoring/oper/PageOperMonitoring";
import PageModalMonitoring from "./monitoring/components/PageModalMonitoring";
import PageAdminMonitoring from "./monitoring/admin/PageAdminMonitoring";

let defaultMotion = {left: window.innerWidth / 2, top: window.innerHeight / 2, opacity: 1}

const orgaSteps = organizationTutor();
const cloudletSteps = CloudletTutor();
let _self = null;

const autoPolicy = [
    {key: 'Auto Provisioning Policy', text: 'Auto Provisioning Policy', value: 'Auto Provisioning Policy'},
    {key: 'Privacy Policy', text: 'Privacy Policy', value: 'Privacy Policy'}
]

class SiteFour extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight: 0,
            contWidth: 0,
            bodyHeight: 0,
            headerTitle: '',
            activeItem: 'Organizations',
            page: 'pg=0',
            email: store ? store.email : 'Administrator',
            role: '', //db에서
            onlyView: false,
            userToken: null,
            profileViewData: null,
            userName: '',
            controllerRegions: null,
            regions: [
                {key: 1, text: 'All', value: 'All'},
            ],
            nextPosX: window.innerWidth / 2,
            nextPosY: window.innerHeight / 2,
            nextOpacity: 1,
            setMotion: defaultMotion,
            OrganizationName: '',
            adminShow: false,
            createState: '',
            noData: false,
            viewMode: 'listView',
            toggleDisable: true,
            currentVersion: 'v-',
            searchChangeValue: 'Username',
            menuClick: false,
            showItem: false,
            learned: false,
            stepsEnabled: false,
            initialStep: 0,
            steps: [],
            autoPolicy: localStorage.getItem('autoPolicy') ? localStorage.getItem('autoPolicy') : 'Auto Provisioning Policy',
            openLegend: false,

            enable: false,
            hideNext: true,
            camBtnStat: 'leave',
            regionToggle: false,
            intoCity: false,
            currentPage: null,
            fullPage: null,
            menuW: 240,
            hideLeftMenu: false,
            animate: false,
        };

        this.headerH = 70;
        //this.menuW = 240;
        this.hgap = 0;
        this.OrgMenu = [
            {label: 'Organizations', icon: 'people', pg: 0},
            {label: 'Users & Roles', icon: 'assignment_ind', pg: 1},
            {label: 'Accounts', icon: 'dvr', pg: 101}
        ]
        this.menuItemsAll = [ //admin menu
            {label: 'Cloudlets', icon: 'cloud_queue', pg: 2},
            {label: 'Cloudlet Pools', icon: 'cloud_circle', pg: 7},
            {label: 'Flavors', icon: 'free_breakfast', pg: 3},
            {label: 'Cluster Instances', icon: 'storage', pg: 4},
            {label: 'Apps', icon: 'apps', pg: 5},
            {label: 'App Instances', icon: 'sports_esports', pg: 6},
            {label: 'Monitoring', icon: 'tv', pg: 'Monitoring'},
            {label: 'Policies', icon: 'playlist_play', pg: 8},
            {label: 'Audit Logs', icon: 'check', pg: 'audits'}
        ]
        this.menuItems = [ //developer menu
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Cloudlets'),
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Flavors'),
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Cluster Instances'),
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Apps'),
            reducer.getFindIndex(this.menuItemsAll, 'label', 'App Instances'),
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Monitoring'),
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Policies'),
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Audit Logs'),
        ]

        this.menuArr = ['Organization', 'User Roles', 'Cloudlets', 'Cloudlet Pools', 'Flavors', 'Cluster Instances', 'Apps', 'App Instances']
        this.auth_three = [ //operator menu
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Cloudlets'),
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Monitoring'),
            reducer.getFindIndex(this.menuItemsAll, 'label', 'Audit Logs'),
        ] //OperatorManager, OperatorContributor, OperatorViewer

        this.auth_list = [
            {role: 'AdminManager', view: []},
            {role: 'DeveloperManager', view: [2, 3]},
            {role: 'DeveloperContributor', view: [1, 2, 3]},
            {role: 'DeveloperViewer', view: [1, 2, 3, 5, 6, 7]},
            {role: 'OperatorManager', view: []},
            {role: 'OperatorContributor', view: [1]},
            {role: 'OperatorViewer', view: [1, 2]}
        ]
        this.searchOptions = [
            {
                key: 'Username',
                text: 'Username',
                value: 'Username'
            },
            {
                key: 'Organization',
                text: 'Organization',
                value: 'Organization'
            }
        ]

        this.speed = {stiffness: 500, damping: 100}
        this.speedOpacity = {stiffness: 500, damping: 100}

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
            state: {some: 'state'}
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath: mainPath, subPath: subPath})
    }

    gotoUrl(site, subPath) {
        let mainPath = site;
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath: mainPath, subPath: subPath})
        _self.setState({page: subPath})
    }

    handleItemClick(id, label, pg, role) {
        localStorage.setItem('selectMenu', label)
        _self.setState({menuClick: true})
        _self.props.handleDetail({data: null, viewMode: 'listView'})
        _self.props.handleChangeViewBtn(false);
        _self.props.handleChangeClickCity([]);
        _self.props.handleChangeComputeItem(label);
        _self.props.handleSearchValue('')
        _self.props.handleChangeRegion('All')
        _self.props.history.push({
            pathname: '/site4',
            search: "pg=" + pg
        });
        let mainPath = '/site4';
        let subPath = 'pg=' + pg;
        _self.props.history.location.search = "pg=" + pg;
        _self.props.handleChangeStep(pg)
        _self.setState({page: 'pg=' + pg, activeItem: label, headerTitle: label, intoCity: false})
    }


    onHandleRegistry() {
        if (localStorage.selectMenu === 'Organizations') {
            this.setState({page: 'pg=newOrg'})
            this.gotoUrl('/site4', 'pg=newOrg')
        } else if (localStorage.selectMenu === 'Cloudlets') {
            this.setState({page: 'pg='})
            this.gotoUrl('/site4', 'pg=createCloudlet')
        } else if (localStorage.selectMenu === 'Apps') {
            this.setState({page: 'pg=createApp'})
            this.gotoUrl('/site4', 'pg=createApp')
        } else if (localStorage.selectMenu === 'App Instances') {
            this.setState({page: 'pg=createAppInst'})
            this.gotoUrl('/site4', 'pg=createAppInst')
        } else if (localStorage.selectMenu === '') {
            this.setState({page: 'pg=createAppInst'})
            this.gotoUrl('/site4', 'pg=createAppInst')
        } else if (localStorage.selectMenu === 'Flavors') {
            this.setState({page: 'pg=createFlavor'})
            this.gotoUrl('/site4', 'pg=createFlavor')
        } else if (localStorage.selectMenu === 'Cluster Instances') {
            this.setState({page: 'pg=createClusterInst'})
            this.gotoUrl('/site4', 'pg=createClusterInst')
        } else if (localStorage.selectMenu === 'Cloudlet Pools') {
            this.setState({page: 'pg=createCloudletPool'})
            this.gotoUrl('/site4', 'pg=createCloudletPool')
        } else if (localStorage.selectMenu === 'Policies') {
            let pg = this.state.autoPolicy === 'Auto Provisioning Policy' ? 'createPolicy' : 'createPrivacyPolicy';
            this.setState({page: `pg=${pg}`})
            this.gotoUrl('/site4', `pg=${pg}`)
        } else {
            this.props.handleInjectDeveloper('newRegist');
        }
        this.props.handleChangeClickCity([])
        this.setState({intoCity: false})
    }

    receiveControllerResult(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                _self.props.handleLoadingSpinner();
                _self.controllerOptions(response.data);
            }
        }
    }

    receiveAdminInfo = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                this.props.handleRoleInfo(response.data)
                response.data.map((item, i) => {
                    if (item.role.indexOf('Admin') > -1) {
                        this.setState({adminShow: true});
                        localStorage.setItem('selectRole', item.role)
                    }
                })
            }
        }
    }


    controllerOptions(option) {
        let arr = []
        if (option) {
            option.map((item) => {
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
                    <Image wrapped size='medium' src='/images/avatar/large/rachel.png'/>
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

    getHelpPopup = (key) => (
        <Popup
            trigger={<Icon name='question circle outline' size='small' style={{marginTop: 0, paddingLeft: 10}}/>}
            content=
                {(key == 'Cloudlets') ? 'A Cloudlet is a set of compute resources at a particular location, provided by an Operator.'
                    : (key == 'Cluster Instances') ? 'ClusterInst is an instance of a Cluster on a Cloudlet. It is defined by a Cluster, Cloudlet, and Developer key.'
                        : (key == 'Apps') ? 'App belongs to developers and is used to provide information about their application.'
                            : (key == 'App Instances') ? 'AppInst is an instance of an App on a Cloudlet where it is defined by an App plus a ClusterInst key. Many of the fields here are inherited from the App definition.'
                                : key
                }
            inverted
        />
    )

    enalbeSteps = () => {
        let enable = false;
        let currentStep = null;

        if (this.props.viewMode === 'detailView') return;

        let site = this.props.siteName;
        let userName = (this.props.userInfo && this.props.userInfo.info) ? this.props.userInfo.info.Name : '';
        if (this.props.params.mainPath === "/site4" && this.props.params.subPath === "pg=newOrg") {
            if (this.props.changeStep === '02') {
                currentStep = orgaSteps.stepsNewOrg2;
            } else if (this.props.changeStep === '03') {
                currentStep = orgaSteps.stepsNewOrg3;
            } else {
                currentStep = orgaSteps.stepsNewOrg;
            }


            enable = true;
        } else if (this.props.params.subPath === "pg=0") {
            if (this.props.dataExist) {
                if (localStorage.selectRole === 'AdminManager') {
                    currentStep = orgaSteps.stepsOrgDataAdmin;
                } else {
                    currentStep = orgaSteps.stepsOrgDataDeveloper;
                }
            } else {
                if (localStorage.selectRole === 'AdminManager') {
                    currentStep = orgaSteps.stepsOrgAdmin;
                } else {
                    currentStep = orgaSteps.stepsOrgDeveloper;
                }
            }

            enable = true;
        } else if (this.props.params.subPath === "pg=2") {
            //Cloudlets
            if (localStorage.selectRole === 'DeveloperManager' || localStorage.selectRole === 'DeveloperContributor' || localStorage.selectRole === 'DeveloperViewer') {
                currentStep = cloudletSteps.stepsCloudletDev;
            } else {
                currentStep = cloudletSteps.stepsCloudlet;
            }
            enable = true;
        } else if (this.props.params.subPath === "pg=3") {
            //Flavors
            currentStep = orgaSteps.stepsFlavors;
            enable = true;
        } else if (this.props.params.subPath === "pg=4") {
            //Cluster Instances
            currentStep = orgaSteps.stepsClusterInst;
            enable = true;
        } else if (this.props.params.subPath === "pg=5") {
            //Apps
            currentStep = orgaSteps.stepsApp;
            enable = true;
        } else if (this.props.params.subPath === "pg=6") {
            //App Instances
            currentStep = orgaSteps.stepsAppInst;
            enable = true;
        } else if (this.props.params.subPath === "pg=createClusterInst") {
            currentStep = orgaSteps.stepsClusterInstReg;
            enable = true;
        } else if (this.props.params.subPath === "pg=createApp") {
            currentStep = orgaSteps.stepsCreateApp;
            enable = true;
        } else if (this.props.params.subPath === "pg=createAppInst") {
            currentStep = orgaSteps.stepsCreateAppInst;
            enable = true;
        } else if (this.props.params.subPath === "pg=createCloudlet") {
            currentStep = cloudletSteps.stepsCloudletReg;
            enable = true;
        } else if (this.props.params.subPath === "pg=createFlavor") {
            currentStep = orgaSteps.stepsCreateFlavor;
            enable = true;
        }

        this.setState({steps: currentStep})

        let elmentName = (this.steps) ? currentStep : null;
        //this.steps.props.options.hideNext = true;
        let element = (elmentName) ? document.getElementsByClassName(elmentName[0].element.replace('.', '')) : [];
        if (enable) {
            console.log("elementelement111", element)
            this.setState({stepsEnabled: true, enable: true})
        }

    }

    getAdminInfo(token) {
        serviceMC.sendRequest(_self, {token: token, method: serviceMC.getEP().SHOW_CONTROLLER}, this.receiveControllerResult);
        serviceMC.sendRequest(_self, {token: token, method: serviceMC.getEP().SHOW_ROLE}, this.receiveAdminInfo)
        _self.setState({currentVersion: process.env.REACT_APP_BUILD_VERSION ? process.env.REACT_APP_BUILD_VERSION : 'v0.0.0'})
    }

    onClickBackBtn = () => {
        this.setState({intoCity: false})
        this.props.handleChangeClickCity([]);
        this.props.handleResetMap('back')

    }

    componentWillMount() {

    }

    componentDidMount() {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        this.setState({activeItem: (localStorage.selectMenu) ? localStorage.selectMenu : 'Organizations', headerTitle: (localStorage.selectMenu) ? localStorage.selectMenu : 'Organizations'})

        this.disableBtn();

        if (store) {
            this.getAdminInfo(store.userToken);
        } else {
            this.gotoUrl('/logout')
        }
        setTimeout(() => {
            let elem = document.getElementById('animationWrapper')
            if (elem) {
            }
        }, 4000)

        this.setState({steps: orgaSteps.stepsZero, intoCity: false});
        //
        if (this.props.params.subPath !== 'pg=audits') {
            this.getDataAudit();
        }

    }

    componentWillReceiveProps(nextProps, nextContext) {
        try {
            this.setState({bodyHeight: (window.innerHeight - this.headerH)})
            this.setState({contHeight: (nextProps.size.height - this.headerH) / 2 - this.hgap})
            this.setState({contWidth: (window.innerWidth - this.state.menuW)})
            this.setState({userToken: nextProps.userToken})
            this.setState({userName: (nextProps.userInfo && nextProps.userInfo.info) ? nextProps.userInfo.info.Name : null})
        } catch (e) {

        }
        if (nextProps.selectedOrg) {
            this.setState({selectOrg: nextProps.selectedOrg})
        }

        if (nextProps.params && nextProps.params.subPath) {
            let subPaths = nextProps.params.subPath;
            let subPath = '';
            let subParam = '';
            if (subPaths.indexOf('&org=')) {
                let paths = subPaths.split('&')
                subPath = paths[0];
                subParam = paths[1];
            }
            this.setState({page: subPath, OrganizationName: subParam})

        }

        if (nextProps.viewMode) {
            this.setState({viewMode: nextProps.viewMode})
        } else {
            this.setState({viewMode: 'listView'})
        }

        if ((nextProps.alertInfo !== this.props.alertInfo) && nextProps.alertInfo.mode) {
            Alert.closeAll();
            if (nextProps.alertInfo.mode === 'success') {

                Alert.success(nextProps.alertInfo.msg, {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 5000,
                    offset: 100
                });
            } else if (nextProps.alertInfo.mode === 'error') {
                Alert.error(nextProps.alertInfo.msg, {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 5000,
                    offset: 100,
                    html: true
                });
                //return(<MexMessage open={true} info={{error:400,message:nextProps.alertInfo.msg}}/>)


            }
            nextProps.handleAlertInfo('', '');
        }

        //set filters
        if (nextProps.tableHeaders) {
            this.setState({showItem: false})
            if (nextProps.tableHeaders.length) {
                this.setState({tableHeaders: nextProps.tableHeaders})
            } else {

            }
        }

        // set step value of guide

        // saved tutorial
        let tutorial = localStorage.getItem('TUTORIAL')

        let formKey = Object.keys(nextProps.formInfo);
        //let submitSucceeded = (nextProps.formInfo) ? nextProps.formInfo[formKey[0]]['submitSucceeded']: null
        if (formKey.length) {
            if (nextProps.formInfo[formKey[0]]['submitSucceeded']) {
                if (nextProps.formInfo[formKey[0]]['submitSucceeded'] === true) {
                    _self.setState({stepsEnabled: false})
                }
            }
        }
        if (tutorial === 'done') {
            //_self.setState({stepsEnabled:false})
        }
        //
        let enable = true;
        setTimeout(() => {
            let elem = document.getElementById('animationWrapper')
            if (elem) {
                //_self.makeGhost(elem, _self)

            }
            if (enable && !_self.state.learned && !tutorial) {
                _self.enalbeSteps();
                _self.setState({stepsEnabled: true, learned: true})
                localStorage.setItem('TUTORIAL', 'done')
            }

        }, 1000)

        let site = this.props.siteName;
        if (!this.props.changeStep || this.props.changeStep === '02') {
            this.setState({enable: true})
        } else {
            this.setState({enable: false})
        }


        //{ key: 1, text: 'All', value: 'All' }
        if (nextProps.regionInfo.region.length && !this.state.regionToggle) {

            let getRegions = []
            _self.setState({regionToggle: true})
            if (nextProps.regionInfo.region) {
                nextProps.regionInfo.region.map((region, i) => {
                    getRegions.push({key: i + 2, text: region, value: region})
                })
            }
            let newRegions = Object.assign([], _self.state.regions).concat(getRegions)
            _self.setState({regions: newRegions})

        }
        if (nextProps.clickCity.length > 0) {
            this.setState({intoCity: true})
        } else {
            this.setState({intoCity: false})
        }

        //set category
        if (nextProps.detailData !== this.props.detailData) {
            // alert(JSON.stringify(nextProps.detailData))
            this.setState({detailData: nextProps.detailData})
        }

    }


    componentDidUpdate() {
        if (localStorage.selectRole && this.state.menuClick) {
            this.disableBtn();
            this.setState({menuClick: false})
        }
    }

    componentWillUnmount() {
        this.setState({learned: false})
    }

    //compute page menu view
    menuItemView = (item, i, activeItem) => (
        <Menu.Item
            className={'leftMenu_' + item.label}
            key={i}
            name={item.label}
            active={activeItem === item.label}
            onClick={() => this.handleItemClick(i, item.label, item.pg, localStorage.selectRole)}
        >
            <div className="left_menu_item">
                <MaterialIcon icon={item.icon}/>
                <div className='label'>{item.label}</div>
                {(activeItem === item.label) ?
                    <div style={{position: 'absolute', right: '12px', top: '12px'}}>
                        <ClipLoader
                            size={20}
                            sizeUnit={'px'}
                            color={'rgba(136,221,0,.85)'}
                            loading={this.props.loadingSpinner}
                            // loading={true}
                        />
                        {(item.label === 'Audit Log' && this.props.audit > 0) ?
                            <Label circular color={'red'} key={'red'}>
                                {this.props.audit}
                            </Label> : null}
                    </div>

                    : null}


                <div style={{position: 'absolute', right: '12px', top: '12px'}}>
                    {(item.label === 'Audit Log' && this.props.audit > 0) ?
                        <Label circular color={'red'} key={'red'}>
                            {this.props.audit}
                        </Label> : null}
                </div>

            </div>

        </Menu.Item>
    )

    searchClick = (e) => {
        this.props.handleSearchValue(e.target.value, this.state.searchChangeValue)
    }

    makeGhost(elem, self) {

        let child = document.createElement('div')
        child.style.cssText = 'position:absolute; width:100px; height:30px; line-height:30px; text-align:center; opacity:0.8; left:0px; z-index:100; background:#aaaaaa; border-radius:5px';
        child.innerHTML = '<div>Cloudlet Name</div>'
        elem.appendChild(child);
        //
        let nextPosX = 15
        let nextPosY = 90;
        setTimeout(() => self.setState({setMotion: {left: spring(nextPosX, self.speed), top: spring(nextPosY, self.speed), position: 'absolute', opacity: 0}}), 200);
    }

    resetMotion() {
        let self = _self;
        this.setState({setMotion: defaultMotion})
        let nextPosX = 15
        let nextPosY = 180;
        setTimeout(() => self.setState({setMotion: {left: spring(nextPosX, self.speed), top: spring(nextPosY, self.speed), position: 'absolute', opacity: spring(0, self.speedOpacity)}}), 500);
    }

    onChangeRegion = (e, {value}) => {

        _self.props.handleChangeRegion(value)
    }

    computeRefresh = () => {
        //this.props.handleLoadingSpinner(true);
        this.props.handleComputeRefresh(true);
    }
    disableBtn = () => {
        this.auth_list.map((item, i) => {
            if (item.role == localStorage.selectRole) {
                item.view.map((view) => {
                    if (this.menuArr[view] == localStorage.selectMenu) {
                        this.props.handleChangeViewBtn(true);
                    }
                })
            }
        })


    }

    searchChange = (e, {value}) => {
        this.setState({searchChangeValue: value})
        this.props.handleSearchValue(this.props.searchValue, value)
    }


    options = [
        {
            key: 1,
            text: 'Mobile',
            value: 1,
            content: <Header icon='mobile' content='Mobile' subheader='The smallest size'/>,
        },
        {
            key: 2,
            text: 'Tablet',
            value: 2,
            content: <Header icon='tablet' content='Tablet' subheader='The size in the middle'/>,
        },
        {
            key: 3,
            text: 'Desktop',
            value: 3,
            content: <Header icon='desktop' content='Desktop' subheader='The largest size'/>,
        },
    ]

    onExit() {
        _self.setState({stepsEnabled: false})
    }

    orgTypeLegendShow = () => {
        _self.setState({openLegend: true})
    }
    closeLegend = () => {
        this.setState({openLegend: false})
    }


    /**
     * audit
     * */
    reduceAuditCount(all, data) {
        let itemArray = [];
        let addArray = [];
        let savedArray = localStorage.getItem('auditUnChecked');
        let checkedArray = localStorage.getItem('auditChecked');
        let checked = [];
        all.map((item, i) => {
            if (savedArray && JSON.parse(savedArray).length) {
                //이전에 없던 데이터 이면 추가하기
                if (JSON.parse(savedArray).findIndex(k => k == item.traceid) === -1) addArray.push(item.traceid)
            } else {
                itemArray.push(item.traceid)
            }
        })

        if (addArray.length) {
            JSON.parse(savedArray).concat(addArray);
        }


        // 이제 새로운 데이터에서 체크된 오딧은 제거
        let checkResult = null;

        if (savedArray && JSON.parse(savedArray).length) {
            checkResult = JSON.parse(savedArray);
        } else if (itemArray.length) {
            checkResult = itemArray;
        }

        checked = (checkedArray) ? JSON.parse(checkedArray) : [];
        this.props.handleAuditCheckCount(checkResult.length - checked.length)
        localStorage.setItem('auditUnChecked', JSON.stringify(checkResult))

    }

    receiveResult = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let request = mcRequest.request;
                let checked = localStorage.getItem('auditChecked')
                if (request.method === serviceMC.getEP().SHOW_SELF) {
                    this.reduceAuditCount(response.data, checked)
                }
            }
        }
        this.props.handleLoadingSpinner(false);
    }
    makeOga = (logName) => {
        let lastSub = logName.substring(logName.lastIndexOf('=') + 1);
        return lastSub
    }
    getDataAudit = () => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData: []})
        _self.loadCount = 0;
        serviceMC.sendRequest(_self, {token: store.userToken, method: serviceMC.getEP().SHOW_SELF, data: '{}', showMessage: false}, _self.receiveResult)
    }

    onPolicyChange = (value) => {
        localStorage.setItem('autoPolicy', value)
        this.setState({autoPolicy: value})
    }

    /** audit ********/

    showChildPage = (currentPage) => {
        this.setState({
            currentPage: currentPage
        })
    }

    showFullPage = (fullPage) => {
        this.setState({
            fullPage: fullPage
        })
    }


    render() {
        const {shouldShowBox, shouldShowCircle, viewMode} = this.state;
        const {stepsEnabled, initialStep, hintsEnabled, hints, steps} = this.state;
        return (
            this.state.fullPage ?
                this.state.fullPage
                :
                <Grid className='view_body'>
                    {steps ?
                        <Steps
                            enabled={stepsEnabled}
                            steps={steps}
                            initialStep={initialStep}
                            onExit={this.onExit}
                            showButtons={true}
                            options={{hideNext: false}}
                            ref={steps => (this.steps = steps)}
                        /> : null}
                    {hints ?
                        <Hints
                            enabled={hintsEnabled}
                            hints={hints}
                        /> : null}
                    {(this.props.loadingSpinner == true) ?
                        <div className="loadingBox" style={{zIndex: 9999}}>
                            <GridLoader
                                sizeUnit={"px"}
                                size={25}
                                color={'#70b2bc'}
                                loading={this.props.loadingSpinner}
                            />
                        </div> : null}
                    <Grid.Row className='gnb_header'>
                        <Grid.Column width={6} className='navbar_left'>
                            <Header>
                                <Header.Content onClick={() => this.gotoPreview('/site1')} className='brand'/>
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={10} className='navbar_right'>
                            <div className='navbar_icon' onClick={this.computeRefresh}>
                                <RefreshOutlinedIcon fontSize='large'/>
                            </div>
                            <div className='navbar_icon' onClick={() => this.gotoUrl('/site1', 'pg=0')}>
                                <PublicOutlinedIcon fontSize='large'/>
                            </div>
                            <div className='navbar_icon' style={{display: 'none'}}>
                                <MaterialIcon icon={'notifications_none'}/>
                            </div>
                            {
                                (
                                    this.state.page !== 'pg=editApp' &&
                                    this.props.viewMode !== 'detailView' &&
                                    this.state.headerTitle !== 'User Roles' &&
                                    this.state.headerTitle !== 'Accounts' &&
                                    this.state.headerTitle !== 'Flavors'
                                ) ? <div className='navbar_icon' onClick={this.enalbeSteps}>
                                    <HelpOutlineOutlinedIcon fontSize='large'/>
                                </div> : null
                            }
                            <Popup
                                trigger={
                                    <div className='navbar_icon' style={{display: 'none'}}>
                                        <MaterialIcon icon={'add'}/>
                                    </div>
                                }
                                content={this.menuAddItem()}
                                on='click'
                                position='bottom center'
                                className='gnb_logout'
                            />
                            <HeaderGlobalMini email={this.state.email} data={this.props.userInfo.info} dimmer={false}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Container className={['view_left_container', this.state.hideLeftMenu && 'left_menu_hide']} style={{position: 'relative', width: this.state.menuW}}>
                        <Grid.Row className='view_contents'>
                            <Grid.Column className='view_left'>
                                <Menu secondary vertical className='view_left_menu org_menu'>
                                    {/* show name of organization */}
                                    <Grid.Column className="left_org">
                                        <div className="left_org_title">{this.state.hideLeftMenu ? 'Org' : 'Organization'}</div>
                                        <div className="left_org_selected">{localStorage.selectOrg ? localStorage.selectOrg : 'No organization selected'}</div>
                                    </Grid.Column>
                                    {/* show role of user */}
                                    <Grid.Row className="left_authority">
                                        <Segment className="stepOrgDeveloper2">
                                            <Grid>
                                                <Grid.Row style={{cursor: 'pointer'}} onClick={this.orgTypeLegendShow}>
                                                    <Grid.Column>
                                                        {localStorage.selectRole ?
                                                            <div className="markBox">
                                                                {
                                                                    (localStorage.selectRole === 'AdminManager') ? <div className="mark markA markS">S</div>
                                                                        :
                                                                        (localStorage.selectRole === 'DeveloperManager') ?
                                                                            <div className="mark markD markM">M</div>
                                                                            :
                                                                            (localStorage.selectRole === 'DeveloperContributor') ?
                                                                                <div className="mark markD markC">C</div>
                                                                                :
                                                                                (localStorage.selectRole === 'DeveloperViewer') ?
                                                                                    <div className="mark markD markV">V</div>
                                                                                    :
                                                                                    (localStorage.selectRole === 'OperatorManager') ?
                                                                                        <div className="mark markO markM">M</div>
                                                                                        :
                                                                                        (localStorage.selectRole === 'OperatorContributor') ?
                                                                                            <div className="mark markO markC">C</div>
                                                                                            :
                                                                                            (localStorage.selectRole === 'OperatorViewer') ?
                                                                                                <div className="mark markO markV">V</div>
                                                                                                :
                                                                                                <span></span>
                                                                }
                                                            </div>
                                                            : null
                                                        }
                                                        <div>
                                                            {
                                                                localStorage.selectRole && localStorage.selectRole != 'null' ? localStorage.selectRole :
                                                                    <strong style={{fontSize: 12}}>Please select an organization</strong>
                                                            }
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Segment>
                                    </Grid.Row>


                                </Menu>
                                <Menu secondary vertical className='view_left_menu main_menu'>
                                    <div className='menuPart'>
                                        {
                                            this.OrgMenu.map((item, i) => (
                                                (item.label === 'Accounts' && localStorage.selectRole !== 'AdminManager') ? null
                                                    : (localStorage.selectRole === 'AdminManager') ? this.menuItemView(item, i, localStorage.selectMenu)
                                                    : this.menuItemView(item, i, localStorage.selectMenu)
                                            ))
                                        }
                                    </div>

                                    <div className='menuPart'>
                                        {
                                            (localStorage.selectRole === 'AdminManager') ?
                                                this.menuItemsAll.map((item, i) => (
                                                    this.menuItemView(item, i, localStorage.selectMenu)
                                                ))
                                                :
                                                (localStorage.selectRole === 'DeveloperManager' || localStorage.selectRole === 'DeveloperContributor' || localStorage.selectRole === 'DeveloperViewer') ?
                                                    this.menuItems.map((item, i) => (
                                                        this.menuItemView(item, i, localStorage.selectMenu)
                                                    ))
                                                    :
                                                    (localStorage.selectRole === 'OperatorManager' || localStorage.selectRole === 'OperatorContributor' || localStorage.selectRole === 'OperatorViewer') ?
                                                        this.auth_three.map((item, i) => (
                                                            this.menuItemView(item, i, localStorage.selectMenu)
                                                        ))
                                                        :
                                                        null
                                        }
                                    </div>
                                </Menu>
                                <div className='versionView' style={{display: this.state.hideLeftMenu ? 'none' : 'block'}}>
                                    {
                                        (localStorage.selectRole == 'AdminManager') ? this.state.currentVersion : null
                                    }
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <div className='left_menu_hide_button'
                             onClick={() => {

                                 this.setState({hideLeftMenu: !this.state.hideLeftMenu}, () => {

                                     if (this.state.hideLeftMenu) {
                                         this.setState({menuW: 50});
                                     } else {
                                         this.setState({menuW: 240});
                                     }
                                 });

                             }}
                        >
                            {this.state.hideLeftMenu ?
                                <i className="material-icons" style={{color: 'rgba(255,255,255,.6)', fontSize: 20}}>chevron_right</i>
                                : <i className="material-icons" style={{color: 'rgba(255,255,255,.6)', fontSize: 20}}>chevron_left</i>}
                        </div>
                    </Container>
                    <Container className='contents_body_container' style={{top: this.headerH, left: this.state.menuW, width: window.innerWidth - this.state.menuW}}>

                        {(this.state.page === 'pg=Monitoring') ? <PageMonitoringMain/> :
                            (this.state.page === 'pg=PageAdminMonitoring') ? <PageAdminMonitoring/> :
                                (this.state.page === 'pg=PageDevMonitoring') ? <PageDevMonitoring/> :
                                    (this.state.page === 'pg=PageOperMonitoring') ? <PageOperMonitoring/> :
                                            <Grid.Row className='view_contents'>
                                                <Grid.Column className='contents_body'>
                                                    <Grid.Row className='content_title'>
                                                        <div className='content_title_wrap'>
                                                            <div className='content_title_label'>{this.state.headerTitle}</div>
                                                            {
                                                                (viewMode !== 'MexDetailView' && this.state.headerTitle !== 'Organizations' && this.state.headerTitle !== 'User Roles' && this.state.headerTitle !== 'Accounts' && this.state.headerTitle !== 'Audit Log' && viewMode !== 'detailView' && this.state.page.indexOf('create') === -1 && this.state.page.indexOf('edit') == -1 && !this.state.currentPage) ?

                                                                    (this.state.intoCity) ?
                                                                        <Button onClick={this.onClickBackBtn}>Back</Button> :
                                                                        <Dropdown className='selection'
                                                                                  options={this.state.regions}
                                                                                  defaultValue={this.state.regions[0].value}
                                                                                  onChange={this.onChangeRegion}
                                                                        />
                                                                    : null
                                                            }
                                                            {
                                                                (viewMode !== 'MexDetailView' && this.state.page.indexOf('pg=8') >= 0 && !this.state.currentPage) ?
                                                                    <Dropdown className='selection'
                                                                              style={{position: 'relative', marginRight: 20, height: 20}}
                                                                              options={autoPolicy}
                                                                              defaultValue={this.state.autoPolicy}
                                                                              onChange={(e, {value}) => {
                                                                                  this.onPolicyChange(value)
                                                                              }}
                                                                    /> : null
                                                            }
                                                            {
                                                                (viewMode !== 'MexDetailView' && !this.state.currentPage && this.props.location.search !== 'pg=1' && this.props.location.search !== 'pg=101' && viewMode !== 'detailView' && this.props.location.search.indexOf('audits') === -1) ?
                                                                    <Button color='teal' className='stepOrg2' disabled={this.props.viewBtn.onlyView}
                                                                            onClick={() => this.onHandleRegistry()}>New</Button>
                                                                    : null
                                                            }
                                                            {
                                                                (viewMode === 'detailView' || viewMode === 'MexDetailView') ?
                                                                    <Button disabled={this.props.viewBtn.onlyView} onClick={() => this.props.handleDetail({
                                                                        data: null,
                                                                        viewMode: 'listView'
                                                                    })}>Close Details</Button>
                                                                    : null
                                                            }
                                                            {
                                                                (this.state.headerTitle == 'User Roles') ?
                                                                    <div>
                                                                        <Input icon='search' placeholder={'Search ' + this.state.searchChangeValue} style={{marginRight: '20px'}}
                                                                               onChange={this.searchClick}/>
                                                                        <Dropdown defaultValue={this.searchOptions[0].value} search selection options={this.searchOptions}
                                                                                  onChange={this.searchChange}/>
                                                                    </div>
                                                                    : null
                                                            }
                                                        </div>
                                                    </Grid.Row>


                                                    <Grid.Row className='site_content_body'>
                                                        <Grid.Column>
                                                            <div className="table-no-resized">
                                                                {
                                                                    this.state.currentPage ? this.state.currentPage :
                                                                        (this.state.page === 'pg=0') ? <SiteFourPageOrganization></SiteFourPageOrganization> :
                                                                            (this.state.page === 'pg=1') ? <SiteFourPageUser></SiteFourPageUser> :
                                                                                (this.state.page === 'pg=101') ? <SiteFourPageAccount></SiteFourPageAccount> :
                                                                                    (this.state.page === 'pg=2') ? <SiteFourPageCloudlet></SiteFourPageCloudlet> :
                                                                                        (this.state.page === 'pg=3') ? <SiteFourPageFlavor></SiteFourPageFlavor> :
                                                                                            (this.state.page === 'pg=4') ? <SiteFourPageClusterInst></SiteFourPageClusterInst> :
                                                                                                (this.state.page === 'pg=5') ? <SiteFourPageApps></SiteFourPageApps> :
                                                                                                    (this.state.page === 'pg=6') ?
                                                                                                        <SiteFourPageAppInst childPage={this.showFullPage}></SiteFourPageAppInst> :
                                                                                                        (this.state.page === 'pg=7') ? <SiteFourPageCloudletPool></SiteFourPageCloudletPool> :
                                                                                                            (this.state.page === 'pg=8') ? this.state.autoPolicy === 'Auto Provisioning Policy' ?
                                                                                                                <AutoProvPolicy childPage={this.showChildPage}></AutoProvPolicy> :
                                                                                                                <AutoPrivacyPolicy childPage={this.showChildPage}></AutoPrivacyPolicy> :
                                                                                                                (this.state.page === 'pg=newOrg') ? <SiteFourPageCreateorga></SiteFourPageCreateorga> :
                                                                                                                    (this.state.page === 'pg=createApp') ?
                                                                                                                        <SiteFourPageAppReg editable={false}></SiteFourPageAppReg> :
                                                                                                                        (this.state.page === 'pg=editApp') ?
                                                                                                                            <SiteFourPageAppReg editable={true}></SiteFourPageAppReg> :
                                                                                                                            (this.state.page === 'pg=createAppInst') ?
                                                                                                                                <SiteFourPageAppInstReg editable={false}></SiteFourPageAppInstReg> :
                                                                                                                                (this.state.page === 'pg=createCloudletPool') ?
                                                                                                                                    <SiteFourPageCloudletPoolReg></SiteFourPageCloudletPoolReg> :
                                                                                                                                    (this.state.page === 'pg=createPolicy') ?
                                                                                                                                        <SiteFourAutoProvPolicyReg></SiteFourAutoProvPolicyReg> :
                                                                                                                                        (this.state.page === 'pg=createPrivacyPolicy') ?
                                                                                                                                            <AutoPrivacyPolicyReg></AutoPrivacyPolicyReg> :
                                                                                                                                            (this.state.page === 'pg=updateCloudletPool') ?
                                                                                                                                                <SiteFourPageCloudletPoolUpdate></SiteFourPageCloudletPoolUpdate> :
                                                                                                                                                (this.state.page === 'pg=linkOrganize') ?
                                                                                                                                                    <SiteFourPageLinkOrganizeReg></SiteFourPageLinkOrganizeReg> :
                                                                                                                                                    (this.state.page === 'pg=createCloudletPool') ?
                                                                                                                                                        <SiteFourPageCloudletPoolReg></SiteFourPageCloudletPoolReg> :
                                                                                                                                                        (this.state.page === 'pg=editAppInst') ?
                                                                                                                                                            <SiteFourPageAppInstReg
                                                                                                                                                                editable={true}></SiteFourPageAppInstReg> :
                                                                                                                                                            (this.state.page === 'pg=createClusterInst') ?
                                                                                                                                                                <SiteFourPageClusterInstReg></SiteFourPageClusterInstReg> :
                                                                                                                                                                (this.state.page === 'pg=createCloudlet') ?
                                                                                                                                                                    <SiteFourPageCloudletReg></SiteFourPageCloudletReg> :
                                                                                                                                                                    (this.state.page === 'pg=createFlavor') ?
                                                                                                                                                                        <SiteFourPageFlavorReg></SiteFourPageFlavorReg> :
                                                                                                                                                                        (this.state.page === 'pg=audits') ?
                                                                                                                                                                            <SiteFourPageAudits></SiteFourPageAudits> :
                                                                                                                                                                            null
                                                                }
                                                            </div>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid.Column>
                                            </Grid.Row>}
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
    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
    }
    let action = state.action;
    let tutorState = (state.tutorState) ? state.tutorState.state : null;
    let formInfo = (state.form) ? state.form : null;
    let submitInfo = (state.submitInfo) ? state.submitInfo : null;
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    let checkedAudit = (state.checkedAudit) ? state.checkedAudit.audit : null;
    let detailData = (state.changeViewMode && state.changeViewMode.mode) ? state.changeViewMode.mode.data : null;
    let selectedOrg = (state.selectOrganiz) ? state.selectOrganiz.org : null;


    return {
        viewBtn: state.btnMnmt ? state.btnMnmt : null,
        userToken: (state.userToken) ? state.userToken : null,
        userInfo: state.userInfo ? state.userInfo : null,
        userRole: state.showUserRole ? state.showUserRole.role : null,
        selectOrg: state.selectOrg.org ? state.selectOrg.org : null,
        loadingSpinner: state.loadingSpinner.loading ? state.loadingSpinner.loading : null,
        injectData: state.injectData ? state.injectData : null,
        viewMode: viewMode,
        alertInfo: {
            mode: state.alertInfo.mode,
            msg: state.alertInfo.msg
        },
        searchValue: (state.searchValue.search) ? state.searchValue.search : null,
        changeRegion: (state.changeRegion.region) ? state.changeRegion.region : null,
        tableHeaders: (state.tableHeader) ? state.tableHeader.headers : null,
        filters: (state.tableHeader) ? state.tableHeader.filters : null,
        siteName: (state.siteChanger) ? state.siteChanger.site : null,
        changeStep: (state.changeStep.step) ? state.changeStep.step : null,
        dataExist: state.dataExist.data,
        tutorState: tutorState,
        formInfo: formInfo,
        submitInfo: submitInfo,
        regionInfo: regionInfo,
        audit: checkedAudit,
        clickCity: state.clickCityList.list,
        detailData: detailData,
        selectedOrg
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => {
            dispatch(actions.changeSite(data))
        },
        handleChangeStep: (data) => {
            dispatch(actions.changeStep(data))
        },
        handleInjectData: (data) => {
            dispatch(actions.injectData(data))
        },
        handleInjectDeveloper: (data) => {
            dispatch(actions.registDeveloper(data))
        },
        handleChangeViewBtn: (data) => {
            dispatch(actions.btnManagement(data))
        },
        handleChangeComputeItem: (data) => {
            dispatch(actions.computeItem(data))
        },
        handleChangeClickCity: (data) => {
            dispatch(actions.clickCityList(data))
        },
        handleUserInfo: (data) => {
            dispatch(actions.userInfo(data))
        },
        handleSearchValue: (data, value) => {
            dispatch(actions.searchValue(data, value))
        },
        handleChangeRegion: (data) => {
            dispatch(actions.changeRegion(data))
        },
        handleSelectOrg: (data) => {
            dispatch(actions.selectOrganiz(data))
        },
        handleUserRole: (data) => {
            dispatch(actions.showUserRole(data))
        },
        handleComputeRefresh: (data) => {
            dispatch(actions.computeRefresh(data))
        },
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
        },
        handleDetail: (data) => {
            dispatch(actions.changeDetail(data))
        },
        handleRoleInfo: (data) => {
            dispatch(actions.roleInfo(data))
        },
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg))
        },
        handleAuditCheckCount: (data) => {
            dispatch(actions.setCheckedAudit(data))
        },
        handleResetMap: (data) => {
            dispatch(actions.resetMap(data))
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(SiteFour)));
