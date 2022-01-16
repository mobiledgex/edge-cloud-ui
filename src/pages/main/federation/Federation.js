import React, { Fragment } from "react";
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import DataView from '../../../container/DataView';
//Mex
import MexForms, { INPUT, BUTTON, POPUP_INPUT } from "../../../hoc/forms/MexForms";
import MexDetailViewer from '../../../hoc/datagrid/detail/DetailViewer'
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
import { Grid, Dialog, DialogTitle, List, DialogActions, makeStyles, Box, Card, IconButton, Typography, CardHeader, ListItem, Icon, DialogContent } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
//model
import { addUser } from '../../../services/modules/users';
import { HELP_FEDERATION_LIST } from "../../../tutorial";
import { splitByCaps, toFirstUpperCase } from "../../../utils/string_utils";
import { perpetual } from "../../../helper/constant";
import { showFederation, showFederationPartnerZone, multiDataRequest, iconKeys, keys, deleteFederation, registerFederation, deregisterFederation, setApiKey } from "../../../services/modules/federation"
import { showFederator, showFederatorSelfZone, deleteFederator, generateApiKey } from "../../../services/modules/federator"
import FederationReg from "./Reg"
import { redux_org } from '../../../helper/reduxData';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

class FederationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            currentView: null,
            open: false,
        },
            this.isUpdate = this.props.isUpdate
        this.type = undefined
        this.roles = constant.legendRoles
        this.organizationInfo = null
        this.keys = keys()
        this.apiKey = undefined
    }

    resetView = () => {
        if (this._isMounted) {
            this.updateState({ currentView: null })
        }
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }
    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data }, () => {
                console.log(data)
            })
        }
    }

    makeCardContent = (i, key, roles) => {
        return (
            <Grid container key={i}>
                <Card style={{ backgroundColor: '#18191E' }}>
                    <Card.Content>
                        <h4 style={{ color: '#A3A3A5', border: 'none', fontWeight: 700 }}>{splitByCaps(key)}</h4>
                        <Card.Description>
                            <List>
                                {
                                    Object.keys(roles).map((key, j) => (
                                        <div key={`${i}_${j}`} style={{ color: 'rgba(255,255,255,.6)' }}>{`${key} : ${roles[key]}`}</div>
                                    ))
                                }
                            </List>
                        </Card.Description>
                    </Card.Content>
                </Card>
                <br />
            </Grid>
        )
    }

    checkForms = (form, forms, isInit) => {

    }

    /**Required */
    /*Trigged when form value changes */
    onValueChange = (form) => {
        let forms = this.state.forms;
        this.checkForms(form, forms)
    }

    onFinalStep = () => {
        if (this.props.action === 'AddUser') {
            this.props.onClose()
        }
        else {
            this.setState({ step: 2 });
            this.props.handleViewMode(HELP_ORG_REG_3);
        }
    }

    onAddUser = async (data) => {
        let userList = this.organizationInfo.userList ? this.organizationInfo.userList : [];
        if (data) {
            data[fields.role] = toFirstUpperCase(this.type) + data[fields.role]
            let mcRequest = await addUser(this, data)
            if (mcRequest && mcRequest.response && mcRequest.response.data) {
                let message = mcRequest.response.data.message
                if (message === 'Role added to user') {
                    this.props.handleAlertInfo('success', `User ${data[fields.username]} added successfully`)
                    this.addUserForm(this.organizationInfo)
                    userList.push({
                        username: data[fields.username],
                        userRole: data[fields.role]
                    })
                }
            }
        }
        this.organizationInfo.userList = userList
    }

    addUserForm = () => {
        let forms = this.step2()
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                form.value = data[form.field]
                this.checkForms(form, forms, true)
            }
        }
        forms.push(
            { label: 'Add User', formType: 'Button', onClick: this.onAddUser, validate: true },
            { label: this.props.action === 'AddUser' ? 'Close' : 'Skip', formType: 'Button', onClick: this.onFinalStep })
        this.setState({
            type: data[fields.type],
            step: 1,
            forms: forms
        })
        this.props.handleViewMode(HELP_FEDERATION_LIST);
    }

    /*Required*/
    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    getStep3 = () => {
        this.organizationInfo[fields.publicImages] = this.organizationInfo[fields.publicImages] ? perpetual.YES : perpetual.NO
        return (
            <Fragment>
                <Grid container>
                    <Grid item xs={10}>
                        <Form>
                            <br />
                            <MexDetailViewer detailData={this.organizationInfo} keys={keys()} />
                            {additionalDetail(this.organizationInfo)}
                            <Form.Group className='orgButton' style={{ width: '100%' }}>
                                <Button className="newOrg3-4" onClick={(e) => { this.props.onClose() }} type='submit' positive style={{ width: '100%' }}>Return to Organizations</Button>
                            </Form.Group>
                        </Form>
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_FEDERATION,
            headerLabel: 'Partner Federation',
            requestType: [showFederation, showFederatorSelfZone, showFederator, showFederationPartnerZone],
            sortBy: [fields.region, fields.federationName],
            keys: this.keys,
            isRegion: true,
            // additionalDetail: shared.additionalDetail,
            viewMode: HELP_FEDERATION_LIST,
            grouping: true
            // formatData: this.dataFormatter
        })
    }
    customToolbar = () =>
    (
        redux_org.isViewer(this) ? null : <Box display='flex'>
            <Card style={{ margin: 10, width: '50%', maxHeight: 200, overflow: 'auto' }}>
                <CardHeader
                    avatar={
                        <IconButton aria-label="developer" disabled={true}>
                            <img src='/assets/images/handset-sdk-green.svg' alt="MobiledgeX" />
                        </IconButton>
                    }
                    title={
                        <Typography>
                            Share Zones With Partner
                        </Typography>
                    }
                    // subheader="Dynamically scale and deploy applications on Operator Edge geographically close to your end-users. Deploying to MobiledgeX's cloudlets provides applications the advantage of low latency, which can be extremely useful for real-time applications such as Augmented Reality, Mobile Gaming, Self-Driving Cars, Drones, etc."
                    action={
                        <IconButton aria-label="developer" onClick={() => { this.onAdd(perpetual.SHARE_ZONES_WITH_PARTNER) }}>
                            <ArrowForwardIosIcon style={{ fontSize: 20, color: lightGreen['A700'] }} />
                        </IconButton>
                    }
                />
            </Card>
            <Card style={{ margin: 10, width: '50%', maxHeight: 200, overflow: 'auto' }}>
                <CardHeader
                    avatar={
                        <IconButton aria-label="operator" disabled={true}>
                            <img src='/assets/images/cloudlet-green.svg' alt="MobiledgeX" />
                        </IconButton>
                    }
                    title={
                        <Typography>
                            Add Zones From Partner
                        </Typography>
                    }
                    // subheader='Register your cloudlet by providing MobiledgeX with a pool of compute resources and access to the OpenStack API endpoint by specifying a few required parameters, such as dynamic IP addresses, cloudlet names, location of cloudlets, certs, and more, using the Edge-Cloud Console. MobiledgeX relies on this information to remotely access the cloudlets to determine resource requirements as well as dynamically track usage.'
                    action={
                        <IconButton aria-label="operator" onClick={() => { this.onAdd(perpetual.ADD_ZONES_FROM_PARTNER) }}>
                            <ArrowForwardIosIcon style={{ fontSize: 20, color: lightGreen['A700'] }} />
                        </IconButton>
                    }
                />
            </Card>
        </Box>
    )


    onUpdate = (action, data) => {
        console.log(data, "data")
        this.updateState({ currentView: <FederationReg data={data} isUpdate={true} onClose={this.onRegClose} /> });
    }
    onDeleteRow = (action, data) => {
        console.log(data, "data")
        data.federationName ? deleteFederation(this, data) : deleteFederator(this, data)
    }
    onCreateFederation = (action, data) => {
        console.log(data, "data")
        this.updateState({ currentView: <FederationReg data={data} onClose={this.onRegClose} /> })
    }
    createVisible = (data) => {
        return data[fields.federationName] === undefined
    }
    registerVisible = (data) => {
        return data[fields.partnerRoleShareZonesWithSelf] !== perpetual.SELF_SHARE && data[fields.partnerRoleShareZonesWithSelf] !== perpetual.PARTNER_SHARE
    }
    deregisterVisible = (data) => {
        return data[fields.partnerRoleShareZonesWithSelf] === perpetual.SELF_SHARE && data[fields.partnerRoleShareZonesWithSelf] === perpetual.PARTNER_SHARE
    }
    setApiKeyVisible = (data) => {
        return data[fields.federationName] !== undefined
    }
    onGenerateApiKey = async (action, data) => {
        let mcRequest = await generateApiKey(this, data)
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', 'Api Key generated successfully')
            this.apiKey = mcRequest.response.data.apikey
            this.updateState({
                open: true
            })
        }
    }
    setApiKey = async (action, data) => {
        let mcRequest = await setApiKey(this, data)
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', 'Api Key updated successfully')
            this.apiKey = mcRequest.response.data.apikey
            this.updateState({
                open: false
            })
        }
    }
    onSetApiKey = (action, data) => {
        this.updateState({
            open: true
        })
        this.forms(data)
    }

    forms = (data) => {
        console.log(data)
        return [
            { field: fields.operatorName, label: 'Operator', formType: INPUT, placeholder: 'Enter Operator', rules: { required: true, disabled: !redux_org.isAdmin(this) }, visible: true, dependentData: [{ index: 1, field: fields.region }], tip: 'Organization of the federation site' },
            { field: fields.apiKey, label: 'Api Key', formType: INPUT, placeholder: 'Enter Partner Api Key', rules: { required: true }, visible: true, tip: 'API Key used for authentication (stored in secure storage)' },
            { field: fields.federationName, label: 'Federation Name', formType: INPUT, placeholder: 'Enter Partner Fderation Name', rules: { required: true }, visible: true, tip: 'Name to uniquely identify a federation' }
        ]
    }
    handleClose = () => {
        this.updateState({
            open: false
        })
        this.apiKey = undefined // to reset when there is no page reload
    }
    actionMenu = () => {
        return [
            { id: perpetual.ACTION_CREATE, label: 'Create Federation', visible: this.createVisible, onClick: this.onCreateFederation, type: 'Create' },
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Udate', edit: true },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: this.onDeleteRow, type: 'Delete' },
            { id: perpetual.ACTION_REGISTER, label: 'Register', visible: this.registerVisible, onClick: registerFederation, type: 'Register' },
            { id: perpetual.ACTION_DEREGISTER, label: 'DeRegister', visible: this.deregisterVisible, onClick: deregisterFederation, type: 'DeRegister' },
            { id: perpetual.ACTION_GENERATE_API_KEY, label: 'Generate API Key', onClick: this.onGenerateApiKey, type: 'Generate API Key' },
            { id: perpetual.ACTION_UPDATE, label: 'Add Partner Details', onClick: this.onAdd, type: 'Add Partner Details' },
            { id: perpetual.ACTION_SET_API_KEY, label: 'Update Partner API Key', visible: this.setApiKeyVisible, onClick: this.onSetApiKey, type: 'Update Partner API Key' },
            { id: perpetual.ACTION_UPDATE, label: 'Register Partner API Key', onClick: this.onAdd, type: 'Register Partner API Key' },
        ]
    }
    onValueChange = (form) => {

    }



    renderSetApiForms = () => (
        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} style={{ marginTop: 5 }} />
    )

    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    render() {
        const { tableHeight, currentView, open } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_FEDERATION} multiDataRequest={multiDataRequest} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} customToolbar={this.customToolbar} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} />
                <Dialog open={true} onClose={this.onClose} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    {/* {loading ? <LinearProgress /> : null} */}
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>{this.apiKey ? 'API Key' : 'Set API Key'}</h3>
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        {this.apiKey ? (<><h5>Api Key : </h5> <span id="apikey">{this.apiKey}</span> <Icon name="copy outline"></Icon></>) : this.renderSetApiForms()}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} style={{ backgroundColor: 'rgba(118, 255, 3, 0.7)' }} size='small'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    resetFormValue = (form) => {
        let rules = form.rules
        if (rules) {
            let disabled = rules.disabled ? rules.disabled : false
            if (!disabled) {
                form.value = undefined;
            }
        }
    }

    updateUI(form) {
        if (form) {
            this.resetFormValue(form)
            if (form.field) {
                if (form.formType === SELECT) {
                    switch (form.field) {
                        case fields.type:
                            form.options = ['developer', 'operator']
                            form.value = this.props.type
                            break;
                        case fields.role:
                            form.options = ['Manager', 'Contributor', 'Viewer']
                            break;
                    }
                }
            }
        }
    }


    onAdd = (type) => {
        this.updateState({ currentView: <FederationReg onClose={this.onRegClose} /> });
    }
    getFormData = () => {

        let forms = this.forms()
        forms.push({ label: 'Set', formType: BUTTON, onClick: this.onCreate, validate: true })
        forms.push({ label: 'Cancel', formType: BUTTON, onClick: this.handleClose })
        this.updateState({
            forms: forms
        })
    }
    componentDidMount() {
        this._isMounted = true
        this.getFormData()
        this.props.handleViewMode(HELP_FEDERATION_LIST)
    }

};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(FederationList));