import React from 'react';
import sizeMe from 'react-sizeme';

import {withRouter} from 'react-router-dom';
import {Steps} from 'intro.js-react';
//redux
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {GridLoader} from "react-spinners";
import SideNav from './defaultLayout/sideNav'
import * as serverData from '../../services/model/serverData';
import * as constant from '../../constant';
import {MonitoringTutor} from '../../tutorial';
import MexAlert from '../../hoc/alert/AlertDialog';
import '../../css/introjs.css';
import '../../css/introjs-dark.css';

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
            adminShow: false,
            menuClick: false,
            learned: false,
            stepsEnabled: false,
            initialStep: 0,
            steps: [],
            enable: false,
            hideNext: true,
            userRole: null,
            selectRole: '',
            mexAlertMessage: undefined
        };
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

    getAdminInfo = async () => {
        let mcRequest = await serverData.controllers(this)
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            _self.props.handleLoadingSpinner();
            _self.controllerOptions(mcRequest.response.data);
        }
    }

    userRoleInfo = async () => {
        let mcRequest = await serverData.showUserRoles(this)
        if (mcRequest) {
            if (mcRequest.response && mcRequest.response.data) {
                let dataList = mcRequest.response.data;
                for (var i = 0; i < dataList.length; i++) {
                    let role = dataList[i].role
                    if (role.indexOf('Admin') > -1) {
                        _self.setState({userRole: role});
                        localStorage.setItem('selectRole', role)
                        break;
                    }
                }
            }
        }
    }

    enableSteps = () => {
        let enable = false;
        let currentStep = this.props.ViewMode ? this.props.ViewMode : null;

        if (currentStep) {
            enable = true;
        }
        if (this.props.match.params.pageId === `pg=${constant.PAGE_MONITORING}`) {
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

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {

        if ((nextProps.alertInfo !== _self.props.alertInfo) && nextProps.alertInfo.mode) {
            let alertInfo = {msg: nextProps.alertInfo.msg, severity: nextProps.alertInfo.mode}
            nextProps.handleAlertInfo(undefined, undefined);
            this.setState({mexAlertMessage: alertInfo})
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
                <SideNav history={this.props.history} isShowHeader={this.props.isShowHeader} email={_self.state.email}
                         data={_self.props.userInfo.info} helpClick={_self.enableSteps} viewMode={_self.props.ViewMode}
                         userRole={this.state.userRole}/>

                {this.state.mexAlertMessage ?
                    <MexAlert data={this.state.mexAlertMessage}
                              onClose={() => this.setState({mexAlertMessage: undefined})}/> : null}
            </div>
        );
    }

    componentDidMount() {
        this.userRoleInfo()
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
    let ViewMode = (state.ViewMode) ? state.ViewMode.mode : null;
    let changeStep = (state.changeStep) ? state.changeStep.step : null;

    return {
        isShowHeader: state.HeaderReducer.isShowHeader,
        userToken: (state.userToken) ? state.userToken : null,
        userInfo: state.userInfo ? state.userInfo : null,
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
        regionInfo: regionInfo
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
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
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
