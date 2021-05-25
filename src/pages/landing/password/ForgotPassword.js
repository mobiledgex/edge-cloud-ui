import React from 'react'
import { useHistory } from "react-router";
import { Button, Grid, Input } from 'semantic-ui-react'

const Message = () => {
    const history = useHistory()
    return (
        <Grid>
            <Grid.Row>
                <span className='title'>Reset your password</span>
            </Grid.Row>
            <Grid.Row>
                <span className="login-text">Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.</span>
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
    const { onPasswordReset } = props
    const [email, setEmail] = React.useState(undefined)
    const [success, setSuccess] = React.useState(false)

    const onReset = async () => {
        setSuccess(await onPasswordReset(email))
    }

    return (success ?
        <Message /> :
        <Grid >
            <Grid.Row>
                <span className='title'>Recover your password</span>
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