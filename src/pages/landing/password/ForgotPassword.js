import React from 'react'
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Grid, Input } from 'semantic-ui-react'
import { alertInfo } from '../../../actions';
import { VERIFY_PASSWORD } from '../../../helper/constant/perpetual';
import { validateEmail } from '../../../utils/validation_utils';

const Message = (props) => {
    const history = useHistory()
    const type = props.type
    return (
        <Grid>
            <Grid.Row>
                <span className='title'>{type === VERIFY_PASSWORD ? 'Reset Password' : 'Verify Email'}</span>
            </Grid.Row>
            <Grid.Row>
                <span className="login-text">{`Check your email for a link to ${type === VERIFY_PASSWORD ? 'reset your password' : 'verify your email'}. If it doesn’t appear within a few minutes, check your spam folder.`}</span>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Button onClick={() => history.push('/')}>Log In</Button>
                </Grid.Column>
            </Grid.Row>

        </Grid>
    )
}

const ForgotPassword = (props) => {
    const { onPasswordReset, onVerificationEmail } = props
    const dispatch = useDispatch();
    const [email, setEmail] = React.useState(undefined)
    const [success, setSuccess] = React.useState(false)
    const location = useLocation()
    const type = location.state && location.state.type ? location.state.type : 0
    const onReset = async () => {
        if (validateEmail(email)) {
            if (type === VERIFY_PASSWORD) {
                setSuccess(await onPasswordReset(email))
            }
            else {
                setSuccess(await onVerificationEmail(email))
            }
        }
        else
        {
            dispatch(alertInfo('error', 'Invalid email address'))
        }

    }

    return (success ?
        <Message type={type}/> :
        <Grid >
            <Grid.Row>
                <span className='title'>{type === VERIFY_PASSWORD ? 'Recover your password' : 'Verify your email'}</span>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Input icon='envelope outline' style={{ width: '100%', color: 'white' }} placeholder='Email Address' name='email' onChange={(e, { name, value }) => { setEmail(value) }} />
                </Grid.Column>
            </Grid.Row>
            <div className="loginValidation">
                {props.login_danger}
            </div>
            <Grid.Row>
                <Grid.Column>
                    <Button onClick={() => onReset(email)}>Send Me Email</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default ForgotPassword