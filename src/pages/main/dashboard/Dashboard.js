import React from 'react'
import { withRouter } from 'react-router-dom'
import Control from './control/Control'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <React.Fragment>
                <div id="mex-dashboard" style={{ display: 'flex' }}>
                    <Control></Control>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Dashboard)