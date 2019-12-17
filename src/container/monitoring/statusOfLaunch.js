import React from 'react'
import {Grid, Image} from 'semantic-ui-react';
import MonitoringComponent from '../../components/monitoringComponent'

class StatusOfLaunch extends React.Component {
    constructor() {
        super();

    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }

    render() {

        return (
            <div>
                <div>{this.props.title}</div>
                <Grid  columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>Cloudlet Name</div>
                                <div>3</div>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>Cloudlet Name</div>
                                <div>3</div>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>Cloudlet Name</div>
                                <div>3</div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>Cloudlet Name</div>
                                <div>3</div>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>Cloudlet Name</div>
                                <div>3</div>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>Cloudlet Name</div>
                                <div>3</div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

        )
    }
}
export default MonitoringComponent({width:'100%', height:220})(StatusOfLaunch)


