import React from 'react'
import MexForms, { CHECKBOX, INPUT } from '../../../../hoc/forms/MexForms'

export const PREF_MAP = 'Map'
export const PREF_PREFIX_SEARCH = 'PrefixSearch'

class DatatablePreferences extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            forms: []
        }
    }

    forms = () => (
        [
            { field: PREF_MAP, label: 'Map', value: false, formType: CHECKBOX, visible:true, tip: 'Show map by default' },
            { field: PREF_PREFIX_SEARCH, label: 'Prefix Search', formType: INPUT, visible:true, rules:{onBlur:true}, placeholder:'Prefix search with default value', tip: 'Default prefix added to the search'}
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
            <MexForms headerWidth={5} forms={forms} onValueChange={this.onValueChange} style={{ height: 400, width: 600 }} />
        )
    }

    componentDidMount() {
        let forms = this.forms()
        let data = this.props.data
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            this.checkForms(form, forms, true)
            form.value = data[form.field]
        }
        this.setState({ forms })
    }
}

export default DatatablePreferences