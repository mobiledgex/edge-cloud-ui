import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as serverData from "../services/model/serverData";
import { GridLoader } from "react-spinners";
import Alert from 'react-s-alert';

let _self = null;
class VerifyContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            isError: false,
            focused: false,
            loginState: false,
            uid: null,
            publicKey: null,
            exponent: null,
            loading: true
        };
        _self = this;

    }

    gotoUrl(site) {
        let mainPath = site;
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })

    }

    requestVerify = async (token) => {
        let strArr = this.props.params.subPath.split('=')		
        let token = strArr[1];
        let mcRequest = await serverData.verifyEmail(_self, {token:token});
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            Alert.success(mcRequest.response.data.message, {
                position: 'top-right',
                effect: 'slide',
                timeout: 10000
            });
            setTimeout(() => _self.gotoUrl('/site1'), 1000)
        }
    }

    render() {
        return (
            <div className="loadingBox">
                <GridLoader
                    sizeUnit={"px"}
                    size={20}
                    color={'#70b2bc'}
                    loading={this.state.loading}
                />
                <div>Verifying...</div>
            </div>
        );
    }

    componentDidMount() {
        this.requestVerify();
    }

}

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleInjectData: (data) => { dispatch(actions.setUser(data)) },
        handleChangeTab: (data) => { dispatch(actions.changeTab(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default connect(null, mapDispatchProps)(VerifyContent);
