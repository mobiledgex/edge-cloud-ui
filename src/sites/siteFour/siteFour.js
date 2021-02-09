import React from 'react';
import sizeMe from 'react-sizeme';

import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { GridLoader } from "react-spinners";
import SideNav from './defaultLayout/sideNav'
import MexWorker from '../../services/worker/mex.worker.js'
import { sendAuthRequest } from '../../services/model/serverWorker';
import MexAlert from '../../hoc/alert/AlertDialog';
import '../../css/introjs.css';
import '../../css/introjs-dark.css';
import { WORKER_ROLE } from '../../services/worker/constant';
import { SHOW_ROLE } from '../../services/model/endpoints';

let _self = null

class SiteFour extends React.Component {
    constructor(props) {
        super(props);
        _self = this
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            email: store ? store.email : 'Administrator',
            role: '',
            userRole: null,
            mexAlertMessage: undefined
        };
    }

    roleResponse = (mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            let dataList = mc.response.data;
            const worker = new MexWorker();
            worker.postMessage({ type: WORKER_ROLE, data: dataList })
            worker.addEventListener('message', event => {
                if (event.data.isAdmin) {
                    let role = event.data.role
                    localStorage.setItem('selectRole', role)
                    this.props.handleUserRole(role)
                    this.setState({ userRole: role });
                }
            });
        }
    }

    userRoleInfo = () => {
        sendAuthRequest(this, { method: SHOW_ROLE }, this.roleResponse)
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
        const { email, loadData } = this.state;
        return (
            <div className='view_body'>
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
                    data={_self.props.userInfo.info} viewMode={_self.props.viewMode}
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
