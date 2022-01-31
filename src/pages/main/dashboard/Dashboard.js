import { Card, Grid, ImageList, ImageListItem } from '@material-ui/core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import AuditLog from './auditLog/AuditLog'
import Control from './control/Control'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            height: 0
        }
        this.mainRef = React.createRef()
    }

    render() {
        const { height } = this.state
        return (
            <div id='mex-page-dashbaord' ref={this.mainRef} style={{ height: 'calc(100vh - 54px)', overflowY:'auto' , overflowX:'hidden'}}>
                <Control />


                <div style={{ marginTop: 3 }}>
                    <ImageList cols={2} rowHeight={306}>
                        <ImageListItem>
                            <AuditLog />
                        </ImageListItem>
                        <ImageListItem>
                            <Card style={{ height: 'inherit' }}></Card>
                        </ImageListItem>
                    </ImageList>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.setState({ height: this.mainRef.current.clientHeight })
    }
}

export default withRouter(Dashboard)