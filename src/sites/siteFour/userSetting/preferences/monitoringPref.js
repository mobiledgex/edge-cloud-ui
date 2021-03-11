
import React from 'react'
import { Accordion as MuiAccordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CHECKBOX_ARRAY } from '../../../../hoc/forms/MexForms'
import { withStyles } from '@material-ui/styles';
import { PREF_MONITORING } from './preferences';
import CheckBoxArray from '../../../../hoc/forms/CheckBoxArray'
import { PREF_M_APP_VISIBILITY, PREF_M_CLOUDLET_VISIBILITY, PREF_M_CLUSTER_VISIBILITY, PREF_M_REGION } from '../../../../utils/sharedPreferences_util';
import { getUserRole, isAdmin } from '../../../../services/model/format';
import { DEVELOPER, OPERATOR } from '../../../../constant';

const cloudletVisibility = ["vCpu Infra Usage", "Disk Infra Usage", "Memory Infra Usage", "Disk Usage", "Floating IP Used", "GPU Used", "Instances Used", "RAM Used", "vCPUs Used", "Flavor Usage", "Map", "Event"]
const clusterVisibility = ["CPU", "Memory", "Disk Usage", "Network Sent", "Network Received", "Map"]
const appInstVisibility = ["CPU", "Memory", "Disk Usage", "Network Sent", "Network Received", "Active Connections", "Map", "Event", "Client Usage"]

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

    cloudletForms = () => ([
        { field: PREF_M_CLOUDLET_VISIBILITY, label: 'Visibility', formType: CHECKBOX_ARRAY, value: cloudletVisibility, options: cloudletVisibility },
    ])

    clusterForms = () => ([
        { field: PREF_M_CLUSTER_VISIBILITY, label: 'Visibility', formType: CHECKBOX_ARRAY, value: clusterVisibility, options: clusterVisibility },
    ])

    appInstForms = () => ([
        { field: PREF_M_APP_VISIBILITY, label: 'Visibility', formType: CHECKBOX_ARRAY, value: appInstVisibility, options: appInstVisibility },
    ])

    forms = () => ([
        { field: PREF_M_REGION, label: 'Region', formType: CHECKBOX_ARRAY, value: this.regions, expanded: true, options: this.regions, visible: true },
        { label: 'Cloudlet', forms: this.cloudletForms(), visible: isAdmin() || getUserRole().includes(OPERATOR) },
        { label: 'Cluster', forms: this.clusterForms(), visible: isAdmin() || getUserRole().includes(DEVELOPER) },
        { label: 'App Instances', forms: this.appInstForms(), visible: isAdmin() || getUserRole().includes(DEVELOPER) }
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

        let data = this.props.data ? this.props.data : {}
        data[PREF_MONITORING] = data[PREF_MONITORING] ? data[PREF_MONITORING] : {}
        data[PREF_MONITORING][form.field] = form.value
        this.props.update(data)
    }

    render() {
        const { forms } = this.state
        return (
            <div>
                {forms.map((form, i) => (
                    form.visible ?
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
                            </React.Fragment> : null
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
                    form.value = data[form.field] !== undefined ? data[form.field] : form.value
                }
            }
        }
    }

    componentDidMount() {
        let forms = this.forms()
        let data = this.props.data ? this.props.data[PREF_MONITORING] : undefined
        this.loadDefaultData(forms, data)
        this.setState({ forms })
    }
}

export default MonitoringPreferences