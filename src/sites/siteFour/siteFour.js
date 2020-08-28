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
import MexAlert from '../../hoc/alert/AlertDialog';
import '../../css/introjs.css';
import '../../css/introjs-dark.css';

let _self = null

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
    
    helpClick = (currentStep) =>
    {
        this.setState({steps: currentStep, stepsEnabled: true, enable: true})
    }

    onExit() {
        _self.setState({stepsEnabled: false})
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
                         data={_self.props.userInfo.info} helpClick={this.helpClick} viewMode={_self.props.viewMode}
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
};

const mapStateToProps = (state) => {
    let viewMode = (state.viewMode) ? state.viewMode.mode : null;
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
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(SiteFour)));
