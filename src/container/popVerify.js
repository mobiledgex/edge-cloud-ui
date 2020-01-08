import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown} from "semantic-ui-react";
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import * as serviceMC from '../services/serviceMC';

const host = window.location.host;
let _self = null;
class PopVerify extends React.Component {
    constructor() {
        super();
        this.state = {
            dummyData:[],
            selected:{},
            open:false,
            dimmer:'',
            devOptionsOne:[],
            devOptionsTwo:[],
            dropdownValueOne:'',
            dropdownValueTwo:'',
            showWarning:false,
            closeOnEscape:true,
            closeOnDimmerClick:true,
            deleteName:''
        }
        _self = this;
    }

    closeVerifyModal(confirm) {
        _self.setState({ showWarning: false })
        _self.props.close()
        if(confirm === 'yes') {
            _self.onSendEmail()
        }
    }
    onSendEmail() {
        _self.props.handleLoadingSpinner(true);
        let requestBody = {
            data: { method: serviceMC.getEP().RESEND_VERIFY, data: { username: _self.props.userName, email: _self.props.email, callbackurl: `https://${host}/verify` } }
        }
        serviceMC.sendRequest(_self, requestBody, _self.props.receiveResendVerify)
    }

    /** ************************ **/
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.open){
            let name = '';
            this.setState({showWarning:nextProps.open})
        }
    }

    render() {
        const { showWarning, closeOnEscape, closeOnDimmerClick } = this.state
        return (
            <Modal
                open={showWarning}
                closeOnEscape={closeOnEscape}
                closeOnDimmerClick={closeOnDimmerClick}
            >
                <Modal.Header>{`Verify Email ${this.props.email}`}</Modal.Header>
                <Modal.Content>
                    {/* <p>{`Thank you for signing up. Please verify your account. In order to login to your account, you must verify your account. An email has been sent to ${this.props.email} with a link to verify your account. If you have not received the email after a few minutes check your spam folder or resend the verification email.`}</p> */}
                    <p>{`Are you sure you want to send a verification email to ${this.props.email}?`}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.closeVerifyModal('no')} negative>
                        No
                    </Button>
                    <Button
                        onClick={() => this.closeVerifyModal('yes')}
                        positive
                        labelPosition='right'
                        icon='checkmark'
                        content='Yes'
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectOrg : state.selectOrg.org?state.selectOrg.org:null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleSelectOrg: (data) => { dispatch(actions.selectOrganiz(data))},
        handleUserRole: (data) => { dispatch(actions.showUserRole(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(PopVerify));
