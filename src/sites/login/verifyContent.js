import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import * as serverData from "../../services/model/serverData";
import { GridLoader } from "react-spinners";
import MexAlert from '../../hoc/alert/AlertDialog';
import { Dialog } from '@material-ui/core';


class VerifyContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            mexAlertMessage: undefined,
            open:true
        };

    }

    requestVerify = async () => {
        let token = this.props.location.search
        token = token.substring(token.indexOf('token=') + 6)
        let mcRequest = await serverData.verifyEmail(this, { token: token });
        if (mcRequest && (mcRequest.response || mcRequest.error)) {
            let alertInfo = { msg: 'Oops, this link is expired', severity: 'error' }
            if (mcRequest && mcRequest.response && mcRequest.response.data) {
                alertInfo = { msg: mcRequest.response.data.message, severity: 'success' }
            }
            this.setState({ mexAlertMessage: alertInfo })
        }
    }

    onAlertClose = () => {
        this.setState({ mexAlertMessage: undefined, open:false })
        this.props.history.push({ pathname: '/' })
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Dialog open={this.state.open} PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    }
                }}>
                    <GridLoader
                        sizeUnit={"px"}
                        size={20}
                        color={'#70b2bc'}
                        loading={this.state.loading}
                    />
                    Verifying...
                </Dialog>
                {this.state.mexAlertMessage ? <MexAlert data={this.state.mexAlertMessage} onClose={this.onAlertClose} /> : null}
            </div>
        );
    }

    componentDidMount() {
        this.requestVerify();
    }

}

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data)) },
    };
};

export default connect(null, mapDispatchProps)(VerifyContent);
