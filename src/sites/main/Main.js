import React from 'react';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { GridLoader } from "react-spinners";
import RoleWorker from '../../services/worker/role.worker.js'
import { sendAuthRequest } from '../../services/model/serverWorker';
import { sendRequest } from './monitoring/services/service';
import MexAlert from '../../hoc/alert/AlertDialog';
import { SHOW_ROLE } from '../../services/model/endpoints';
import Menu from './Menu'
import '../../css/introjs.css';
import '../../css/introjs-dark.css';
import { accessGranted } from '../../services/model/privateCloudletAccess';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: null,
            mexAlertMessage: undefined
        };
        this.worker = new RoleWorker();
    }

    roleResponse = (mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            let dataList = mc.response.data;

            this.worker.postMessage({ data: dataList })
            this.worker.addEventListener('message', event => {
                if (event.data.isAdmin) {
                    let role = event.data.role
                    localStorage.setItem('selectRole', role)
                    this.props.handleUserRole(role)
                    this.setState({ userRole: role });
                }
            });
        }
    }

    accessGrantedResponse = (mc) => {

    }

    userRoleInfo = () => {
        sendAuthRequest(this, { method: SHOW_ROLE }, this.roleResponse)
        sendRequest(this, accessGranted()).then(mc => {
            if (mc.response && mc.response.status === 200) {
                let dataList = mc.response.data
                if (dataList.length > 0) {
                    this.props.handlePrivateAccess(true)
                }
            }
        })
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
        return (
            <div className='view_body'>
                {(this.props.loadingSpinner == true) ?
                    <div className="loadingBox" style={{ zIndex: 9999 }}>
                        <GridLoader
                            sizeUnit={"px"}
                            size={25}
                            color={'#70b2bc'}
                            loading={this.props.loadingSpinner}
                        />
                    </div> : null}
                <Menu />
                {this.state.mexAlertMessage ?
                    <MexAlert data={this.state.mexAlertMessage}
                        onClose={() => this.setState({ mexAlertMessage: undefined })} /> : null}
            </div>
        );
    }

    componentDidMount() {
        this.userRoleInfo()
    }

    componentWillUnmount() {
        this.worker.terminate()
    }
};

const mapStateToProps = (state) => {
    let viewMode = (state.ViewMode) ? state.ViewMode.mode : null;
    return {
        userInfo: state.userInfo ? state.userInfo : null,
        loadingSpinner: state.loadingSpinner.loading ? state.loadingSpinner.loading : null,
        alertInfo: { mode: state.alertInfo.mode, msg: state.alertInfo.msg },
        viewMode: viewMode,
        isPrivate: state.privateAccess.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleUserRole: (data) => { dispatch(actions.showUserRole(data)) },
        handlePrivateAccess: (data) => { dispatch(actions.privateAccess(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(Main);
