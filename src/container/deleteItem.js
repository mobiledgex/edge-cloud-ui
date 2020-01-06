import React from 'react';
import { Button, Modal } from "semantic-ui-react";
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import * as serviceMC from "../services/serviceMC";
import * as FormatComputeClouldlet from "../services/formatter/formatComputeCloudlet";
import * as FormatClusterInstance from "../services/formatter/formatComputeClstInstance";
import * as FormatAppInstance from "../services/formatter/formatComputeInstance";

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

    /***************************
     * delete selected item
     * @param result
     ***************************/
    receiveSubmitResult = (result, body) => {
        if (result.data.error) {
            this.props.handleAlertInfo('error', result.data.error)
        } else {
            console.log('20191119 receive submit result is success..', result, ":", result.data)
            this.props.handleAlertInfo('success', result.data.message)
        }
        if (this.props.siteId !== 'appinst' || body.params.appinst.key.cluster_inst_key.cluster_key.name.indexOf('autocluster') > -1) {
            setTimeout(() => {
                _self.props.refresh(this.props.changeRegion);
            }, 3000);
        }
    }


    receiveListSubmit = (mcRequest) => {
        let result = mcRequest.response;
        let data = mcRequest.request.data;
        let msg = '';
        if (this.props.siteId == 'Cloudlet') msg = 'Cloudlet ' + data.cloudlet.key.name
        else if (this.props.siteId == 'Flavors') msg = 'Flavor ' + data.flavor.key.name
        else if (this.props.siteId == 'App') msg = 'Your application ' + data.app.key.name

        this.props.handleLoadingSpinner(false);
        this.props.refresh(this.props.changeRegion)

        if (result.data.error) {
            if (result.data.error.indexOf('Flavor in use by Cluster') > -1) {
                this.props.handleAlertInfo('error', 'Error deleting ' + data.flavor.key.name + '. Flavor is in use by a Cluster Instance.')
            } else {
                this.props.handleAlertInfo('error', result.data.error)
            }

        } else if (result.data.message) {
            this.props.handleAlertInfo('success', msg + ' deleted successfully.')
        }
    }

    receiveUserSubmit = (mcRequest) => {

        let result = mcRequest.response;
        let request = mcRequest.request;
        let msg = '';
        if (this.props.siteId === 'Organization') {
            msg = 'Your organization ' + request.data.name + ' deleted successfully'
        } else if (this.props.siteId === 'User') {
            msg = 'User ' + request.data.username + ' removed from organization ' + request.data.org
        } else if (this.props.siteId === 'Account') {
            msg = 'User ' + _self.state.deleteName + ' removed from console '
        }

        this.props.handleLoadingSpinner(false);
        if (result.data.message) {
            this.props.handleAlertInfo('success', msg)
        } else if (result.data.error) {
            this.props.handleAlertInfo('error', result.data.error)
        }
        if (this.props.siteId === 'Organization' && request.data.name == localStorage.selectOrg) {
            localStorage.setItem('selectRole', '')
            localStorage.setItem('selectOrg', '')
            this.props.handleSelectOrg('-')
            this.props.handleUserRole('')
        }
        _self.props.refresh('All');
    }

    closeDeleteModal(confirm) {
        _self.setState({ showWarning: false })
        _self.props.close()
        if (confirm === 'yes') {
            _self.onHandleDelete()
        }
    }



    onHandleDelete() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let serviceBody = { uuid: serviceMC.generateUniqueId(), token: store ? store.userToken : null }
        this.props.handleLoadingSpinner(true);
        if (this.props.siteId === 'ClusterInst' || this.props.siteId === 'appinst' || this.props.siteId === 'Cloudlet') {
            this.wsRequest(this.props.siteId, serviceBody)
        } else if (this.props.siteId === 'User') {
            let userArr = [];
            Object.values(this.props.selected).map((item) => {
                userArr.push(item);
            })
            serviceBody.method = serviceMC.getEP().DELETE_USER;
            serviceBody.data = {
                org: userArr[1],
                username: userArr[0],
                role: userArr[2]
            }
            serviceMC.sendRequest(serviceBody, this.receiveUserSubmit)
        } else if (this.props.siteId === 'Account') {
            let userArr = [];
            Object.values(this.props.selected).map((item, i) => {
                userArr.push(item);
            })
            serviceBody.method = serviceMC.getEP().DELETE_ACCOUNT;
            serviceBody.data = {
                name: userArr[0]
            }
            serviceMC.sendRequest(serviceBody, this.receiveUserSubmit)
        } else if (this.props.siteId === 'Organization') {
            const { Organization, Type, Address, Phone } = this.props.selected
            serviceBody.method = serviceMC.getEP().DELETE_ORG;
            serviceBody.data = {
                name: Organization,
                type: Type,
                address: Address,
                phone: Phone
            }
            serviceMC.sendRequest(serviceBody, this.receiveUserSubmit)
        } else if (this.props.siteId === 'Flavors') {
            const { FlavorName, Region } = this.props.selected
            serviceBody.method = serviceMC.getEP().DELETE_FLAVOR;
            serviceBody.data = {
                region: Region,
                flavor: {
                    key: { name: FlavorName }
                }
            }
            serviceMC.sendRequest(serviceBody, this.receiveListSubmit)
        } else if (this.props.siteId === 'App') {
            const { OrganizationName, AppName, Version, Region } = this.props.selected
            serviceBody.method = serviceMC.getEP().DELETE_APP;
            serviceBody.data = {
                region: Region,
                app: {
                    key: {
                        developer_key: { name: OrganizationName },
                        name: AppName,
                        version: Version
                    }
                }
            }
            serviceMC.sendRequest(serviceBody, this.receiveListSubmit)
        }

    }

    wsResponse = (mcRequest) => {
        if (mcRequest) {
            //let result = mcRequest.response;
            //let request = mcRequest.request;
        }

        this.props.handleDeleteReset(true);
        this.props.refresh(this.props.changeRegion);
        this.props.handleLoadingSpinner(false);
    }


    wsRequest = (requestType, serviceBody) => {
        let data = this.props.selected;
        switch (requestType) {
            case 'Cloudlet':
                serviceBody.method = serviceMC.getEP().DELETE_CLOUDLET;
                serviceBody.data = FormatComputeClouldlet.key(data)
                break;

            case 'ClusterInst':
                serviceBody.method = serviceMC.getEP().DELETE_CLUSTER_INST;
                serviceBody.data = FormatClusterInstance.key(data)
                break;

            case 'appinst':
                serviceBody.method = serviceMC.getEP().DELETE_APP_INST;
                serviceBody.data = FormatAppInstance.key(data)
                break;
        }
        serviceMC.sendWSRequest(serviceBody, this.wsResponse)
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
