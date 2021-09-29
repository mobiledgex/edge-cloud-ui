import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../../actions';
import moment from 'moment'
import AppsIcon from '@material-ui/icons/Apps';
import CloseIcon from '@material-ui/icons/Close';
import { updateUser, updateUserMetaData } from '../../../../services/modules/users'
import LinearProgress from '@material-ui/core/LinearProgress';
import { Button, Dialog, DialogActions, DialogContent, Divider, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Select, Switch } from '@material-ui/core'

import DatatablePref from './DatatablePref'
import TimezonePref from './TimezonePref'
import MonitoringPref from './MonitoringPref'

import cloneDeep from 'lodash/cloneDeep'
import { redux_org } from '../../../../helper/reduxData';
import { getUserMetaData } from '../../../../helper/ls';
import { timezonePref } from '../../../../utils/sharedPreferences_util';
import Help from '../../events/helper/Help'
import { HEADER } from '../../../../hoc/forms/MexForms';
import { perpetual } from '../../../../helper/constant';
import { DialogTitle } from '../../../../hoc/mexui';
import LogsPref from './LogsPref'

export const PREF_DATATABLE = 'Datatable'
export const PREF_MONITORING = 'Monitoring'
export const PREF_TIMEZONE = 'Timezone'
export const PREF_LOGS = 'Logs'

const preferencesList = [
    { id: HEADER, label: 'General' },
    { id: PREF_DATATABLE, label: 'Data Table' },
    { id: PREF_TIMEZONE, label: 'Date & Time' },
    { id: PREF_LOGS, label: 'Logs' },
    { id: HEADER, label: 'Organization' },
    { id: PREF_MONITORING, label: 'Monitoring' },
]

const prefHelp = [
    <p>Reload console to apply changes</p>
]

class Preferences extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            data: {},
            loading: false,
            header: 1
        }
        this.isTimezoneChanged = false
    }

    handleOpen = () => {
        this.setState({ open: true })
        this.props.close()
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    onSwitchChange = (key) => {
        this.setState(prevState => {
            let data = prevState.data
            data[key] = !data[key]
            return data
        })
    }

    action = (key, data) => {
        let id = key.id
        let value = data[id]
        if (key.type === 'boolean') {
            return <Switch checked={value} onChange={() => { this.onSwitchChange(id) }} />
        }
        else if (key.type === 'select') {
            return <Select value={key.value}>
                {key.options.map((option, i) => (
                    <MenuItem key={i} value={option}>{option}</MenuItem>
                ))}
            </Select>
        }
    }

    onTimezoneChangeEvent = (value) => {
        var event = new Event('MexTimezoneChangeEvent');
        moment.tz.setDefault(timezonePref())
        window.dispatchEvent(event);
    }

    onSave = () => {
        this.setState({ loading: true }, async () => {
            let data = this.state.data
            let oldData = getUserMetaData()
            this.isTimezoneChanged = data[PREF_TIMEZONE] !== undefined && oldData[PREF_TIMEZONE] !== data[PREF_TIMEZONE]
            if (await updateUserMetaData(this, data)) {
                if (this.isTimezoneChanged) {
                    this.onTimezoneChangeEvent()
                }
                this.setState({ open: false, header: 1 })
                this.props.handleAlertInfo('success', 'Preferences saved, please reload page to apply changes')
            }
            this.setState({ loading: false })
        })
    }

    getOrgData = (data) => {
        let org = redux_org.nonAdminOrg(this)
        if (org) {
            data = data[org]
        }
        return data
    }

    updateOrgData = (update) => {
        this.setState(prevState => {
            let data = prevState.data
            data[redux_org.nonAdminOrg(this)] = update
            return { data }
        })
    }

    updateData = (data) => {
        this.setState({ data })
    }

    prefView = (id) => {
        let data = cloneDeep(this.state.data)
        switch (id) {
            case PREF_DATATABLE:
                return <DatatablePref data={data} update={this.updateData} />
            case PREF_TIMEZONE:
                return <TimezonePref data={data} update={this.updateData} />
            case PREF_MONITORING:
                return <MonitoringPref data={redux_org.isAdmin(this) ? data : this.getOrgData(data)} update={redux_org.isAdmin(this) ? this.updateData : this.updateOrgData} />
            case PREF_LOGS:
                return <LogsPref data={data} update={this.updateData} />
        }
    }

    onDialogClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            this.handleClose()
        }
    }

    render() {
        const { open, data, header, loading } = this.state
        return (
            <React.Fragment>
                <MenuItem onClick={this.handleOpen}>
                    <AppsIcon fontSize="small" style={{ marginRight: 15 }} />
                    <ListItemText primary="Preferences" />
                </MenuItem>
                <Dialog open={open} onClose={this.onDialogClose} aria-labelledby="profile" disableEscapeKeyDown={true} maxWidth={'lg'}>
                    {loading ? <LinearProgress /> : null}
                    <DialogTitle label="Preferences" onClose={this.handleClose}>
                        <Help data={prefHelp} style={{marginTop:-9}}/>
                    </DialogTitle>
                    <Divider />
                    <DialogContent style={{ width: 700 }}>
                        <Grid container>
                            <Grid xs={3} item>
                                <List dense={true}>
                                    {preferencesList.map((parent, i) => (
                                        parent.id === HEADER ?
                                            redux_org.nonAdminOrg(this) ? <div key={i} align="left" style={{ marginTop: `${i > 0 ? '15px' : '0px'}` }}>
                                                <strong style={{ color: '#888888', marginBottom: 10 }}><b>{parent.label}</b></strong>
                                            </div> : null
                                            :
                                           (<ListItem key={i} button onClick={() => { this.setState({ header: i }) }} style={{ backgroundColor: header === i ? '#388E3C' : 'transparent', borderRadius: 5, marginTop: 2 }}>
                                                <ListItemText primary={parent.label} />
                                            </ListItem>)
                                    ))}
                                </List>
                            </Grid>
                            <Grid xs={9} item>
                                {this.prefView(preferencesList[header].id)}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onSave}>Save</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }

    componentDidMount() {
        let data = localStorage.getItem(perpetual.LS_USER_META_DATA)
        try {
            data = data ? JSON.parse(data) : {}
        }
        catch (e) {
            data = {}
        }
        if (!redux_org.isAdmin(this)) {
            let org = redux_org.nonAdminOrg(this)
            data[org] = data[org] ? data[org] : {}
        }
        this.setState({ data: data })
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Preferences));