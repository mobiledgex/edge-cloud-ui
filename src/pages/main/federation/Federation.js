import React, { Fragment } from "react";
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import DataView from '../../../container/DataView';
//Mex
import { SELECT, INPUT, SWITCH, MAIN_HEADER } from '../../../hoc/forms/MexForms';
import MexDetailViewer from '../../../hoc/datagrid/detail/DetailViewer'
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
import { Box, Card, IconButton, Typography, CardHeader } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
//model
import { addUser } from '../../../services/modules/users';
import { HELP_FEDERATION_LIST } from "../../../tutorial";
import { Grid, List } from "@material-ui/core";
import { splitByCaps, toFirstUpperCase } from "../../../utils/string_utils";
import { perpetual } from "../../../helper/constant";
import { showFederation, showFederationPartnerZone, multiDataRequest, iconKeys, keys } from "../../../services/modules/federation"
import { showFederator, showFederatorSelfZone, createFederator } from "../../../services/modules/federator"
import FederationReg from "./Reg"
import { uiFormatter } from '../../../helper/formatter'
import { redux_org } from '../../../helper/reduxData';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

// const stepData = [
//     {
//         step: "Step 1",
//         description: "Create Organization"
//     },
//     {
//         step: "Step 2",
//         description: "Add User"
//     },
//     {
//         step: "Step 3",
//         description: "Review Organization"
//     }
// ]
class FederationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
            currentView: null,
        },
            this.isUpdate = this.props.isUpdate
        this.type = undefined
        this.roles = constant.legendRoles
        this.organizationInfo = null
        this.keys = keys()
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


    onCreateFederator = async (data) => {
        this.addUserForm()
        // if (data) {
        //     this.organizationInfo = data
        //     this.type = toFirstUpperCase(data[fields.type])
        //     data[fields.type] = data[fields.type]
        //     let mcRequest = this.isUpdate ? await updateFederator(this, data) : await createFederator(this, data)
        //     if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
        //         this.props.handleAlertInfo('success', `Federator ${data[fields.organizationName]} ${this.isUpdate ? 'updated' : 'created'} successfully`)
        //         this.isUpdate ? this.props.onClose() : this.addUserForm(data)
        //     }
        // }
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
            id: perpetual.PAGE_ORGANIZATIONS,
            headerLabel: 'Partner Federation',
            requestType: [showFederation, showFederatorSelfZone, showFederator, showFederationPartnerZone],
            sortBy: [fields.federationName],
            keys: this.keys,
            iconKeys: iconKeys(),
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
    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', visible: this.onUpdateVisible, onClick: this.onUpdate, type: 'Udate' },
            { id: perpetual.ACTION_UPDATE, label: 'Delete', visible: this.onUpdateVisible, onClick: this.onAdd, type: 'Delete' },
            { id: perpetual.ACTION_UPDATE, label: 'Register', visible: this.onUpdateVisible, onClick: this.onAdd, type: 'Register' },
            { id: perpetual.ACTION_UPDATE, label: 'Generate API Key', visible: this.onUpdateVisible, onClick: this.onAdd, type: 'Generate API Key' },
            { id: perpetual.ACTION_UPDATE, label: 'Add Partner Details', visible: this.onUpdateVisible, onClick: this.onAdd, type: 'Add Partner Details' },
            { id: perpetual.ACTION_UPDATE, label: 'Update Partner API Key', visible: this.onUpdateVisible, onClick: this.onAdd, type: 'Update Partner API Key' },
            { id: perpetual.ACTION_UPDATE, label: 'Register Partner API Key', visible: this.onUpdateVisible, onClick: this.onAdd, type: 'Register Partner API Key' },
            { id: perpetual.ACTION_UPDATE, label: 'DeRegister Partner API Key', visible: this.onUpdateVisible, onClick: this.onAdd, type: 'DeRegister Partner API Key' },

        ]
    }
    render() {
        const { tableHeight, currentView } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_FEDERATION} multiDataRequest={multiDataRequest} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} customToolbar={this.customToolbar} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} />
            </div>
        )
    }

    onAddCancel = () => {
        this.props.onClose(false)
    }

    getOptions = (dataList, form) => {
        if (dataList && dataList.length > 0) {
            return dataList.map(data => {
                let info = form ? data[form.field] : data
                return { key: info, value: info, text: info }
            })
        }
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
        console.log(type, "type")
        this.updateState({ currentView: <FederationReg onClose={this.onRegClose} /> });
    }

    componentDidMount() {
        this._isMounted = true
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