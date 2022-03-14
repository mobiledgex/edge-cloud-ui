import { Grid } from '@material-ui/core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import AuditLog from './auditLog/AuditLog'
import Control from './control/Control'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
    }



    render() {
        return (
            <div className='dashboard'>
                <Control>
                    <AuditLog />
                </Control>
            </div>
        )
    }

    
}

export default withRouter(Dashboard)