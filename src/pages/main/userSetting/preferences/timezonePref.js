import React from 'react'
import MexForms, { SELECT } from '../../../../hoc/forms/MexForms'
import { timezoneName, timezones } from '../../../../utils/date_util'
import { PREF_TIMEZONE } from '../../../../utils/sharedPreferences_util'

class DatatablePreferences extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            forms: []
        }
    }

    forms = () => (
        [
            { field: PREF_TIMEZONE, label: 'Timezone', formType: SELECT, visible: true, placeholder: 'Select Timezone', tip: 'Override browser timezone', options: timezones() }
        ]
    )

    checkForms = (form, forms, isInit) => {

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
            <div style={{ paddingLeft: 15 }}>
                <MexForms headerWidth={5} forms={forms} onValueChange={this.onValueChange} style={{ height: 400, width: 600 }} />
            </div>
        )
    }

    componentDidMount() {
        let forms = this.forms()
        let data = this.props.data
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.checkForms(form, forms, true)
            if (form.field === PREF_TIMEZONE) {
                form.value = data[form.field] ? data[form.field] : timezoneName()
            }
            else {
                form.value = data[form.field]
            }
        }
        this.setState({ forms })
    }
}

export default DatatablePreferences