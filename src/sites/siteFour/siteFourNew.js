import React from 'react';
import {
    Image,
    Header,
    Menu,
    Dropdown,
    Button,
    Popup,
    Label,
    Modal,
    Icon
} from 'semantic-ui-react';
import sizeMe from 'react-sizeme';

import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import { Motion, spring } from "react-motion";
import { Steps, Hints } from 'intro.js-react';

//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { GridLoader, ClipLoader } from "react-spinners";

import SideNav from './defaultLayout/sideNav'


import PopLegendViewer from '../../container/popLegendViewer';
import * as serviceMC from '../../services/serviceMC';
import * as reducer from '../../utils'

import { organizationTutor, CloudletTutor } from '../../tutorial';

import Alert from 'react-s-alert';

import '../../css/introjs.css';
import '../../css/introjs-dark.css';

import PageAdminMonitoring from "./monitoring/admin/PageAdminMonitoring";
import PageDevMonitoring from "./monitoring/dev/PageDevMonitoring";
import PageOperMonitoring from "./monitoring/oper/PageOperMonitoring";

let defaultMotion = { left: window.innerWidth / 2, top: window.innerHeight / 2, opacity: 1 }

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
            contHeight: 0,
            contWidth: 0,
            bodyHeight: 0,
            headerTitle: '',
            activeItem: 'Organizations',
            page: 'pg=0',
            email: store ? store.email : 'Administrator',
            role: '',
            userToken: null,
            userName: '',
            regions: [
                { key: 1, text: 'All', value: 'All' },
            ],
            nextPosX: window.innerWidth / 2,
            nextPosY: window.innerHeight / 2,
            nextOpacity: 1,
            setMotion: defaultMotion,
            OrganizationName: '',
            adminShow: false,
            viewMode: 'listView',
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
            fullPage: null,
            menuW: 240,
            hideLeftMenu: false,
            animate: false,
            selectRole: ''
        };

        this.headerH = 70;
        //this.menuW = 240;
        this.hgap = 0;
        this.OrgMenu = [
            { label: 'Organizations', icon: 'people', pg: 0 },
            { label: 'Users & Roles', icon: 'assignment_ind', pg: 1 },
            { label: 'Accounts', icon: 'dvr', pg: 101 }
        ]
        this.menuItemsAll = [ //admin menu
            { label: 'Cloudlets', icon: 'cloud_queue', pg: 2 },
            { label: 'Cloudlet Pools', icon: 'cloud_circle', pg: 7 },
            { label: 'Flavors', icon: 'free_breakfast', pg: 3 },
            { label: 'Cluster Instances', icon: 'storage', pg: 4 },
            { label: 'Apps', icon: 'apps', pg: 5 },
            { label: 'App Instances', icon: 'sports_esports', pg: 6 },
            { label: 'Monitoring', icon: 'tv', pg: 'Monitoring' },
            { label: 'Policies', icon: 'playlist_play', pg: 8, dropdown: [{ label: 'Auto Provisioning Policy' }] },
            { label: 'Audit Logs', icon: 'check', pg: 'audits' }
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
            { role: 'AdminManager', view: [] },
            { role: 'DeveloperManager', view: [2, 3] },
            { role: 'DeveloperContributor', view: [1, 2, 3] },
            { role: 'DeveloperViewer', view: [1, 2, 3, 5, 6, 7] },
            { role: 'OperatorManager', view: [] },
            { role: 'OperatorContributor', view: [1] },
            { role: 'OperatorViewer', view: [1, 2] }
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
        _self.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })
    }

    gotoUrl(site, subPath) {
        let mainPath = site;
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })
        _self.setState({ page: subPath })
    }

    handleItemClick(id, label, pg, role) {
        localStorage.setItem('selectMenu', label)
        _self.setState({ menuClick: true })
        _self.props.handleDetail({ data: null, viewMode: 'listView' })
        _self.props.handleChangeViewBtn(false);
        _self.props.handleChangeClickCity([]);
        _self.props.handleChangeComputeItem(label);
        _self.props.handleSearchValue('')
        _self.props.handleChangeRegion('All')
        _self.props.history.push({
            pathname: '/site4',
            search: "pg=" + pg
        });
        _self.props.history.location.search = "pg=" + pg;
        _self.props.handleChangeStep(pg)
        _self.setState({ page: 'pg=' + pg, activeItem: label, headerTitle: label, intoCity: false })
    }


    onHandleRegistry() {
        if (localStorage.selectMenu === 'Organizations') {
            this.setState({ page: 'pg=newOrg' })
            this.gotoUrl('/site4', 'pg=newOrg')
        } else if (localStorage.selectMenu === 'Cloudlets') {
            this.setState({ page: 'pg=' })
            this.gotoUrl('/site4', 'pg=createCloudlet')
        } else if (localStorage.selectMenu === 'Apps') {
            this.setState({ page: 'pg=createApp' })
            this.gotoUrl('/site4', 'pg=createApp')
        } else if (localStorage.selectMenu === 'App Instances') {
            this.setState({ page: 'pg=createAppInst' })
            this.gotoUrl('/site4', 'pg=createAppInst')
        } else if (localStorage.selectMenu === '') {
            this.setState({ page: 'pg=createAppInst' })
            this.gotoUrl('/site4', 'pg=createAppInst')
        } else if (localStorage.selectMenu === 'Flavors') {
            this.setState({ page: 'pg=createFlavor' })
            this.gotoUrl('/site4', 'pg=createFlavor')
        } else if (localStorage.selectMenu === 'Cluster Instances') {
            this.setState({ page: 'pg=createClusterInst' })
            this.gotoUrl('/site4', 'pg=createClusterInst')
        } else if (localStorage.selectMenu === 'Cloudlet Pools') {
            this.setState({ page: 'pg=createCloudletPool' })
            this.gotoUrl('/site4', 'pg=createCloudletPool')
        } else if (localStorage.selectMenu === 'Policies') {
            let pg = this.state.autoPolicy === 'Auto Provisioning Policy' ? 'createPolicy' : 'createPrivacyPolicy';
            this.setState({ page: `pg=${pg}` })
            this.gotoUrl('/site4', `pg=${pg}`)
        } else {
            this.props.handleInjectDeveloper('newRegist');
        }
        this.props.handleChangeClickCity([])
        this.setState({ intoCity: false })
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
                        this.setState({ adminShow: true });
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

    getHelpPopup = (key) => (
        <Popup
            trigger={<Icon name='question circle outline' size='small' style={{ marginTop: 0, paddingLeft: 10 }} />}
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

        this.setState({ steps: currentStep })

        let elmentName = (this.steps) ? currentStep : null;
        //this.steps.props.options.hideNext = true;
        let element = (elmentName) ? document.getElementsByClassName(elmentName[0].element.replace('.', '')) : [];
        if (enable) {
            console.log("elementelement111", element)
            this.setState({ stepsEnabled: true, enable: true })
        }

    }

    getAdminInfo = async (token) => {
        serviceMC.sendRequest(_self, {
            token: token,
            method: serviceMC.getEP().SHOW_CONTROLLER
        }, this.receiveControllerResult);
        //serviceMC.sendRequest(_self, {token: token, method: serviceMC.getEP().SHOW_ROLE}, this.receiveAdminInfo)
        _self.setState({ currentVersion: process.env.REACT_APP_BUILD_VERSION ? process.env.REACT_APP_BUILD_VERSION : 'v0.0.0' })
    }

    onClickBackBtn = () => {
        this.setState({ intoCity: false })
        this.props.handleChangeClickCity([]);
        this.props.handleResetMap('back')

    }


    UNSAFE_componentWillMount() {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        this.setState({
            activeItem: (localStorage.selectMenu) ? localStorage.selectMenu : 'Organizations',
            headerTitle: (localStorage.selectMenu) ? localStorage.selectMenu : 'Organizations'
        })

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

        this.setState({ steps: orgaSteps.stepsZero, intoCity: false });
        //
        if (this.props.params.subPath !== 'pg=audits') {
            this.getDataAudit();
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        try {
            this.setState({ bodyHeight: (window.innerHeight - this.headerH) })
            this.setState({ contHeight: (nextProps.size.height - this.headerH) / 2 - this.hgap })
            this.setState({ contWidth: (window.innerWidth - this.state.menuW) })
            this.setState({ userToken: nextProps.userToken })
            this.setState({ userName: (nextProps.userInfo && nextProps.userInfo.info) ? nextProps.userInfo.info.Name : null })
        } catch (e) {

        }
        if (nextProps.selectedOrg) {
            this.setState({ selectOrg: nextProps.selectedOrg })
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
            this.setState({ page: subPath, OrganizationName: subParam })

        }

        if (nextProps.viewMode && localStorage.selectRole.indexOf('Developer') === -1) {
            this.setState({ viewMode: nextProps.viewMode })
        } else {
            this.setState({ viewMode: 'listView' })
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
            this.setState({ showItem: false })
            if (nextProps.tableHeaders.length) {
                this.setState({ tableHeaders: nextProps.tableHeaders })
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
                    _self.setState({ stepsEnabled: false })
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
                _self.setState({ stepsEnabled: true, learned: true })
                localStorage.setItem('TUTORIAL', 'done')
            }

        }, 1000)

        let site = this.props.siteName;
        if (!this.props.changeStep || this.props.changeStep === '02') {
            this.setState({ enable: true })
        } else {
            this.setState({ enable: false })
        }


        //{ key: 1, text: 'All', value: 'All' }
        if (nextProps.regionInfo.region.length && !this.state.regionToggle) {

            let getRegions = []
            _self.setState({ regionToggle: true })
            if (nextProps.regionInfo.region) {
                nextProps.regionInfo.region.map((region, i) => {
                    getRegions.push({ key: i + 2, text: region, value: region })
                })
            }
            let newRegions = Object.assign([], _self.state.regions).concat(getRegions)
            _self.setState({ regions: newRegions })

        }
        if (nextProps.clickCity.length > 0) {
            this.setState({ intoCity: true })
        } else {
            this.setState({ intoCity: false })
        }

        //set category
        if (nextProps.detailData !== this.props.detailData) {
            // alert(JSON.stringify(nextProps.detailData))
            this.setState({ detailData: nextProps.detailData })
        }

    }


    componentDidUpdate() {
        if (localStorage.selectRole && this.state.menuClick) {
            this.disableBtn();
            this.setState({ menuClick: false })
        }
    }

    componentWillUnmount() {
        this.setState({ learned: false })
    }

    menuItemViewHide = (item, i, activeItem, orgMenu) => (
        (this.state.hideLeftMenu) ?
            <Popup
                className="table_actions_tooltip"
                content={item.label}
                position='right center'
                trigger={
                    this.menuItemView(item, i, activeItem, orgMenu)
                }
            />
            :
            this.menuItemView(item, i, activeItem, orgMenu)
    )

    //compute page menu view
    menuItemView = (item, i, activeItem, orgMenu) => (
        item.dropdown ?
            <div className="left_menu_item" style={{ marginLeft: 14 }}><MaterialIcon icon={item.icon} />
                <Dropdown className={'leftMenu_' + item.label} text={item.label} pointing='left'>
                    <Dropdown.Menu >
                        {item.dropdown.map((drop, i) => {
                            return (
                                <Dropdown.Item key={i}>{drop.label}</Dropdown.Item>
                            )
                        })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div> :
            <Menu.Item
                className={'leftMenu_' + item.label}
                key={i}
                name={item.label}
                active={activeItem === item.label}
                onClick={() => this.handleItemClick(i, item.label, item.pg, localStorage.selectRole)}
            >
                <div className="left_menu_item">
                    {orgMenu && <MaterialIcon icon={item.icon} />}
                    {!orgMenu && (localStorage.selectRole === 'AdminManager') && <MaterialIcon icon={item.icon} />}
                    {!orgMenu && (localStorage.selectRole === 'DeveloperManager' || localStorage.selectRole === 'DeveloperContributor' || localStorage.selectRole === 'DeveloperViewer') &&
                        <MaterialIcon icon={item.icon} />}
                    {!orgMenu && (localStorage.selectRole === 'OperatorManager' || localStorage.selectRole === 'OperatorContributor' || localStorage.selectRole === 'OperatorViewer') &&
                        <MaterialIcon icon={item.icon} />}
                    <div className='label'>{item.label}</div>
                    {(activeItem === item.label) ?
                        <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
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


                    <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
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
        setTimeout(() => self.setState({
            setMotion: {
                left: spring(nextPosX, self.speed),
                top: spring(nextPosY, self.speed),
                position: 'absolute',
                opacity: 0
            }
        }), 200);
    }

    resetMotion() {
        let self = _self;
        this.setState({ setMotion: defaultMotion })
        let nextPosX = 15
        let nextPosY = 180;
        setTimeout(() => self.setState({
            setMotion: {
                left: spring(nextPosX, self.speed),
                top: spring(nextPosY, self.speed),
                position: 'absolute',
                opacity: spring(0, self.speedOpacity)
            }
        }), 500);
    }

    onChangeRegion = (e, { value }) => {

        _self.props.handleChangeRegion(value)
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

    searchChange = (e, { value }) => {
        this.setState({ searchChangeValue: value })
        this.props.handleSearchValue(this.props.searchValue, value)
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
        _self.setState({ stepsEnabled: false })
    }

    orgTypeLegendShow = () => {
        _self.setState({ openLegend: true })
    }
    closeLegend = () => {
        this.setState({ openLegend: false })
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
        this.setState({ devData: [] })
        _self.loadCount = 0;
        serviceMC.sendRequest(_self, {
            token: store.userToken,
            method: serviceMC.getEP().SHOW_SELF,
            data: '{}',
            showMessage: false
        }, _self.receiveResult)
    }

    onPolicyChange = (value) => {
        localStorage.setItem('autoPolicy', value)
        this.setState({ autoPolicy: value })
    }

    /** audit ********/

    

    showFullPage = (fullPage) => {
        this.setState({
            fullPage: fullPage
        })
    }


    render() {
        const { shouldShowBox, shouldShowCircle, viewMode } = this.state;
        const { stepsEnabled, initialStep, hintsEnabled, hints, steps } = this.state;
        return (
            this.state.fullPage ?
                this.state.fullPage
                :
                <div className='view_body'>
                    {steps ?
                        <Steps
                            enabled={stepsEnabled}
                            steps={steps}
                            initialStep={initialStep}
                            onExit={this.onExit}
                            showButtons={true}
                            options={{ hideNext: false }}
                            ref={steps => (this.steps = steps)}
                        /> : null}
                    {hints ?
                        <Hints
                            enabled={hintsEnabled}
                            hints={hints}
                        /> : null}
                    {(this.props.loadingSpinner == true) ?
                        <div className="loadingBox" style={{ zIndex: 9999 }}>
                            <GridLoader
                                sizeUnit={"px"}
                                size={25}
                                color={'#70b2bc'}
                                loading={this.props.loadingSpinner}
                            />
                        </div> : null}


                    {this.state.page === 'pg=PageAdminMonitoring' || this.state.page === 'pg=PageDevMonitoring' || this.state.page === 'pg=PageOperMonitoring' ?
                        <main style={{ margin: 65, width: '97%', height: '87%' }}>
                                {(this.state.page === 'pg=PageAdminMonitoring') ? <PageAdminMonitoring /> :
                                    (this.state.page === 'pg=PageDevMonitoring') ? <PageDevMonitoring /> :
                                        (this.state.page === 'pg=PageOperMonitoring') ? <PageOperMonitoring /> :
                                            null}
                        </main> :
                        <SideNav onOptionClick={this.handleItemClick} email={this.state.email} data={this.props.userInfo.info} helpClick={this.enalbeSteps} gotoUrl={this.gotoUrl}/>
                    }

                    <PopLegendViewer data={this.state.detailViewData} dimmer={false} open={this.state.openLegend}
                        close={this.closeLegend} siteId={this.props.siteId}></PopLegendViewer>
                    <Motion defaultStyle={defaultMotion} style={this.state.setMotion}>
                        {interpolatingStyle => <div style={interpolatingStyle} id='animationWrapper'></div>}
                    </Motion>
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFour)));
