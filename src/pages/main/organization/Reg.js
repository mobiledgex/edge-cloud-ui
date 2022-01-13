import React, { Fragment } from "react";
import { withRouter } from 'react-router-dom';
import { Item, Step, Card, Form, Button } from 'semantic-ui-react';
//Mex
import MexForms, { SELECT, INPUT, SWITCH, MAIN_HEADER } from '../../../hoc/forms/MexForms';
import MexDetailViewer from '../../../hoc/datagrid/detail/DetailViewer'
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { additionalDetail } from '../../../services/model/shared';
import { fields } from '../../../services/model/format';
//model
import { keys, createOrganization, updateOrganization } from '../../../services/modules/organization';
import { addUser } from '../../../services/modules/users';
import { HELP_ORG_REG_3, HELP_ORG_REG_2, HELP_ORG_REG_1 } from "../../../tutorial";
import { Grid, List } from "@material-ui/core";
import { splitByCaps, toFirstUpperCase } from "../../../utils/string_utils";
import { perpetual } from "../../../helper/constant";

const stepData = [
    {
        step: "Step 1",
        description: "Create Organization"
    },
    {
        step: "Step 2",
        description: "Add User"
    },
    {
        step: "Step 3",
        description: "Review Organization"
    }
]
class OrganizationReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
        }
        this.isUpdate = this.props.isUpdate
        this.type = undefined
        this.roles = constant.legendRoles
        this.organizationInfo = null
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

    addUserForm = (data) => {
        let forms = this.step2(data)
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
        this.props.handleViewMode(HELP_ORG_REG_2);
    }


    onCreateOrganization = async (data) => {
        if (data) {
            this.organizationInfo = data
            this.type = toFirstUpperCase(data[fields.type])
            data[fields.type] = data[fields.type]
            let mcRequest = this.isUpdate ? await updateOrganization(this, data) : await createOrganization(this, data)
            if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                this.props.handleAlertInfo('success', `Organization ${data[fields.organizationName]} ${this.isUpdate ? 'updated' : 'created'} successfully`)
                this.isUpdate ? this.props.onClose() : this.addUserForm(data)
            }
        }
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

    render() {
        return (
            <div className="round_panel">
                <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                    {this.props.action || this.isUpdate ? null :
                        <div>
                            <Step.Group stackable='tablet' style={{ width: '100%' }}>
                                {
                                    stepData.map((item, i) => (
                                        <Step active={this.state.step === i} key={i} >
                                            <Step.Content>
                                                <Step.Title>{item.step}</Step.Title>
                                                <Step.Description>{item.description}</Step.Description>
                                            </Step.Content>
                                        </Step>
                                    ))
                                }
                            </Step.Group>
                            <br />
                        </div>}
                    {this.state.step === 2 ?
                        this.getStep3() :
                        <Grid container>
                            <Grid item xs={this.state.step === 1 ? 9 : 12}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
                            </Grid>
                            {this.state.step === 1 ?
                                <Grid item xs={3}>
                                    {Object.keys(this.roles).map((key, i) => (
                                        key.includes(this.type) ? this.makeCardContent(i, key, this.roles[key]) : null
                                    ))}
                                </Grid> : null}
                        </Grid>}
                </Item>
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

    step2 = (data) => {
        return [
            { label: 'Add User', formType: MAIN_HEADER, visible: true },
            { field: fields.username, label: 'Username', formType: INPUT, placeholder: 'Select Username', rules: { required: true }, visible: true },
            { field: fields.organizationName, label: 'Organization', formType: INPUT, placeholder: 'Enter Organization Name', rules: { disabled: true }, visible: true, value: data[fields.organizationName] },
            { field: fields.type, label: 'Type', formType: SELECT, placeholder: 'Enter Type', rules: { disabled: true, allCaps: true }, visible: true, value: data[fields.type] },
            { field: fields.role, label: 'Role', formType: SELECT, placeholder: 'Select Role', rules: { required: true }, visible: true },
        ]
    }

    step1 = () => {
        return [
            { label: `${this.isUpdate ? 'Update' : 'Create'} Organization`, formType: MAIN_HEADER, visible: true },
            { field: fields.type, label: 'Type', formType: 'Select', placeholder: 'Select Type', rules: { required: true, disabled: this.props.type !== undefined, allCaps: true }, visible: true },
            { field: fields.organizationName, label: 'Organization', formType: INPUT, placeholder: 'Enter Organization Name', rules: { required: true }, visible: true, },
            { field: fields.address, label: 'Address', formType: INPUT, placeholder: 'Enter Address', rules: { required: true }, visible: true, update: { edit: true } },
            { field: fields.phone, label: 'Phone', formType: INPUT, placeholder: 'Enter Phone Number', rules: { required: true }, visible: true, update: { edit: true }, dataValidateFunc: constant.validatePhone },
            { field: fields.publicImages, label: 'Public Image', formType: SWITCH, visible: true, value: false, update: { edit: true }, roles: [perpetual.ADMIN_MANAGER] }
        ]
    }

    loadDefaultData = async (data) => {
        data[fields.publicImages] = data[fields.publicImages] === perpetual.YES ? true : false
    }

    getFormData = (data) => {
        if (data) {
            if (this.isUpdate) {
                this.loadDefaultData(data)
            }
            else {
                this.type = toFirstUpperCase(data[fields.type])
                this.organizationInfo = data
                this.addUserForm(data)
                this.setState({ step: 1 })
                this.props.handleViewMode(HELP_ORG_REG_2);
                return
            }
        }

        let forms = this.step1()
        forms.push(
            { label: `${this.isUpdate ? 'Update' : 'Create'}`, formType: 'Button', onClick: this.onCreateOrganization, validate: true },
            { label: 'Cancel', formType: 'Button', onClick: this.onAddCancel })

        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.updateUI(form)
            if (data) {
                form.value = data[form.field]
                this.checkForms(form, forms, true)
            }
        }

        this.setState({
            forms: forms
        })


    }

    componentDidMount() {
        this.getFormData(this.props.data)
        this.props.handleViewMode(HELP_ORG_REG_1)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(OrganizationReg));