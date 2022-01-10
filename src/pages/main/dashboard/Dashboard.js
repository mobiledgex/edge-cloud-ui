import { Card, ImageList, ImageListItem } from '@material-ui/core'
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
                <Control></Control>
            </React.Fragment>
        )
    }
}

export default withRouter(Dashboard)