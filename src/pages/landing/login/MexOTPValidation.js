/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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