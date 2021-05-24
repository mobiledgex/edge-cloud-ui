import React from 'react'
import { useHistory } from 'react-router'
import { Grid } from 'semantic-ui-react'
import UpdatePassword from '../main/userSetting/UpdatePassword';

const ResetPassword = (props) => {
    const history = useHistory()
    return (
        <Grid >
            <Grid.Row>
                <span className='title'>Reset your password</span>
            </Grid.Row>
            <UpdatePassword onReset={() => { history.push('/') }} />
            <br />
        </Grid>
    )
}

export default ResetPassword