import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, MenuItem, Switch, Tooltip } from '@material-ui/core';
import { FORMAT_FULL_DATE_TIME, time } from '../../../utils/date_util'
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import * as dateUtil from '../../../utils/date_util'
import { withStyles } from '@material-ui/styles';
import { updateUser } from '../../../services/model/serverWorker'
import MexOTPRegistration from '../../login/otp/MexOTPRegistration'
import LinearProgress from '@material-ui/core/LinearProgress';

const formatDate = (value) => {
    return dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value)
}
const keys = [
    { field: 'Name', label: 'Name', visible: true },
    { field: 'FamilyName', label: 'Family Name', visible: false },
    { field: 'GivenName', label: 'Given Name', visible: false },
    { field: 'Email', label: 'Email', visible: true },
    { field: 'EmailVerified', label: 'Email Verified', visible: false },
    { field: 'Passhash', label: 'Passhash', visible: false },
    { field: 'Salt', label: 'Salt', visible: false },
    { field: 'Iter', label: 'Iter', visible: false },
    { field: 'Locked', label: 'Locked', visible: false },
    { field: 'PassCrackTimeSec', label: 'Password Crack Time In Sec', visible: false },
    { field: 'EnableTOTP', label: '2FA Enabled', visible: false },
    { field: 'TOTPSharedKey', label: 'TOTP Shared Key', visible: false },
    { field: 'Metadata', label: 'Metadata', visible: false },
    { field: 'CreatedAt', label: 'Created Date', visible: true, format: formatDate },
    { field: 'UpdatedAt', label: 'Last Modified', visible: true, format: formatDate },
]

const CustomSwitch = withStyles({
    switchBase: {
        color: '#D32F2F',
        '&$checked': {
            color: '#388E3C',
        },
        '&$checked + $track': {
            backgroundColor: '#388E3C',
        },
    },
    checked: {},
    track: {},
})(Switch);

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            isOTP: false,
            OTPData: undefined,
            loading: false
        }
    }



    makeUTC = (date) => {
        return time(FORMAT_FULL_DATE_TIME, date)
    }

    handleOpen = ()=>{
        this.setState({open:true})
        this.props.close()
    }

    handleClose = () => {
        this.setState({open:false})
    }


    renderRow = (index, key, data) => {
        let label = key.label
        let value = data[key.field]
        return (
            <ListItem key={index}>
                <div style={{ minWidth: 200, marginRight: 10 }}>
                    <h5>{label}</h5>
                </div>
                <div>
                    <h5> {key.format ? key.format(value) : value}</h5>
                </div>
            </ListItem>
        );
    }

    renderEmail = (data) => {
        let isVerified = data['EmailVerified']
        let title = isVerified ? 'Email Verified' : 'Email Verification Pending'
        return (
            <Tooltip title={<strong style={{ fontSize: 13 }}>{title}</strong>}>
                <IconButton><EmailOutlinedIcon style={{ color: isVerified ? '#4caf50' : '#f44336' }} /></IconButton>
            </Tooltip>
        )
    }

    renderOTP = (data) => {
        let isOTP = data['EnableTOTP']
        let title = isOTP ? '2FA Enable' : '2FA Disabled'
        return (
            <Tooltip title={<strong style={{ fontSize: 13 }}>{title}</strong>}>
                <IconButton><VpnKeyOutlinedIcon style={{ color: isOTP ? '#4caf50' : '#f44336' }} /></IconButton>
            </Tooltip>
        )
    }

    renderLock = (data) => {
        let isLocked = data['Locked']
        let title = isLocked ? 'Locked' : 'Active'
        return (
            <Tooltip title={<strong style={{ fontSize: 13 }}>{title}</strong>}>
                <IconButton>{isLocked ? <LockOutlinedIcon style={{ color: '#f44336' }} /> : <LockOpenOutlinedIcon style={{ color: '#4caf50' }} />}</IconButton>
            </Tooltip>
        )
    }

    onOTPChange = () => {
        this.setState(prevState => {
            let isOTP = !prevState.isOTP
            return { isOTP }
        })
    }

    updateResponse = (mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            let responseData = mc.response.data
            let OTPData = this.state.isOTP ? { responseData } : undefined
            this.props.currentUser()
            this.setState({ OTPData })
        }
        else {
            this.setState({ loading: false })
        }
    }

    updateProfile = () => {
        let isOTP = this.state.isOTP
        if (isOTP !== this.props.data['EnableTOTP']) {
            this.setState({ loading: true })
            updateUser(this, { enabletotp: isOTP }, this.updateResponse)
        }
    }

    render() {
        const { data } = this.props
        const { open, isOTP, OTPData, loading } = this.state
        return (
            <React.Fragment>
                <MenuItem onClick={this.handleOpen}>
                    <PersonOutlineOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                    <ListItemText primary="Profile" />
                </MenuItem>
                <Dialog open={open} onClose={this.handleClose} aria-labelledby="profile" disableEscapeKeyDown={true}>
                    {loading ? <LinearProgress /> : null}
                    <DialogTitle id="profile">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{fontWeight:700}}>Profile</h3>
                        </div>
                        <div style={{ float: "right", display: 'inline-block', marginTop: -8 }}>
                            {this.renderEmail(data)}
                            {this.renderOTP(data)}
                            {this.renderLock(data)}
                        </div>
                    </DialogTitle>
                    <List style={{marginLeft:10}}>
                        {
                            keys.map((key, i) => {
                                return key.visible ? this.renderRow(i, key, data) : null
                            })
                        }
                        <ListItem>
                            <div style={{ minWidth: 200, marginRight: 10 }}>
                                <h5>Enable 2FA Auth</h5>
                            </div>
                            <div>
                                <CustomSwitch size="small" checked={isOTP} onChange={this.onOTPChange} />
                            </div>
                        </ListItem>
                        {OTPData ?
                            <ListItem>
                                <MexOTPRegistration data={OTPData} />
                            </ListItem> : null}
                    </List>
                    <DialogActions>
                        <Button onClick={this.updateProfile} style={{backgroundColor: 'rgba(118, 255, 3, 0.7)'}} size='small'>
                            Update
                        </Button>
                        <Button onClick={this.handleClose} style={{backgroundColor: 'rgba(118, 255, 3, 0.7)'}} size='small'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }

    componentDidUpdate(preProps, preState) {
        if (preProps.data !== this.props.data) {
            this.setState({ isOTP: this.props.data['EnableTOTP'], loading: false })
        }
    }
}


export default Profile;

