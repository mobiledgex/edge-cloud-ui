import React from 'react';
//redux
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { GridLoader } from "react-spinners";
import MexWorker from '../../services/worker/mex.worker.js'
import { sendAuthRequest } from '../../services/model/serverWorker';
import MexAlert from '../../hoc/alert/AlertDialog';
import { WORKER_ROLE } from '../../services/worker/constant';
import { SHOW_ROLE } from '../../services/model/endpoints';
import Menu from './Menu'
import '../../css/introjs.css';
import '../../css/introjs-dark.css';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

export default connect(mapStateToProps, mapDispatchProps)(Main);