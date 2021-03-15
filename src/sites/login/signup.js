import React, { Fragment } from "react";
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MexForms, { INPUT, BUTTON, POPUP_INPUT, SWITCH } from "../../hoc/forms/MexForms";
import { fields } from "../../services/model/format";
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';

import LinearProgress from '@material-ui/core/LinearProgress';
import { Icon } from "semantic-ui-react";
import { generate } from 'generate-password'
import { Button, Checkbox, FormControlLabel } from "@material-ui/core";
import { copyData } from '../../utils/file_util'
import cloneDeep from "lodash/cloneDeep";
import { sendRequest } from '../../services/model/serverWorker'
import { PUBLIC_CONFIG } from '../../services/model/endpoints'
import { load } from "../../helper/zxcvbn";

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
    return /[\W_]/.test(value)
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

class RegistryUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            visibility: false
        }
    }

    calculateStrength = (value) => {
        if(this.zxcvbn === undefined)
        {
            this.zxcvbn = load()
        }
        return this.zxcvbn(value).guesses / BRUTE_FORCE_GUESSES_PER_SECOND
    }

    validateEmail = (form) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value)) {
            form.error = 'Invalid email address'
            return false;
        }
        else {
            form.error = undefined
            return true;
        }
    }

    validateUsername = (form) => {
        if (!/^[-_.0-9a-zA-Z]+$/.test(form.value)) {
            form.error = 'Username can only contain letters, digits, "_", ".", "-".'
            return false;
        }
        else {
            form.error = undefined
            return true;
        }
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

    onCreate = (data) => {
        if (this.props.captchaValidated) {
            this.props.createUser(data)
        }
        else {
            this.props.handleAlertInfo('error', 'Please validate captcha')
        }
    }

    onValueChange = (form) => {

    }

    reloadForms = () => {
        this.setState({
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
        copyData(password)
        let forms = cloneDeep(this.state.forms)
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === fields.password || form.field === fields.confirmPassword) {
                form.value = password
            }
        }
        this.props.handleAlertInfo('success', 'Password generated successfully and copied to the clipboard, make sure you copy and paste the password to a secure location')
        this.setState({ forms })
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

    onVisibilityChange = () => {
        this.setState(prevState => {
            let forms = prevState.forms
            let visibility = !prevState.visibility
            let type = visibility ? 'text' : 'password'
            for(let form of forms)
            {
                if(form.field === fields.password || form.field === fields.confirmPassword)
                {
                    form.rules.type = type
                }
            }
            return { visibility, forms }
        })
    }

    customForm = () => {
        return (
            <div style={{ marginLeft: '10%' }}>
                <FormControlLabel control={<Checkbox name="showPassword" value={this.state.visibility} onChange={this.onVisibilityChange} />} label="Show Password" />
            </div>
        )
    }

    forms = () => (
        [
            { field: fields.username, label: 'Username', labelIcon: <PersonOutlineOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Username', rules: { required: true, autoComplete: "off", requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validateUsername },
            { field: fields.password, label: 'Password', labelIcon: <VpnKeyOutlinedIcon style={{ color: "#FFF" }} />, formType: POPUP_INPUT, placeholder: 'Password', rules: { required: true, type: 'password', autocomplete: "off", copy: false, paste: false, requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validatePassword, popup: this.passwordHelper },
            { field: fields.confirmPassword, label: 'Confirm Password', labelIcon: <VpnKeyOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Confirm Password', rules: { required: true, type: 'password', autocomplete: "off", copy: false, paste: false, requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validatePassword },
            { field: fields.email, label: 'Email', labelIcon: <EmailOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Email ID', rules: { required: true, type: 'email', requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validateEmail },
            { field: fields.otp, label: '2FA', labelStyle: { fontWeight: 500, color: '#FFF', fontSize: 14 }, formType: SWITCH, visible: true, value: false, style: { float: 'left', marginTop: -11 } },
            { custom: this.customForm }
        ]
    )

    render() {
        return (
            <Fragment>
                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} style={{ marginTop: 5 }} />
            </Fragment>
        );
    }

    getFormData = () => {
        let forms = this.forms()
        forms.push({ label: 'Sign Up', formType: BUTTON, onClick: this.onCreate, validate: true, style: { width: 320, marginLeft: 65, marginTop: 20, position: 'absolute', zIndex: 9999, backgroundColor: 'rgba(0, 85, 255, .25)', border: 'solid 1px rgba(128, 170, 255, .5) !important', color: 'white' } })
        this.setState({
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
        this.props.handleLoadingSpinner(true)
        sendRequest(this, { method: PUBLIC_CONFIG }, this.publicConfigResponse)
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default connect(null, mapDispatchProps)(RegistryUserForm);
