import React from 'react'
import { connect } from 'react-redux'
import { Card, Grid, Typography } from '@material-ui/core'
import { Button, DateTimePicker, Select } from '../../../hoc/mexui'
import { currentDate, diff, FORMAT_FULL_DATE, FORMAT_FULL_T_Z, subtractDays, time, timezones } from '../../../utils/date_util'
import { timezonePref } from '../../../utils/sharedPreferences_util'
import { generateReport } from '../../../services/modules/reporter'
import * as actions from '../../../actions'
import { redux_org } from '../../../helper/reduxData'

const MIN_7_DAYS = 7
const MAX_31_DAYS = 31

class Generator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            org:undefined
        }
        this.data = {}
    }

    fromDate = (date) => {
        this.data.from = date
    }
    toDate = (date) => {
        this.data.to = date
    }

    timezone = (value) => {
        this.data.zone = value
    }

    onOrgChange = (value) => {
        this.setState({ org: value })
        this.data.org = value
    }

    onFetch = async () => {
        const starttime = time(FORMAT_FULL_T_Z, this.data.from, this.data.zone)
        const endtime = time(FORMAT_FULL_T_Z, this.data.to, this.data.zone)
        const org = this.data.org
        const timezone = this.data.zone
        if (redux_org.isAdmin(this) && this.data.org === undefined) {
            this.props.handleAlertInfo('error', 'Please select organization')
        }
        else if (diff(starttime, endtime, 'days') < MIN_7_DAYS) {
            this.props.handleAlertInfo('error', 'Minimum 7 Days')
        }
        else if (diff(starttime, endtime, 'days') > MAX_31_DAYS) {
            this.props.handleAlertInfo('error', 'Minimum 31 Days')
        }
        else {
            this.setState({ loading: true })
            let mc = await generateReport(this, { starttime, endtime, org, timezone })
            if (mc && mc.response && mc.response.status === 200) {
                const blob = new Blob([mc.response.data], { type: 'application/pdf' })
                const objectUrl = window.URL.createObjectURL(blob)
                window.open(objectUrl, '_blank')
            }
            this.setState({ loading: false })
        }
    }

    render() {
        const { loading, org } = this.state
        const { orgList } = this.props
        return (
            <Card style={{ height: 110, paddingLeft: 20, paddingTop: 5, marginRight: 5, marginLeft: 5 }}>
                <Typography style={{ marginBottom: 15, color: '#AEAEAE' }} variant='subtitle2'><b>Custom Report</b></Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <DateTimePicker label='From' onChange={this.fromDate} value={`${time(FORMAT_FULL_DATE, subtractDays(7, currentDate()))} 00:00:00`} />
                    <DateTimePicker label='To' onChange={this.toDate} end={true} value={currentDate()} />
                    <Select list={timezones()} search={true} label={'Timezone'} onChange={this.timezone} value={timezonePref()} underline={true} header/>
                    {
                        redux_org.isAdmin(this) ? <Select list={orgList} search={true} label={'Organization'} onChange={this.onOrgChange} placeholder={'Select Organization'} underline={true} header/> : null
                    }
                    <Button onClick={this.onFetch} loading={loading} disabled={org === undefined && redux_org.isAdmin(this)}>Generate</Button>
                </div>
            </Card>
        )
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
    };
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default connect(mapStateToProps, mapDispatchProps)(Generator);