
import React from 'react'
import { Accordion as MuiAccordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CHECKBOX_ARRAY } from '../../../../hoc/forms/MexForms'
import { withStyles } from '@material-ui/styles';
import { PREF_MONITORING } from './preferences';
import CheckBoxArray from '../../../../hoc/forms/CheckBoxArray'

const cloudletVisibility = ['CPU', 'Memory', 'Disk', 'Map', 'Event']
const clusterVisibility = ['CPU', 'Memory', 'Disk', 'Sent', 'Received', 'Map']
const appInstVisibility = ['CPU', 'Memory', 'Disk', 'Sent', 'Received', 'Active', 'Map', 'Event', 'Client']

const cloudletForms = [
    { field: 'cloudletVisibility', label: 'Visibility', formType: CHECKBOX_ARRAY, value: cloudletVisibility, options: cloudletVisibility },
]

const clusterForms = [
    { field: 'clusterVisibility', label: 'Visibility', formType: CHECKBOX_ARRAY, value: clusterVisibility, options: clusterVisibility },
]

const appInstForms = [
    { field: 'appInstVisibility', label: 'Visibility', formType: CHECKBOX_ARRAY, value: appInstVisibility, options: appInstVisibility },
]

const Accordion = withStyles({
    root: {
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        '&:not(:last-child)': {
            borderBottom: '1px solid rgba(0, 0, 0, .125)',
        },
        boxShadow: 'none',
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

class MonitoringPreferences extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            forms: []
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }


    forms = () => ([
        { field: 'region', label: 'Region', formType: CHECKBOX_ARRAY, value: this.regions, expanded: true, options: this.regions },
        { label: 'Cloudlet', forms: cloudletForms },
        { label: 'Cluster', forms: clusterForms },
        { label: 'App Instances', forms: appInstForms }
    ])

    onValueChange = (index, form, option) => {
        if (form.value.includes(option)) {
            form.value = form.value.filter(item => {
                return item !== option
            })
        }
        else {
            form.value.push(option)
        }
        this.setState(prevState => {
            let forms = prevState.forms
            if (form.parentIndex) {
                forms[form.parentIndex].forms[index] = form
            }
            else {
                forms[index] = form
            }
            return { forms }
        })

        let data = this.props.data
        data[PREF_MONITORING] = data[PREF_MONITORING] ? data[PREF_MONITORING] : {}
        data[PREF_MONITORING][form.field] = form.value
        this.props.update(data)
    }

    render() {
        const { forms } = this.state
        return (
            <div>
                {forms.map((form, i) => (
                    form.forms ?
                        <Accordion key={i}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={i}
                                id={i}
                            >
                                <Typography >{form.label}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {form.forms.map((childForm, j) => {
                                    childForm.parentIndex = i
                                    return (
                                        <React.Fragment key={j}>
                                            <CheckBoxArray postion={j} form={childForm} onChange={this.onValueChange} />
                                        </React.Fragment>
                                    )
                                })}
                            </AccordionDetails>
                        </Accordion> :
                        <React.Fragment key={i}>
                            <div style={{ padding: 15, marginTop: 10 }}>
                                <CheckBoxArray postion={i} form={form} onChange={this.onValueChange} />
                            </div>
                        </React.Fragment>
                ))}
            </div>
        )
    }

    loadDefaultData = (forms, data) => {
        if (data) {
            for (let form of forms) {
                if (form.forms) {
                    this.loadDefaultData(form.forms, data)
                }
                else {
                    form.value = data[form.field] ? data[form.field] : form.value
                }
            }
        }
    }

    componentDidMount() {
        let forms = this.forms()
        let data = this.props.data[PREF_MONITORING]
        this.loadDefaultData(forms, data)
        this.setState({ forms })
    }
}

export default MonitoringPreferences