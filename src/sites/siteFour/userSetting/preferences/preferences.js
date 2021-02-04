import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../../actions';
import moment from 'moment'
import AppsIcon from '@material-ui/icons/Apps';
import CloseIcon from '@material-ui/icons/Close';
import { LS_USER_META_DATA } from '../../../../constant';
import { updateUser } from '../../../../services/model/user'
import LinearProgress from '@material-ui/core/LinearProgress';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Select, Switch } from '@material-ui/core'

import DatatablePref from './datatablePref'
import TimezonePref from './timezonePref'
import MonitoringPref from './monitoringPref'

import cloneDeep from 'lodash/cloneDeep'
import { getOrganization, getUserRole, isAdmin } from '../../../../services/model/format';
import { getUserMetaData } from '../../../../helper/ls';
import { timezonePref } from '../../../../utils/sharedPreferences_util';

export const PREF_DATATABLE = 'Datatable'
export const PREF_MONITORING = 'Monitoring'
export const PREF_TIMEZONE = 'Timezone'

const preferencesList = [
    { id: PREF_DATATABLE, label: 'Data Table' },
    { id: PREF_MONITORING, label: 'Monitoring' },
    { id: PREF_TIMEZONE, label: 'Date & Time' },
]
class Preferences extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            data: {},
            loading: false,
            header: 0
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

    onSaveResponse = (mc) => {
        this.setState({ loading: false })
        if (mc && mc.response && mc.response.status === 200) {
            if(this.isTimezoneChanged)
            {
                this.onTimezoneChangeEvent()
            }
            this.props.handleAlertInfo('success', 'Update Successful')
        }
    }

    onSave = () => {
        this.setState({ loading: true }, () => {
            let data = this.state.data
            let oldData = getUserMetaData()
            this.isTimezoneChanged = data[PREF_TIMEZONE] !== undefined && oldData[PREF_TIMEZONE] !== data[PREF_TIMEZONE]
            data = JSON.stringify(data)
            localStorage.setItem(LS_USER_META_DATA, data)
            updateUser(this, { Metadata: data }, this.onSaveResponse)
        })
    }

    getOrgData = (data)=>{
        if(getUserRole() && !isAdmin())
        {
            data = data[getOrganization()]
        }
        return data
    }

    updateOrgData = (update) => {
        this.setState(prevState => {
            let data = prevState.data
            data[getOrganization()] = update
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
            case PREF_MONITORING:
                return <MonitoringPref data={data} update={this.updateData} />
            case PREF_TIMEZONE:
                return <TimezonePref data={data} update={this.updateData} />
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
                <Dialog open={open} onClose={this.handleClose} aria-labelledby="profile" disableEscapeKeyDown={true} disableBackdropClick={true} maxWidth={'lg'}>
                    {loading ? <LinearProgress /> : null}
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>Preferences</h3>
                        </div>
                        <div style={{ float: "right", display: 'inline-block', marginTop: -8 }}>
                            <IconButton onClick={this.handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </DialogTitle>
                    <Divider />
                    <DialogContent style={{ width: 700 }}>
                        <Grid container>
                            <Grid xs={3} item>
                                <List dense={true}>
                                    {preferencesList.map((parent, i) => (
                                        <ListItem key={i}>
                                            <ListItem button onClick={() => { this.setState({ header: i }) }} style={{ backgroundColor: header === i ? '#388E3C' : 'transparent', borderRadius: 5 }}>
                                                <ListItemText primary={parent.label} />
                                            </ListItem>
                                        </ListItem>
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
        let data = localStorage.getItem(LS_USER_META_DATA)
        data = data ? JSON.parse(data) : {}
        if(!isAdmin())
        {
            let org = getOrganization()
            data[org] = data[org] ? data[org] : {}
        }
        this.setState({ data: data })
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(Preferences));