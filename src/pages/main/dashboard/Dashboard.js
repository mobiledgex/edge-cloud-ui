import React from 'react'
import { withRouter } from 'react-router-dom'
import { EVENT } from '../../../helper/constant/perpetual'
import Logs from './auditLog/Logs'
import Control from './control/Control'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div className='dashboard'>
                <Control>
                    <Logs type={EVENT}/>
                </Control>
            </div>
        )
    }   
}

export default withRouter(Dashboard)