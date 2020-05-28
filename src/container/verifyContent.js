import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as serverData from "../services/model/serverData";
import { GridLoader } from "react-spinners";
import Alert from 'react-s-alert';


class VerifyContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };

    }

    requestVerify = async () => {
        let token = this.props.location.search
        token = token.substring(token.indexOf('token=') + 6)
        let mcRequest = await serverData.verifyEmail(this, { token: token });
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            Alert.success(mcRequest.response.data.message, {
                position: 'top-right',
                effect: 'slide',
                timeout: 10000
            });
            this.props.history.push({ pathname: '/' })
            setTimeout(() => this.props.handleChangeLoginMode('login'), 600);
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
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data)) },
    };
};

export default connect(null, mapDispatchProps)(VerifyContent);
