import React, { Fragment } from "react";
import { connect } from 'react-redux';
import * as actions from '../../actions';
import MexForms, { INPUT, BUTTON, POPUP_INPUT, CHECKBOX } from "../../hoc/forms/MexForms";
import { fields } from "../../services/model/format";
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import zxcvbn from 'zxcvbn'
import LinearProgress from '@material-ui/core/LinearProgress';
import { Icon } from "semantic-ui-react";

const BRUTE_FORCE_GUESSES_PER_SECOND = 1000000
const PasswordMinCrackTimeSec = 30 * 86400

const validateLetterCase = (value) => {
    return /[a-z]/.test(value) && /[A-Z]/.test(value)
}

const validateCharacterCount = (value) => {
    return value.length >= 10
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

const calculateStrength = (value) => {
    return zxcvbn(value).guesses / BRUTE_FORCE_GUESSES_PER_SECOND
}

const calculatePercentage = (score) => {
    let value = score > PasswordMinCrackTimeSec ? PasswordMinCrackTimeSec : score
    value = ((value - 0) / (PasswordMinCrackTimeSec - 0)) * (100 - 0) + 0
    return value
}

class RegistryUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: []
        }
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
            currentForm.error = 'Must be at least 10 characters long'
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
        else if (calculateStrength(value) < PasswordMinCrackTimeSec) {
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

    passwordHelper = (form) => {
        let value = form.value ? form.value : ''
        let score = calculateStrength(value)
        let letterCase = validateLetterCase(value)
        let count = validateCharacterCount(value)
        let digit = validateDigit(value)
        let symbol = validateSymbol(value)
        let consecutive = validateConsecutive(value)
        let color = score < PasswordMinCrackTimeSec ? '#F5382F' : '#F2F2F2'
        return (
            <div style={{ fontSize: 12 }}>
                <p>Your password must have :</p>
                <p style={{ color: count ? '#017E1C' : '#CCCCCC' }}><Icon name='check circle outline' /> 10 or more characters</p>
                <p style={{ color: letterCase ? '#017E1C' : '#CCCCCC' }}><Icon name='check circle outline' /> upper &amp; lowercase letters</p>
                <p style={{ color: digit ? '#017E1C' : '#CCCCCC' }}><Icon name='check circle outline' /> at least one number</p>
                <p style={{ color: symbol ? '#017E1C' : '#CCCCCC' }}><Icon name='check circle outline' /> at least one symbol</p>
                <p>Strength:</p>
                <LinearProgress variant="determinate" value={calculatePercentage(score)} style={{ backgroundColor: color }} />
                <br />
                {consecutive ?
                    <p style={{ color: '#F5382F' }}>Too many consecutive identical characters</p> :
                    <p style={{ color: '#CCCCCC' }}>To safeguard your password, avoid password reuse and follow the above recommended password guidelines to prevent brute force attack</p>
                }
            </div>
        )
    }

    forms = () => (
        [
            { field: fields.username, label: 'Username', labelIcon: <PersonOutlineOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Username', rules: { required: true, autoComplete: "off", requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validateUsername },
            { field: fields.password, label: 'Password', labelIcon: <VpnKeyOutlinedIcon style={{ color: "#FFF" }} />, formType: POPUP_INPUT, placeholder: 'Password', rules: { required: true, type: 'password', autocomplete: "off", copy: false, paste: false, requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validatePassword, popup: this.passwordHelper },
            { field: fields.confirmPassword, label: 'Confirm Password', labelIcon: <VpnKeyOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Confirm Password', rules: { required: true, type: 'password', autocomplete: "off", copy: false, paste: false, requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validatePassword },
            { field: fields.email, label: 'Email', labelIcon: <EmailOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Email ID', rules: { required: true, type: 'email', requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validateEmail },
            { field: fields.otp, label: '2FA', labelStyle: { fontWeight: 500, color: '#FFF', fontSize: 14 }, formType: CHECKBOX, visible: true, value: false, style: { float: 'left' } }
        ]
    )

    render() {
        return (
            <Fragment>
                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} style={{ height: '100%' }} />
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

    componentDidMount() {
        this.getFormData()
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default connect(null, mapDispatchProps)(RegistryUserForm);
