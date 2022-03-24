import React from 'react'
import { useHistory } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import UpdatePassword from '../../main/userSetting/UpdatePassword';

const ResetPassword = (props) => {
    const history = useHistory()
    return (
        <React.Fragment>
            <span className='title'>Reset password</span>
            <Grid >
                <UpdatePassword onReset={() => { history.push('/') }} />
            </Grid>
        </React.Fragment>

    )
}

export default ResetPassword