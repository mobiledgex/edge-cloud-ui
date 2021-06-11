import React, { Fragment } from "react";
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import MexForms, { INPUT, BUTTON, POPUP_INPUT } from "../../../hoc/forms/MexForms";
import { fields } from "../../../services/model/format";
import { Icon } from "semantic-ui-react";
import { generate } from 'generate-password'
import { copyData } from '../../../utils/file_util'
import cloneDeep from "lodash/cloneDeep";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import { resetPwd, sendRequest, updatePwd } from '../../../services/model/serverWorker'
import { Button, Dialog, DialogContent, DialogTitle, ListItemText, MenuItem, LinearProgress } from '@material-ui/core';
import { load } from "../../../helper/zxcvbn";
import { withRouter } from 'react-router-dom';
import { endpoint } from "../../../helper/constant";

const BRUTE_FORCE_GUESSES_PER_SECOND = 1000000

const validateLetterCase = (value) => {
    return /[a-z]/.test(value) && /[A-Z]/.test(value)
}

const validateCharacterCount = (value) => {
    return value.length >= 13
}

//atleast on digit
const validateDigit = (value) => {
    return /\d/.test(value)
}
//atleast on symbol
const validateSymbol = (value) => {
    return /\W/.test(value)
}
//atleast no consecutive characters
const validateConsecutive = (value) => {
    return /(.)\1\1/.test(value)
}

const calculatePercentage = (passwordMinCrackTimeSec, score) => {
    let value = score > passwordMinCrackTimeSec ? passwordMinCrackTimeSec : score
    value = ((value - 0) / (passwordMinCrackTimeSec - 0)) * (100 - 0) + 0
    return value
}

class UpdatePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            loading: false,
            open: false
        }
        this._isMounted = false
    }

    calculateStrength = (value) => {
        if(this.zxcvbn === undefined)
        {
            this.zxcvbn = load()
        }
        return this.zxcvbn(value).guesses / BRUTE_FORCE_GUESSES_PER_SECOND
    }

    validatePassword = (currentForm) => {
        let value = currentForm.value
        if (!validateCharacterCount(value)) {
            currentForm.error = 'Must be at least 13 characters long'
            return false;
        }
        else if (!validateDigit(value)) {
            currentForm.error = 'Must include atleast one number'
            return false;
        }
        else if (!validateSymbol(value)) {
            currentForm.error = 'Must include atleast one symbol'
            return false;
        }
        else if (!validateLetterCase(value)) {
            currentForm.error = 'Must include atleast one lower & upper case letter'
            return false;
        }
        else if (validateConsecutive(value)) {
            currentForm.error = 'Too many consecutive identical characters'
            return false;
        }
        else if (this.calculateStrength(value) < this.passwordMinCrackTimeSec) {
            currentForm.error = 'Password is weak'
            return false;
        }
        else if (currentForm.field === fields.confirmPassword) {
            let forms = this.state.forms
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if (form.field === fields.password) {
                    if (value !== form.value) {
                        currentForm.error = 'Password and Confirm Password do not match'
                        return false;
                    }
                    else {
                        currentForm.error = undefined
                        return true;
                    }
                }
            }
        }
        else {
            currentForm.error = undefined
            return true;
        }
    }

    updateState = (data) => { 
        if (this._isMounted) {
            this.setState({...data})
        }
    }

    updateResponse = (mc) => {
        this.updateState({ loading: false })
        if (mc && mc.response && mc.response.status === 200) {
            this.updateState({ open: false })
            this.props.handleAlertInfo('success', 'Password updated successfully')
        }
        else {
            this.props.handleAlertInfo('error', 'Password update failed')
        }
    }

    resetResponse = (mc) => {
        this.props.handleLoadingSpinner(false)
        if (mc && mc.response && mc.response.status === 200) {
            this.props.handleAlertInfo('success', mc.response.data.message)
            this.props.onReset()
        }
        else {
            this.props.handleAlertInfo('error', mc.message)
        }
    }

    onCreate = (data) => {
        if (this.props.dialog) {
            this.updateState({ loading: true })
            updatePwd(this, { password: data.password }, this.updateResponse)
        }
        else {
            this.props.handleLoadingSpinner(true)
            let token = this.props.location.search
            token = token.substring(token.indexOf('token=') + 6)
            resetPwd(this, { token, password: data.password }, this.resetResponse)
        }
    }

    onValueChange = (form) => {

    }

    reloadForms = () => {
        this.updateState({
            forms: this.state.forms
        })
    }

    passwordGenerator = (length) => {
        let password = generate({ length, numbers: true, symbols: true, lowercase: true, uppercase: true, strict: true })
        if (this.calculateStrength(password) < this.passwordMinCrackTimeSec) {
            return this.passwordGenerator(length + 1)
        }
        return password
    }

    generatePassword = (length) => {
        let password = this.passwordGenerator(length)
        copyData(password, document.getElementById('temp_copy'))
        let forms = cloneDeep(this.state.forms)
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.password || form.field === fields.confirmPassword) {
                form.value = password
            }
            if (form.field === fields.password) {
                form.rules.type = 'text'
            }
        }
        this.props.handleAlertInfo('success', 'Password generated successfully and copied to the clipboard, make sure you copy and paste the password to a secure location')
        this.updateState({ forms })
    }

    passwordHelper = (form) => {
        let value = form.value ? form.value : ''
        let score = this.calculateStrength(value)
        let letterCase = validateLetterCase(value)
        let count = validateCharacterCount(value)
        let digit = validateDigit(value)
        let symbol = validateSymbol(value)
        let consecutive = validateConsecutive(value)
        let color = score < this.passwordMinCrackTimeSec ? '#F5382F' : '#F2F2F2'
        return (
            <div style={{ fontSize: 12 }}>
                <p>Your password must have :</p>
                <p style={{ color: count ? '#017E1C' : '#CCCCCC' }}><Icon name='check circle outline' /> 13 or more characters</p>
                <p style={{ color: letterCase ? '#017E1C' : '#CCCCCC' }}><Icon name='check circle outline' /> upper &amp; lowercase letters</p>
                <p style={{ color: digit ? '#017E1C' : '#CCCCCC' }}><Icon name='check circle outline' /> at least one number</p>
                <p style={{ color: symbol ? '#017E1C' : '#CCCCCC' }}><Icon name='check circle outline' /> at least one symbol</p>
                <p>Strength:</p>
                <LinearProgress variant="determinate" value={calculatePercentage(this.passwordMinCrackTimeSec, score)} style={{ backgroundColor: color }} />
                <br />
                {consecutive ?
                    <p style={{ color: '#F5382F' }}>Too many consecutive identical characters</p> :
                    <p style={{ color: '#CCCCCC' }}>To safeguard your password, avoid password reuse. Do not use recognizable words, such as house, car, password, etc. To meet the password strength criteria, use random characters, or click the Generate button to allow the system to generate a secure password for you. Make sure you copy and paste the password to a secure location.</p>
                }
                <div style={{ float: 'right' }}><Button onMouseDown={() => { this.generatePassword(13) }} size='small' style={{ backgroundColor: '#7CC01D', textTransform: 'none' }}>Generate</Button></div>
            </div>
        )
    }

    forms = () => (
        [
            { field: fields.password, label: 'Password', labelIcon: <VpnKeyOutlinedIcon style={{ color: "#FFF" }} />, formType: POPUP_INPUT, placeholder: 'Password', rules: { required: true, type: 'password', autocomplete: "off", copy: false, paste: false, requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validatePassword, popup: this.passwordHelper },
            { field: fields.confirmPassword, label: 'Confirm Password', labelIcon: <VpnKeyOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Confirm Password', rules: { required: true, type: 'password', autocomplete: "off", copy: false, paste: false, requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validatePassword },
        ]
    )

    handleClose = () => {
        this.updateState({ open: false })
    }

    handleOpen = () => {
        this.updateState({ open: true })
        if (this.props.close) {
            this.props.close()
        }
        if (this.passwordMinCrackTimeSec) {
            this.getFormData()
        }
    }

    renderPasswordForm = () => (
        <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} style={{ marginTop:5}} />
    )

    render() {
        const { loading, open } = this.state
        const { dialog } = this.props
        return (
            <Fragment>
                {dialog ?
                    <React.Fragment><MenuItem onClick={this.handleOpen}>
                        <LockOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                        <ListItemText primary="Change Password" />
                    </MenuItem>
                        <Dialog open={open} onClose={this.handleClose} aria-labelledby="update_password" disableEscapeKeyDown={true} disableBackdropClick={true}>
                            {loading ? <LinearProgress /> : null}
                            <DialogTitle id="update_password">
                                <div style={{ float: "left", display: 'inline-block' }}>
                                    <h3>Update Password</h3>
                                </div>
                            </DialogTitle>
                            <DialogContent style={{ width: 400 }}>
                                {this.renderPasswordForm()}
                            </DialogContent>
                        </Dialog>
                    </React.Fragment> :
                    <React.Fragment>
                        {this.renderPasswordForm()}
                    </React.Fragment>
                }
            </Fragment>
        );
    }

    getFormData = () => {
        let style = { position: 'absolute', border: 'solid 1px rgba(128, 170, 255, .5) !important', color: 'white', zIndex: 9999 }
        if (this.props.dialog) {
            style.width = 70
            style.right = 80
            style.height = 30
            style.backgroundColor = 'rgba(118, 255, 3, 0.7)'
        }
        else {
            style.width = 200
            style.marginLeft = 60
            style.marginTop = 20
            style.backgroundColor = 'rgba(0, 85, 255, .25)'
        }

        let forms = this.forms()
        forms.push({ label: 'Update', formType: BUTTON, onClick: this.onCreate, validate: true, style: style })
        if (this.props.dialog) {
            let cStyle = cloneDeep(style)
            cStyle.right = 0
            forms.push({ label: 'Cancel', formType: BUTTON, onClick: this.handleClose, style: cStyle })
        }
        this.updateState({
            forms: forms
        })
    }


    publicConfigResponse = (mc) => {
        this.props.handleLoadingSpinner(false)
        if (mc && mc.response && mc.response.status === 200) {
            this.passwordMinCrackTimeSec = mc.response.data.PasswordMinCrackTimeSec
            this.getFormData()
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleLoadingSpinner(true)
        sendRequest(this, { method: endpoint.PUBLIC_CONFIG }, this.publicConfigResponse)
    }

    componentWillUnmount() {
        this._isMounted = false 
    }
};



const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(UpdatePassword))
