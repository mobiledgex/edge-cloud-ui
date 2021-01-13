import React from 'react'
import MexForms, { CHECKBOX, INPUT, SELECT } from '../../../../hoc/forms/MexForms'
import { RECEIVER_TYPE_EMAIL, RECEIVER_TYPE_SLACK } from '../../../../constant';

export const PREF_RECEIVER_TYPE = 'ReceiverType'
export const PREF_SLACK_CHANNEL = 'SlackChannel'
export const PREF_SLACK_URL = 'SlackURL'
export const PREF_EMAIL = 'Email'
export const PREF_SEVERITY = 'Severity'


class AlertReceiverPreferences extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            forms: []
        }
    }

    forms = () => (
        [
            { field: PREF_SEVERITY, label: 'Severity', formType: SELECT, options: ["Info", "Warning", "Error"], visible: true, placeholder: 'Select Severity', tip: 'Default receiver type on auto create' },
            { field: PREF_RECEIVER_TYPE, label: 'Receiver Type', formType: SELECT, options: [RECEIVER_TYPE_EMAIL, RECEIVER_TYPE_SLACK], visible: true, placeholder: 'Select Receiver Type', tip: 'Default receiver type on auto create' },
            { field: PREF_SLACK_CHANNEL, label: 'Slack Channel', formType: INPUT, visible: true, rules: { onBlur: true }, placeholder: 'Input Slack Channel', tip: 'Default channel on auto create' },
            { field: PREF_SLACK_URL, label: 'Slack URL', formType: INPUT, visible: true, rules: { onBlur: true }, placeholder: 'Input Slack URL', tip: 'Default url on auto create' },
            { field: PREF_EMAIL, label: 'Email', formType: INPUT, visible: true, rules: { onBlur: true }, placeholder: 'Input Email', tip: 'Default email on auto create' }
        ]
    )

    typeChange = (currentForm, forms, isInit) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === PREF_SLACK_CHANNEL || form.field === PREF_SLACK_URL) {
                form.visible = currentForm.value === RECEIVER_TYPE_SLACK
            }
            else if (form.field === PREF_EMAIL) {
                form.visible = currentForm.value === RECEIVER_TYPE_EMAIL
            }
        }
        if (!isInit) {
            this.setState({ forms })
        }
    }

    checkForms = (form, forms, isInit) => {
        if (form.field === PREF_RECEIVER_TYPE) {
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
            form.value = data[form.field]
            this.checkForms(form, forms, true)
        }
        this.setState({ forms })
    }
}

export default AlertReceiverPreferences