import React from 'react';
import {Header } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';

import {withRouter} from 'react-router-dom';
import {Motion} from "react-motion";
import {Steps, Hints} from 'intro.js-react';

//redux
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {GridLoader} from "react-spinners";
import SideNav from './defaultLayout/sideNav'
import * as serviceMC from '../../services/serviceMC';
import {MonitoringTutor} from '../../tutorial';
import Alert from 'react-s-alert';
import '../../css/introjs.css';
import '../../css/introjs-dark.css';

let defaultMotion = {left: window.innerWidth / 2, top: window.innerHeight / 2, opacity: 1}
let _self = null

const monitoringSteps = MonitoringTutor();


class SiteFour extends React.Component {
    constructor(props) {
        super(props);
        _self = this
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            headerTitle: '',
            activeItem: 'Organizations',
            page: 'pg=0',
            email: store ? store.email : 'Administrator',
            role: '',
            userToken: null,
            setMotion: defaultMotion,
            OrganizationName: '',
            adminShow: false,
            menuClick: false,
            learned: false,
            stepsEnabled: false,
            initialStep: 0,
            steps: [],
            enable: false,
            hideNext: true,
            selectRole: ''
        };
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
        _self.props.history.push({
            pathname: '/site4',
            search: "pg=" + pg
        });
        _self.props.history.location.search = "pg=" + pg;
        _self.props.handleChangeStep(pg)
        _self.setState({page: 'pg=' + pg, activeItem: label, headerTitle: label})
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

    receiveControllerResult(mcRequest) {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                _self.props.handleLoadingSpinner();
                _self.controllerOptions(response.data);
            }
        }
    }

    getAdminInfo = async (token) => {
        serviceMC.sendRequest(this, {
            token: token,
            method: serviceMC.getEP().SHOW_CONTROLLER
        }, _self.receiveControllerResult);
    }


    receiveAdminInfo = (mcRequest) => {
        console.log('Rahul1234', mcRequest)
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                _self.props.handleRoleInfo(response.data)
                response.data.map((item, i) => {
                    if (item.role.indexOf('Admin') > -1) {
                        _self.setState({adminShow: true});
                        localStorage.setItem('selectRole', item.role)
                    }
                })
            }
        }
    }

    enableSteps = () => {
        let enable = false;
        let currentStep = this.props.ViewMode ? this.props.ViewMode : null;

        if( currentStep ){ enable = true; }
        if (this.props.params.subPath === "pg=Monitoring") {
            if (localStorage.selectRole === 'AdminManager') {
                currentStep = monitoringSteps.stepsMonitoring;
            } else if (localStorage.selectRole === 'DeveloperManager' || localStorage.selectRole === 'DeveloperContributor' || localStorage.selectRole === 'DeveloperViewer') {
                currentStep = monitoringSteps.stepsMonitoringDev;
            } else {
                currentStep = monitoringSteps.stepsMonitoringOper;
            }
        }
        _self.setState({steps: currentStep})
        if (enable) {
            _self.setState({stepsEnabled: true, enable: true})
        }
    }

    UNSAFE_componentWillMount() {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        _self.setState({
            activeItem: (localStorage.selectMenu) ? localStorage.selectMenu : 'Organizations',
            headerTitle: (localStorage.selectMenu) ? localStorage.selectMenu : 'Organizations'
        })

        if (store) {
            _self.getAdminInfo(store.userToken);
        } else {
            _self.gotoUrl('/logout')
        }
        _self.props.handleViewMode( null );
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.selectedOrg) {
            _self.setState({selectOrg: nextProps.selectedOrg})
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
            _self.setState({page: subPath, OrganizationName: subParam})

        }

        if ((nextProps.alertInfo !== _self.props.alertInfo) && nextProps.alertInfo.mode) {
            Alert.closeAll();
            if (nextProps.alertInfo.mode === 'success') {

                Alert.success(nextProps.alertInfo.msg, {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 10000,
                    offset: 100
                });
            } else if (nextProps.alertInfo.mode === 'error') {
                Alert.error(nextProps.alertInfo.msg, {
                    position: 'top-right',
                    effect: 'slide',
                    beep: true,
                    timeout: 20000,
                    offset: 100,
                    html: true
                });
            }
            nextProps.handleAlertInfo('', '');
        }

        let tutorial = localStorage.getItem('TUTORIAL')

        let formKey = Object.keys(nextProps.formInfo);
        if (formKey.length) {
            if (nextProps.formInfo[formKey[0]]['submitSucceeded']) {
                if (nextProps.formInfo[formKey[0]]['submitSucceeded'] === true) {
                    _self.setState({stepsEnabled: false})
                }
            }
        }

        let enable = true;
        setTimeout(() => {
            if (enable && !_self.state.learned && !tutorial) {
                _self.enableSteps();
                _self.setState({stepsEnabled: true, learned: true})
                localStorage.setItem('TUTORIAL', 'done')
            }

        }, 1000)

        if (!_self.props.changeStep || _self.props.changeStep === '02') {
            _self.setState({enable: true})
        } else {
            _self.setState({enable: false})
        }
    }

    onExit() {
        _self.setState({stepsEnabled: false})
    }

    render() {
        const {stepsEnabled, initialStep, steps} = _self.state;
        return (
            <div className='view_body'>
                {steps ?
                    <Steps
                        enabled={stepsEnabled}
                        steps={steps}
                        initialStep={initialStep}
                        onExit={_self.onExit}
                        showButtons={true}
                        options={{hideNext: false}}
                        ref={steps => (_self.steps = steps)}
                    /> : null}
                {(_self.props.loadingSpinner == true) ?
                    <div className="loadingBox" style={{zIndex: 9999}}>
                        <GridLoader
                            sizeUnit={"px"}
                            size={25}
                            color={'#70b2bc'}
                            loading={_self.props.loadingSpinner}
                        />
                    </div> : null}
                <SideNav onOptionClick={_self.handleItemClick} isShowHeader={this.props.isShowHeader} email={_self.state.email} data={_self.props.userInfo.info} helpClick={_self.enableSteps} gotoUrl={_self.gotoUrl} viewMode={_self.props.ViewMode}/>
                <Motion defaultStyle={defaultMotion} style={_self.state.setMotion}>
                    {interpolatingStyle => <div style={interpolatingStyle} id='animationWrapper'></div>}
                </Motion>
            </div>
        );
    }

    componentWillUnmount() {
        _self.setState({learned: false})
    }

};

const mapStateToProps = (state) => {

    let tutorState = (state.tutorState) ? state.tutorState.state : null;
    let formInfo = (state.form) ? state.form : null;
    let submitInfo = (state.submitInfo) ? state.submitInfo : null;
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    let selectedOrg = (state.selectOrganiz) ? state.selectOrganiz.org : null;
    let ViewMode = (state.ViewMode) ? state.ViewMode.mode : null;
    let changeStep = (state.changeStep) ? state.changeStep.step : null;

    return {
        isShowHeader: state.HeaderReducer.isShowHeader,
        userToken: (state.userToken) ? state.userToken : null,
        userInfo: state.userInfo ? state.userInfo : null,
        selectOrg: state.selectOrg.org ? state.selectOrg.org : null,
        loadingSpinner: state.loadingSpinner.loading ? state.loadingSpinner.loading : null,
        alertInfo: {
            mode: state.alertInfo.mode,
            msg: state.alertInfo.msg
        },
        changeStep: changeStep,
        ViewMode: ViewMode,
        tutorState: tutorState,
        formInfo: formInfo,
        submitInfo: submitInfo,
        regionInfo: regionInfo,
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
        handleUserInfo: (data) => {
            dispatch(actions.userInfo(data))
        },
        handleSelectOrg: (data) => {
            dispatch(actions.selectOrganiz(data))
        },
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
        },
        handleRoleInfo: (data) => {
            dispatch(actions.roleInfo(data))
        },
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg))
        },
        handleViewMode: (data) => {
            dispatch(actions.viewMode(data))
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(SiteFour)));
