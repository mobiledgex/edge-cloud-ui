import React from 'react';
import sizeMe from 'react-sizeme';

import { withRouter } from 'react-router-dom';
import { Steps } from 'intro.js-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { GridLoader } from "react-spinners";
import SideNav from './defaultLayout/sideNav'
import * as serverData from '../../services/model/serverData';
import MexWorker from '../../services/worker/mex.worker.js'
import { sendRequests } from '../../services/model/serverWorker';
import MexAlert from '../../hoc/alert/AlertDialog';
import '../../css/introjs.css';
import '../../css/introjs-dark.css';
import { WORKER_ROLE } from '../../services/worker/constant';
import { SHOW_CONTROLLER, SHOW_ROLE } from '../../services/model/endpoints';

let _self = null

class SiteFour extends React.Component {
    constructor(props) {
        super(props);
        _self = this
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            email: store ? store.email : 'Administrator',
            role: '',
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

    roleResponse = (mcList) => {
        let role = undefined
        if (mcList) {
            mcList.map(mc => {
                let request = mc.request
                if (mc && mc.response && mc.response.status === 200) {
                    if (request.method === SHOW_CONTROLLER) {
                        let data = mc.response.data
                        let regions = []
                        data.map((data) => {
                            regions.push(data.Region)
                        })
                        localStorage.setItem('regions', regions)
                    }
                    else if (request.method === SHOW_ROLE) {
                        let dataList = mc.response.data;
                        const worker = new MexWorker();
                        worker.postMessage({ type: WORKER_ROLE, data: dataList })
                        worker.addEventListener('message', event => {
                            if (event.data.isAdmin) {
                                role = event.data.role
                                localStorage.setItem('selectRole', role)
                                this.setState({ userRole: role });
                            }
                        });
                    }
                    this.props.handleUserRole(role)
                }
            })
        }
    }

    userRoleInfo = () => {
        let requestList = []
        requestList.push({ method: SHOW_CONTROLLER })
        requestList.push({ method: SHOW_ROLE })
        sendRequests(this, requestList, this.roleResponse)
    }

    helpClick = (currentStep) => {
        this.setState({ steps: currentStep, stepsEnabled: true, enable: true })
    }

    onExit() {
        _self.setState({ stepsEnabled: false })
    }

    static getDerivedStateFromProps(props, state) {
        let alertInfo = props.alertInfo
        if (alertInfo !== state.mexAlertMessage && props.alertInfo.mode && alertInfo.msg) {
            props.handleAlertInfo(undefined, undefined);
            return { mexAlertMessage: alertInfo }
        }
        return null
    }

    render() {
        const { stepsEnabled, initialStep, steps, email, loadData } = this.state;
        return (
            <div className='view_body'>
                {steps ?
                    <Steps
                        enabled={stepsEnabled}
                        steps={steps}
                        initialStep={initialStep}
                        onExit={_self.onExit}
                        showButtons={true}
                        options={{ hideNext: false }}
                        ref={steps => (_self.steps = steps)}
                    /> : null}
                {(_self.props.loadingSpinner == true) ?
                    <div className="loadingBox" style={{ zIndex: 9999 }}>
                        <GridLoader
                            sizeUnit={"px"}
                            size={25}
                            color={'#70b2bc'}
                            loading={_self.props.loadingSpinner}
                        />
                    </div> : null}
                <SideNav history={this.props.history} isShowHeader={this.props.isShowHeader} email={email}
                    data={_self.props.userInfo.info} helpClick={this.helpClick} viewMode={_self.props.viewMode}
                    userRole={this.state.userRole} />

                {this.state.mexAlertMessage ?
                    <MexAlert data={this.state.mexAlertMessage}
                        onClose={() => this.setState({ mexAlertMessage: undefined })} /> : null}
            </div>
        );
    }

    componentDidMount() {
        this.userRoleInfo()
    }
};

const mapStateToProps = (state) => {
    let viewMode = (state.ViewMode) ? state.ViewMode.mode : null;
    return {
        isShowHeader: state.HeaderReducer.isShowHeader,
        userInfo: state.userInfo ? state.userInfo : null,
        loadingSpinner: state.loadingSpinner.loading ? state.loadingSpinner.loading : null,
        alertInfo: {
            mode: state.alertInfo.mode,
            msg: state.alertInfo.msg
        },
        viewMode: viewMode
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
        },
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg))
        },
        handleUserRole: (data) => { dispatch(actions.showUserRole(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFour)));
