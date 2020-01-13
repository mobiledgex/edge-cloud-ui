import React from 'react';
import { Button, Modal } from "semantic-ui-react";
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import * as serviceMC from "../services/serviceMC";

let _self = null;
class DeleteItem extends React.Component {
    constructor() {
        super();
        this.state = {
            dummyData: [],
            selected: {},
            open: false,
            dimmer: '',
            devOptionsOne: [],
            devOptionsTwo: [],
            dropdownValueOne: '',
            dropdownValueTwo: '',
            showWarning: false,
            closeOnEscape: true,
            closeOnDimmerClick: true,
            deleteName: '',
            deleteOrg: ''

        }
        _self = this;
    }

    closeDeleteModal(confirm) {
        _self.setState({ showWarning: false })
        _self.props.close()
        if (confirm === 'yes') {
            _self.onHandleDelete()
        }
    }

    httpResponse = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let data = mcRequest.request.data;
                let msg = '';

                let siteId = this.props.siteId;
                switch (siteId) {
                    case 'Organization':
                        msg = 'Your organization ' + data.name + ' deleted successfully'
                        break;
                    case 'User':
                        msg = 'User ' + data.username + ' removed from organization ' + data.org
                        break;
                    case 'Account':
                        msg = 'User ' + _self.state.deleteName + ' removed from console '
                        break;
                    case 'Flavors':
                        msg = 'Flavor ' + data.flavor.key.name + ' deleted successfully'
                        break;
                    case 'App':
                        msg = 'Your application ' + data.app.key.name + ' deleted successfully'
                        break;
                }

                if (response.data.message) {
                    this.props.handleAlertInfo('success', msg)
                }

                if (siteId === 'Organization' && data.name == localStorage.selectOrg) {
                    localStorage.setItem('selectRole', '')
                    localStorage.setItem('selectOrg', '')
                    this.props.handleSelectOrg('-')
                    this.props.handleUserRole('')
                }
                _self.props.refresh('All');
            }
        }
        this.props.handleLoadingSpinner(false);
    }

    wsResponse = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response.data
                if (response.code !== 200) {
                    this.props.handleAlertInfo('error', response.data.message)
                }
            }
        }

        this.props.handleDeleteReset(true);
        this.props.refresh(this.props.changeRegion);
        this.props.handleLoadingSpinner(false);
    }

    onHandleDelete() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let method = serviceMC.getEP().getDeleteMethod(this.props.siteId);
        let data = serviceMC.getEP().getKey(this.props.siteId, this.props.selected);
        if (method && data) {
            let serviceBody = {
                token: store ? store.userToken : null,
                method: method,
                data: data
            }
            this.props.handleLoadingSpinner(true);
            if (this.props.siteId === 'ClusterInst' || this.props.siteId === 'appinst' || this.props.siteId === 'Cloudlet') {
                serviceBody.uuid = this.props.selected.uuid;
                serviceMC.sendWSRequest(serviceBody, this.wsResponse)
            } else {
                serviceMC.sendRequest(_self, serviceBody, this.httpResponse)
            }
        }
    }



    /** ************************ **/
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.open) {
            let name = '';
            this.setState({ showWarning: nextProps.open })
            if (nextProps.siteId == 'Organization') name = nextProps.selected.Organization
            else if (nextProps.siteId == 'User') name = nextProps.selected.Username
            else if (nextProps.siteId == 'Account') name = nextProps.selected.Username
            else if (nextProps.siteId == 'Cloudlet') name = nextProps.selected.CloudletName
            else if (nextProps.siteId == 'Flavors') name = nextProps.selected.FlavorName
            else if (nextProps.siteId == 'ClusterInst') name = nextProps.selected.ClusterName
            else if (nextProps.siteId == 'App') name = nextProps.selected.AppName
            else if (nextProps.siteId == 'appinst') name = nextProps.selected.AppName
            this.setState({ deleteName: name })
            let orgName = '';
            if (nextProps.siteId == 'User') orgName = nextProps.selected.Organization
            this.setState({ deleteOrg: orgName })


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
                <Modal.Header>{(this.props.siteId == 'User') ? `Delete ${this.props.siteId} from Organization` : `Delete ${this.props.siteId}`}</Modal.Header>
                <Modal.Content>
                    {(this.props.siteId == 'User') ?
                        <p>{'Are you sure you want to delete '}<b>{this.state.deleteName}</b>{' from '}<b>{this.state.deleteOrg}</b>{'?'}</p>
                        : <p>{'Are you sure you want to delete '}<b>{this.state.deleteName}</b>{'?'}</p>}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.closeDeleteModal('no')} negative>
                        No
                    </Button>
                    <Button
                        onClick={() => this.closeDeleteModal('yes')}
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
        selectOrg: state.selectOrg.org ? state.selectOrg.org : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleSelectOrg: (data) => { dispatch(actions.selectOrganiz(data)) },
        handleUserRole: (data) => { dispatch(actions.showUserRole(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleDeleteReset: (data) => { dispatch(actions.deleteReset(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(DeleteItem));
