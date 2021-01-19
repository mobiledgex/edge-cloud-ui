import React from 'react'
import MexForms, { INPUT, SELECT } from '../../../../hoc/forms/MexForms'
import { RECEIVER_TYPE_EMAIL, RECEIVER_TYPE_SLACK } from '../../../../constant';
import { fields } from '../../../../services/model/format';
class AlertReceiverPreferences extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            forms: []
        }
    }

    forms = () => (
        [
            { field: fields.severity, label: 'Severity', formType: SELECT, options: ["Info", "Warning", "Error"], visible: true, placeholder: 'Select Severity', tip: 'Default receiver type on auto create' },
            { field: fields.type, label: 'Receiver Type', formType: SELECT, options: [RECEIVER_TYPE_EMAIL, RECEIVER_TYPE_SLACK], visible: true, placeholder: 'Select Receiver Type', tip: 'Default receiver type on auto create' },
            { field: fields.slackchannel, label: 'Slack Channel', formType: INPUT, visible: true, rules: { onBlur: true }, placeholder: 'Input Slack Channel', tip: 'Default channel on auto create' },
            { field: fields.slackwebhook, label: 'Slack URL', formType: INPUT, visible: true, rules: { onBlur: true }, placeholder: 'Input Slack URL', tip: 'Default url on auto create' },
            { field: fields.email, label: 'Email', formType: INPUT, visible: true, rules: { onBlur: true }, placeholder: 'Input Email', tip: 'Default email on auto create' }
        ]
    )

    typeChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.slackchannel || form.field === fields.slackwebhook) {
                form.visible = currentForm.value === RECEIVER_TYPE_SLACK
            }
            else if (form.field === fields.email) {
                form.visible = currentForm.value === RECEIVER_TYPE_EMAIL
            }
        }
        if (!isInit) {
            this.setState({ forms })
        }
    }

    checkForms = (form, forms, isInit) => {
        if (form.field === fields.type) {
            this.typeChange(form, forms, isInit)
        }
    }

    onValueChange = (form) => {
        let data = this.props.data
        let forms = this.state.forms;
        this.checkForms(form, forms, false)
        data[form.field] = form.value
        this.props.update(data)
    }

    render() {
        const { forms } = this.state
        return (
            <MexForms headerWidth={5} forms={forms} onValueChange={this.onValueChange} style={{ height: 400, width: 600 }} />
        )
    }

    componentDidMount() {
        let forms = this.forms()
        let data = this.props.data
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (data) {
                form.value = data[form.field]
            }
            this.checkForms(form, forms, true)
        }
        this.setState({ forms })
    }
}

export default AlertReceiverPreferences