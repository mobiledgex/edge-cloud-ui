import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../../../actions';
import MexForms, { INPUT, BUTTON } from '../../../../../hoc/forms/MexForms';
import { fields } from '../../../../../services';
import { responseValid } from '../../../../../services/service';
import { setApiKey } from '../../../../../services/modules/federation';
import { LinearProgress } from '@material-ui/core';
import { InfoDialog } from '../../../../../hoc/mexui';


class APIKey extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            forms: [],
            loading: false
        }
        this._isMounted = false
    }

    elements = () => (
        [
            { field: fields.operatorName, label: 'Operator', formType: INPUT, rules: { required: true, disabled: true }, visible: true },
            { field: fields.federationName, label: 'Federation Name', formType: INPUT, rules: { required: true, disabled: true }, visible: true },
            { field: fields.apiKey, label: 'API Key', placeholder: 'Enter API Key', formType: INPUT, rules: { required: true }, visible: true },
        ]
    )

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    onValueChange = (form) => {
    }

    render() {
        const { forms, loading } = this.state
        const { data } = this.props
        return (
            <InfoDialog open={Boolean(data)} title={'Update API Key'}>
                {loading ? <LinearProgress /> : null}
                <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} style={{ marginTop: 5 }} />
            </InfoDialog>
        )
    }

    onCreate = async (data) => {
        this.updateState({ loading: true })
        let mc = await setApiKey(this, { selfoperatorid: data[fields.operatorName], name: data[fields.federationName], apikey: data[fields.apiKey] })
        this.updateState({ loading: false })
        if (responseValid(mc)) {
            this.props.handleAlertInfo('success', `API key changed for  ${data[fields.federationName]}`)
            this.props.onClose()
        }
    }

    componentDidMount() {
        this._isMounted = true
        const { data, onClose } = this.props
        let forms = this.elements()
        for (let form of forms) {
            if (data) {
                form.value = data[form.field]
            }
        }
        forms.push({ label: 'Update', formType: BUTTON, onClick: this.onCreate, validate: true, visible: true })
        forms.push({ label: 'Cancel', formType: BUTTON, onClick: onClose, visible: true })
        this.updateState({ forms })
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default connect(null, mapDispatchProps)(APIKey);