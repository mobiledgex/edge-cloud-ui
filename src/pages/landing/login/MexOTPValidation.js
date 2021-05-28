import React from 'react'
import { Grid, Input, Button } from 'semantic-ui-react'

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
        return (
            <Grid>
                <Grid.Row>
                    <span className='title'>Two Factor Authentication</span>
                </Grid.Row>
                <Grid.Row>
                    <span style={{ textAlign: 'left', color: '#FFFFFF' }}>
                        Please use two factor authenticator app on your phone to get OTP. We have also sent OTP to your registered email address
                    </span>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Input style={{ width: '80%', color: 'white' }} placeholder='Enter OTP' name='otp' type="number" value={totp} onChange={(e) => { this.setState({ totp: e.target.value }) }} maxLength="6"></Input>
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

export default MexOTPValidation