import React from 'react'
import { withStyles } from '@material-ui/styles';
import { Grid, Input, Button } from 'semantic-ui-react'

const styles = theme => ({
    otpTip: {
        textAlign: 'left',
        color: 'white'
    },
    otpInput: {
        width: '80%',
        color: 'white'
    }
});

class MexOTPValidation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            totp: ''
        }
    }

    onSubmit = () => {
        this.props.onComplete(this.state.totp)
    }

    render() {
        const { totp } = this.state
        const { classes } = this.props
        return (
            <Grid>
                <Grid.Row>
                    <span className='title'>Two Factor Authentication</span>
                </Grid.Row>
                <Grid.Row>
                    <span className={classes.otpTip}>
                        Please use two factor authenticator app on your phone to get OTP. We have also sent OTP to your registered email address
                    </span>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Input className={classes.otpInput} placeholder='Enter OTP' name='otp' type="number" value={totp} onChange={(e) => { this.setState({ totp: e.target.value }) }} maxLength="6"></Input>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column >
                        <Button onClick={this.onSubmit}>Validate OTP</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default withStyles(styles)(MexOTPValidation)