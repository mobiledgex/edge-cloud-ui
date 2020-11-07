import { Button, Toolbar, Typography } from '@material-ui/core'
import React from 'react'

class AlertLocal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <React.Fragment>
                <Toolbar>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </React.Fragment>
        )
    }

    componentDidMount() {
    }
}

export default AlertLocal