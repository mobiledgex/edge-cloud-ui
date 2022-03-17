import React from "react";
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { loadingSpinner, alertInfo } from '../../../actions';
import MexForms, { INPUT, BUTTON, POPUP_INPUT, SWITCH } from "../../../hoc/forms/MexForms";
import { createUser as _createUser } from '../../../services/modules/landing';
import cloneDeep from "lodash/cloneDeep";
import { load } from "../../../helper/zxcvbn";
import ReCAPTCHA from "react-google-recaptcha";
import { syncRequest } from "../../../services/service";
import { hostURL } from "../../../utils/location_utils";
import { validateEmail as _validateEmail } from "../../../utils/validation_utils";
import { copyData } from '../../../utils/file_util';
import { Icon, Grid, Button as SButton } from "semantic-ui-react";
import { Button, Checkbox, FormControlLabel, LinearProgress } from "@material-ui/core";
//Icons
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import MexOTPRegistration from '../otp/MexOTPRegistration';
import { withStyles } from "@material-ui/styles";
import { localFields } from "../../../services/fields";
import { responseValid } from "../../../services/config";
import { PUBLIC_CONFIG } from "../../../services/endpoint/nonauth";

const styles = theme => ({
    customForm: {
        marginLeft: '10%'
    },
    pwdHelper: {
        fontSize: 12
    },
    generatePwd: {
        float: 'right'
    },
    generatePwdBtn: {
        backgroundColor: '#7CC01D',
        textTransform: 'none'
    },
    color_017E1C: {
        color: '#017E1C'
    },
    color_CCCCCC: {
        color: '#CCCCCC'
    },
    color_F5382F: {
        color: '#F5382F'
    }
})

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

const Success = (props) => {
    const { data, onVerificationEmail } = props
    const history = useHistory()
    return (
        <Grid>
            <Grid.Row>
                <div className="login-text">
                    {
                        `Welcome to the Edge! Thank you for signing up.
                        To login to your account, you must first validate your email address.
                        A verification email has been sent to ${data.email}. Click on the verification link in the email to verify your account. 
                        All the new accounts are locked by default. Please contact support@mobiledgex.com to unlock it`
                    }
                </div>
            </Grid.Row>
            <Grid.Row>
                <div className="login-text">If you have not received the email after a few minutes, check your spam folder or click <span style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', display: 'inline-block' }} onClick={() => onVerificationEmail(data.email)}>here</span> to resend verification email.</div>
            </Grid.Row>
            <Grid.Row>
                <div align='center' style={{ width: '70%' }}>
                    <SButton onClick={() => history.push('/')}><span>Log In</span></SButton>
                </div>
            </Grid.Row>
        </Grid>
    )
}

class RegistryUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            visibility: false,
            totp: undefined,
            captchaValidated: false,
            success: undefined
        }
    }

    calculateStrength = (value) => {
        if (this.zxcvbn === undefined) {
            this.zxcvbn = load()
        }
        return this.zxcvbn(value).guesses / BRUTE_FORCE_GUESSES_PER_SECOND
    }

    validateEmail = (form) => {
        if (!_validateEmail(form.value)) {
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
        else if (currentForm.field === localFields.confirmPassword) {
            let forms = this.state.forms
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if (form.field === localFields.password) {
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

    createUser = async (data) => {
        const { clientSysInfo } = this.props
        let mc = await _createUser(this, {
            name: data[localFields.username],
            passhash: data[localFields.password],
            email: data[localFields.email],
            verify: {
                email: data[localFields.email],
                operatingsystem: clientSysInfo.os.name,
                browser: clientSysInfo.browser.name,
                callbackurl: `https://${hostURL()}/#/verify`,
                clientip: clientSysInfo.clientIP,
            },
            EnableTOTP: data[localFields.otp],
        })
        if (mc) {
            if (mc.response) {
                let response = mc.response;
                let request = mc.request;
                if (request.data.EnableTOTP) {
                    this.setState({ totp: { requestData: request.data, responseData: response.data } })
                }
                else {
                    if (typeof response.data === 'string' && response.data.indexOf("}{") > 0) {
                        response.data.replace("}{", "},{")
                        response.data = JSON.parse(response.data)
                    }
                    let message = (response.data.Message) ? response.data.Message : null;
                    if (message && message.indexOf('created') > -1) {
                        let msg = `User ${request.data.name} created successfully`
                        this.props.handleAlertInfo('success', msg)
                        this.setState({ success: request.data })
                    } else {
                        this.props.handleAlertInfo('error', message)
                    }
                }
            }
        }
    }

    onCreate = (data) => {
        if (this.state.captchaValidated) {
            this.createUser(data)
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

    passwordGenerator = async (length) => {
        if (this.generator === undefined) {
            this.generator = await import('../../../helper/passwordGenerator')
        }
        let password = this.generator.generate({ length, numbers: true, symbols: true, lowercase: true, uppercase: true, strict: true })
        if (this.calculateStrength(password) < this.passwordMinCrackTimeSec) {
            return this.passwordGenerator(length + 1)
        }
        return password
    }

    generatePassword = async (length) => {
        let password = await this.passwordGenerator(length)
        copyData(password)
        let forms = cloneDeep(this.state.forms)
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i]
            if (form.field === localFields.password || form.field === localFields.confirmPassword) {
                form.value = password
            }
        }
        this.props.handleAlertInfo('success', 'Password generated successfully and copied to the clipboard, make sure you copy and paste the password to a secure location')
        this.setState({ forms })
    }

    passwordHelper = (form) => {
        const { classes } = this.props
        let value = form.value ? form.value : ''
        let score = this.calculateStrength(value)
        let letterCase = validateLetterCase(value)
        let count = validateCharacterCount(value)
        let digit = validateDigit(value)
        let symbol = validateSymbol(value)
        let consecutive = validateConsecutive(value)
        let color = score < this.passwordMinCrackTimeSec ? '#F5382F' : '#F2F2F2'
        return (
            <div className={classes.pwdHelper}>
                <p>Your password must have :</p>
                <p className={count ? classes.color_017E1C : classes.color_CCCCCC}><Icon name='check circle outline' /> 13 or more characters</p>
                <p className={letterCase ? classes.color_017E1C : classes.color_CCCCCC}><Icon name='check circle outline' /> upper &amp; lowercase letters</p>
                <p className={digit ? classes.color_017E1C : classes.color_CCCCCC}><Icon name='check circle outline' /> at least one number</p>
                <p className={symbol ? classes.color_017E1C : classes.color_CCCCCC}><Icon name='check circle outline' /> at least one symbol</p>
                <p>Strength:</p>
                <LinearProgress variant="determinate" value={calculatePercentage(this.passwordMinCrackTimeSec, score)} style={{ backgroundColor: color }} />
                <br />
                {consecutive ?
                    <p className={classes.color_F5382F}>Too many consecutive identical characters</p> :
                    <p className={classes.color_CCCCCC}>To safeguard your password, avoid password reuse. Do not use recognizable words, such as house, car, password, etc. To meet the password strength criteria, use random characters, or click the Generate button to allow the system to generate a secure password for you. Make sure you copy and paste the password to a secure location.</p>
                }
                <div className={classes.generatePwd}><Button onMouseDown={() => { this.generatePassword(13) }} size='small' className={classes.generatePwdBtn}>Generate</Button></div>
            </div>
        )
    }

    onVisibilityChange = () => {
        this.setState(prevState => {
            let forms = prevState.forms
            let visibility = !prevState.visibility
            let type = visibility ? 'text' : 'password'
            for (let form of forms) {
                if (form.field === localFields.password || form.field === localFields.confirmPassword) {
                    form.rules.type = type
                }
            }
            return { visibility, forms }
        })
    }

    customForm = () => {
        const { classes } = this.props
        return (
            <div className={classes.customForm}>
                <FormControlLabel control={<Checkbox name="showPassword" value={this.state.visibility} onChange={this.onVisibilityChange} />} label="Show Password" />
            </div>
        )
    }

    forms = () => (
        [
            { field: localFields.username, label: 'Username', labelIcon: <PersonOutlineOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Username', rules: { required: true, autoComplete: "off", requiredColor: '#FFF', type: 'search' }, visible: true, dataValidateFunc: this.validateUsername },
            { field: localFields.password, label: 'Password', labelIcon: <VpnKeyOutlinedIcon style={{ color: "#FFF" }} />, formType: POPUP_INPUT, placeholder: 'Password', rules: { required: true, type: 'password', autocomplete: "off", copy: false, paste: false, requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validatePassword, popup: this.passwordHelper },
            { field: localFields.confirmPassword, label: 'Confirm Password', labelIcon: <VpnKeyOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Confirm Password', rules: { required: true, type: 'password', autocomplete: "off", copy: false, paste: false, requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validatePassword },
            { field: localFields.email, label: 'Email', labelIcon: <EmailOutlinedIcon style={{ color: "#FFF" }} />, formType: INPUT, placeholder: 'Email ID', rules: { required: true, type: 'email', requiredColor: '#FFF' }, visible: true, dataValidateFunc: this.validateEmail },
            { field: localFields.otp, label: '2FA', labelStyle: { fontWeight: 500, color: '#FFF', fontSize: 14 }, formType: SWITCH, visible: true, value: false, style: { float: 'left', marginTop: -11 } },
            { custom: this.customForm }
        ]
    )

    onOTPComplete = (data) => {
        let requestData = this.state.totp.requestData
        let msg = `User ${requestData.name} created successfully`
        this.props.handleAlertInfo('success', msg)
        this.setState({ success: requestData })
    }

    onCaptchaChange = (value) => {
        if (value) {
            this.setState({ captchaValidated: true })
        }
    }

    render() {
        const { totp, success, forms } = this.state
        const { onVerificationEmail } = this.props
        return (
            success ? <Success data={success} onVerificationEmail={onVerificationEmail} /> :
                totp ? <MexOTPRegistration onComplete={this.onOTPComplete} data={totp} showDone={true} /> :
                    <Grid>
                        <Grid.Row>
                            <span className='title'>Create New Account</span>
                        </Grid.Row>
                        <MexForms forms={forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} style={{ marginTop: 5 }} />
                        <Grid.Row style={{ marginTop: 40, marginLeft: 25 }}>
                            <ReCAPTCHA
                                sitekey={process.env.REACT_APP_CAPTCHA_V2_KEY}
                                onChange={this.onCaptchaChange}
                                onExpired={() => { this.setState({ captchaValidated: false }) }}
                            />
                        </Grid.Row>
                        <Grid.Row>
                            <span>
                                By clicking Sign Up, you agree to our <Link to="/terms-of-use" target="_blank" className="login-text" style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', color: "rgba(255,255,255,.5)", padding: '0' }}>Terms of Use</Link> and <Link to="/acceptable-use-policy" target="_blank" className="login-text" style={{ fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer', color: "rgba(255,255,255,.5)", padding: '0', }}>Acceptable Use Policy</Link>.
                            </span>
                        </Grid.Row>
                    </Grid>
        );
    }

    getFormData = () => {
        let forms = this.forms()
        forms.push({ label: 'Sign Up', formType: BUTTON, onClick: this.onCreate, validate: true, style: { width: 320, marginLeft: 65, marginTop: 20, position: 'absolute', zIndex: 9999, backgroundColor: 'rgba(0, 85, 255, .25)', border: 'solid 1px rgba(128, 170, 255, .5) !important', color: 'white' } })
        this.setState({
            forms
        })
    }

    publicConfig = async () => {
        let mc = await syncRequest(this, { method: PUBLIC_CONFIG })
        if (responseValid(mc)) {
            this.passwordMinCrackTimeSec = mc.response.data.PasswordMinCrackTimeSec
            this.getFormData()
        }
    }

    componentDidMount() {
        this.publicConfig()
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(alertInfo(mode, msg)) }
    };
};

export default connect(null, mapDispatchProps)(withStyles(styles)(RegistryUserForm));
