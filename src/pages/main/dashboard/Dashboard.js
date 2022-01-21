import { Card, Grid, ImageList, ImageListItem } from '@material-ui/core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import AuditLog from './auditLog/AuditLog'
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
                    <Grid container>
                        <Grid item xs={8}>
                            <Control/>
                        </Grid>
                        <Grid item xs={4}>
                            
                        </Grid>
                    </Grid>
                </div>
                <div style={{ marginTop: 3 }}>
                    <ImageList cols={2} rowHeight={306}>
                        <ImageListItem>
                            <AuditLog />
                        </ImageListItem>
                        <ImageListItem>
                            <Card style={{height:'inherit'}}></Card>
                        </ImageListItem>
                    </ImageList>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Dashboard)