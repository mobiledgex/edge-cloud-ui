import React, { Fragment } from "react";
import { withRouter } from 'react-router-dom';
import { Item, Step, Grid, Card, List, Form, Header, Button } from 'semantic-ui-react';
//Mex
import MexForms, { SELECT, INPUT, CHECKBOX } from '../../../hoc/forms/MexForms';
import MexDetailViewer from '../../../hoc/dataViewer/DetailViewer'
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
//model
import { keys, createOrganization } from '../../../services/model/organization';
import { addUser } from '../../../services/model/users';
import { } from '../../../services/model/cloudlet';

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

const roles =
{
    Developer: [
        {
            'Users & Roles': 'Manage',
            'Cloudlets': 'View',
            'Flavors': 'View',
            'Cluster Instances': 'Manage',
            'Apps': 'Manage',
            'App Instances': 'Manage',
            'Policies': 'Manage',
            'Monitoring' : 'Manage',
            'Audit Logs' : 'Manage'
        },
        {
            'Users & Roles': 'View',
            'Cloudlets': 'View',
            'Flavors': 'View',
            'Cluster Instances': 'Manage',
            'Apps': 'Manage',
            'App Instances': 'Manage',
            'Policies': 'Manage',
            'Monitoring' : 'Manage',
            'Audit Logs' : 'Manage'
        },
        {
            'Users & Roles': 'View',
            'Cloudlets': 'View',
            'Flavors': 'View',
            'Cluster Instances': 'View',
            'Apps': 'View',
            'App Instances': 'View',
            'Policies': 'Manage',
            'Monitoring' : 'Manage',
            'Audit Logs' : 'Manage'
        }
    ],
    Operator: [
        {
            'Users & Roles': 'Manage',
            'Cloudlets': 'Manage',
            'Flavors': 'disabled',
            'Cluster Instances': 'disabled',
            'Apps': 'disabled',
            'App Instances': 'disabled',
            'Policies': 'disabled',
            'Monitoring' : 'Manage',
            'Audit Logs' : 'Manage'
        },
        {
            'Users & Roles': 'View',
            'Cloudlets': 'Manage',
            'Flavors': 'disabled',
            'Cluster Instances': 'disabled',
            'Apps': 'disabled',
            'App Instances': 'disabled',
            'Policies': 'disabled',
            'Monitoring' : 'Manage',
            'Audit Logs' : 'Manage'
        },
        {
            'Users & Roles': 'View',
            'Cloudlets': 'View',
            'Flavors': 'disabled',
            'Cluster Instances': 'disabled',
            'Apps': 'disabled',
            'App Instances': 'disabled',
            'Policies': 'disabled',
            'Monitoring' : 'Manage',
            'Audit Logs' : 'Manage'
        },
    ]
}

const items = [
    {
        header: 'Manager',
        description: `Leverage agile frameworks to provide a robust synopsis \n\r for high level overviews.`,
        meta: 'ROI: 30%',
    },
    {
        header: 'Contributor',
        description: 'Bring to the table win-win survival strategies to ensure proactive domination.',
        meta: 'ROI: 34%',
    },
    {
        header: 'Viewer',
        description:
            'Capitalise on low hanging fruit to identify a ballpark value added activity to beta test.',
        meta: 'ROI: 27%',
    },
]

class OrganizationReg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            forms: [],
        }
        this.type = null
        this.organizationInfo = null
        //To avoid refecthing data from server
    }

    makeRoleList = (selectedType, i) => {
        return (
            <List divided verticalAlign='middle'>
                <List.Item>
                    <List.Content>
                        {
                            Object.keys(roles[selectedType][i]).map((key) => (
                                <List.Header key={key}><div style={{ color: ((roles[selectedType][i][key] === 'Manage') ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.6)') }}>{key + " : " + (roles[selectedType][i][key])}</div></List.Header>
                            ))
                        }

                    </List.Content>
                </List.Item>
            </List>
        )
    }

    makeCardContent = (item, i, type) => (
        <Grid.Row key={i}>
            <Card style={{ backgroundColor: '#18191E' }}>
                <Card.Content>
                    <Card.Header style={{ color: '#A3A3A5' }}>{item['header']}</Card.Header>
                    <Card.Meta style={{ color: '#A3A3A5' }}>{type}</Card.Meta>
                    <Card.Description>
                        {this.makeRoleList(type, i)}
                    </Card.Description>
                </Card.Content>
            </Card>
            <br />
        </Grid.Row>
    )



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
            this.setState({ step: 2 })
        }
    }

    onAddUser = async (data) => {

        if (data) {
            data[fields.role] = this.type + data[fields.role]
            let mcRequest = await addUser(this, data)
            if (mcRequest && mcRequest.response && mcRequest.response.data) {
                let message = mcRequest.response.data.message
                if (message === 'Role added to user') {
                    this.props.handleAlertInfo('success', `User ${data[fields.username]} added successfully`)
                    this.addUserForm(this.organizationInfo)
                }
            }
        }
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
    }


    onCreateOrganization = async (data) => {
        if (data) {
            this.organizationInfo = data
            this.type = data[fields.type]
            data[fields.type] = data[fields.type].toLowerCase()
            let mcRequest = await createOrganization(this, data)
            if (mcRequest && mcRequest.response && mcRequest.response.data) {
                let message = mcRequest.response.data.message
                if (message === 'Organization created') {
                    this.props.handleAlertInfo('success', `Organization ${data[fields.organizationName]} created successfully`)
                    this.addUserForm(data)
                }
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
        let organizationName = this.organizationInfo[fields.organizationName]
        this.organizationInfo[fields.publicImages] = this.organizationInfo[fields.publicImages] ? constant.YES : constant.NO
        return (
            <Fragment>
                <Grid>
                    <Grid.Column width={11}>
                        <Form>
                            <Header className="newOrg3-1">{`Organization "` + organizationName + `" has been created.`}</Header>
                            <MexDetailViewer detailData={this.organizationInfo} keys={keys()}/>
                            <Form.Group className='orgButton' style={{ width: '100%' }}>
                                <Button className="newOrg3-4" onClick={(e) => { this.props.onClose() }} type='submit' positive style={{ width: '100%' }}>Return to Organizations</Button>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={5}>
                    </Grid.Column>
                </Grid>
            </Fragment>
        )
    }

    render() {
        return (
            <div className="round_panel">
                <div className="grid_table" style={{ height: constant.getHeight(), overflow: 'auto' }}>

                    <Item className='content create-org' style={{ margin: '30px auto 0px auto', maxWidth: 1200 }}>
                        {this.props.action ? null :
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
                            </div>}
                        {this.state.step === 2 ?
                            this.getStep3() :
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={this.state.step === 1 ? 12 : 16}>
                                        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                                    </Grid.Column>
                                    {this.state.step === 1 ?
                                        <Grid.Column width={4}>
                                            {items.map((item, i) => (
                                                this.makeCardContent(item, i, this.type)
                                            ))}
                                        </Grid.Column> : null}
                                </Grid.Row>
                            </Grid>}
                    </Item>
                </div>
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
                            form.options = ['Developer', 'Operator']
                            break;
                        case fields.role:
                            form.options = ['Manager', 'Contributor', 'Viewer']
                            break;
                    }
                }
            }
        }
    }

    validatePhone= (form) => {
        if (!/^\+?(?:[0-9] ?){6,14}[0-9]$/.test(form.value)) {
            form.error = 'Phone should only contain "+" and 7~15 digits.'
            return false;
        }
        else {
            form.error = undefined
            return true;
        }

    }

    step2 = (data) => {
        return [
            { label: 'Add User', formType: 'Header', visible: true },
            { field: fields.username, label: 'Username', formType: INPUT, placeholder: 'Select Username', rules: { required: true }, visible: true },
            { field: fields.organizationName, label: 'Organization', formType: INPUT, placeholder: 'Enter Organization Name', rules: { disabled: true }, visible: true, value: data[fields.organizationName] },
            { field: fields.type, label: 'Type', formType: INPUT, placeholder: 'Enter Type', rules: { disabled: true }, visible: true, value: data[fields.type] },
            { field: fields.role, label: 'Role', formType: SELECT, placeholder: 'Select Role', rules: { required: true }, visible: true },
        ]
    }

    step1 = () => {
        return [
            { label: 'Create Organization', formType: 'Header', visible: true },
            { field: fields.type, label: 'Type', formType: 'Select', placeholder: 'Select Type', rules: { required: true }, visible: true },
            { field: fields.organizationName, label: 'Organization Name', formType: INPUT, placeholder: 'Enter Organization Name', rules: { required: true }, visible: true, },
            { field: fields.address, label: 'Address', formType: INPUT, placeholder: 'Enter Address', rules: { required: true }, visible: true, },
            { field: fields.phone, label: 'Phone', formType: INPUT, placeholder: 'Enter Phone Number', rules: { required: true }, visible: true, dataValidateFunc: this.validatePhone},
            { field: fields.publicImages, label: 'Public Image', formType: CHECKBOX, visible: true, value:false }
        ]
    }

    loadDefaultData = async (data) => {
        if (data) {

        }
    }

    getFormData = (data) => {
        if (data) {
            this.type = data[fields.type] === 'developer' ? 'Developer' : 'Operator'
            this.organizationInfo = data
            this.addUserForm(data)
            this.setState({ step: 1 })
        }
        else {


            let forms = this.step1()
            forms.push(
                { label: 'Create Organization', formType: 'Button', onClick: this.onCreateOrganization, validate: true },
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

    }

    componentDidMount() {
        this.getFormData(this.props.data)
    }
};

const mapStateToProps = (state) => {
    return{}
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(OrganizationReg));