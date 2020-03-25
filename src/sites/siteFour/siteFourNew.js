import React from 'react';
import {
    Header,
    Menu,
    Dropdown,
    Button,
    Popup,
    Label,
    Icon
} from 'semantic-ui-react';
import sizeMe from 'react-sizeme';

import { withRouter } from 'react-router-dom';
import { Motion, spring } from "react-motion";
import { Steps, Hints } from 'intro.js-react';

//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { GridLoader } from "react-spinners";

import SideNav from './defaultLayout/sideNav'


import * as serviceMC from '../../services/serviceMC';

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

class SiteFour extends React.Component {
    constructor(props) {
        super(props);
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
            enable: false,
            hideNext: true,
            regionToggle: false,
            intoCity: false,
            fullPage: null,
            menuW: 240,
            selectRole: ''
        };

        this.headerH = 70;
        this.hgap = 0;
       
       

        this.menuArr = ['Organization', 'User Roles', 'Cloudlets', 'Cloudlet Pools', 'Flavors', 'Cluster Instances', 'Apps', 'App Instances']
       

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


    gotoUrl(site, subPath) {
        let mainPath = site;
        this.props.history.push({
            pathname: site,
            search: subPath
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })
        this.setState({ page: subPath })
    }

    handleItemClick(id, label, pg, role) {
        localStorage.setItem('selectMenu', label)
        this.setState({ menuClick: true })
        this.props.handleDetail({ data: null, viewMode: 'listView' })
        this.props.handleChangeViewBtn(false);
        this.props.handleChangeClickCity([]);
        this.props.handleChangeComputeItem(label);
        this.props.handleSearchValue('')
        this.props.handleChangeRegion('All')
        this.props.history.push({
            pathname: '/site4',
            search: "pg=" + pg
        });
        this.props.history.location.search = "pg=" + pg;
        this.props.handleChangeStep(pg)
        this.setState({ page: 'pg=' + pg, activeItem: label, headerTitle: label, intoCity: false })
    }

    receiveControllerResult(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                this.props.handleLoadingSpinner();
                this.controllerOptions(response.data);
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
    }

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
        serviceMC.sendRequest(this, {
            token: token,
            method: serviceMC.getEP().SHOW_CONTROLLER
        }, this.receiveControllerResult);
        //serviceMC.sendRequest(this, {token: token, method: serviceMC.getEP().SHOW_ROLE}, this.receiveAdminInfo)
        this.setState({ currentVersion: process.env.REACT_APP_BUILD_VERSION ? process.env.REACT_APP_BUILD_VERSION : 'v0.0.0' })
    }

    UNSAFE_componentWillMount() {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        this.setState({
            activeItem: (localStorage.selectMenu) ? localStorage.selectMenu : 'Organizations',
            headerTitle: (localStorage.selectMenu) ? localStorage.selectMenu : 'Organizations'
        })


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
                    this.setState({ stepsEnabled: false })
                }
            }
        }
        if (tutorial === 'done') {
            //this.setState({stepsEnabled:false})
        }
        //
        let enable = true;
        setTimeout(() => { 
            if (enable && !this.state.learned && !tutorial) {
                this.enalbeSteps();
                this.setState({ stepsEnabled: true, learned: true })
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
            this.setState({ regionToggle: true })
            if (nextProps.regionInfo.region) {
                nextProps.regionInfo.region.map((region, i) => {
                    getRegions.push({ key: i + 2, text: region, value: region })
                })
            }
            let newRegions = Object.assign([], this.state.regions).concat(getRegions)
            this.setState({ regions: newRegions })

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

    componentWillUnmount() {
        this.setState({ learned: false })
    }

    onChangeRegion = (e, { value }) => {

        this.props.handleChangeRegion(value)
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
        this.setState({ stepsEnabled: false })
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
        this.loadCount = 0;
        serviceMC.sendRequest(this, {
            token: store.userToken,
            method: serviceMC.getEP().SHOW_SELF,
            data: '{}',
            showMessage: false
        }, this.receiveResult)
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
