import React from 'react'
import {Grid, Image} from 'semantic-ui-react';

class StatusOfLaunch extends React.Component {
    constructor() {
        super();
        this.state = {
            cloudletData: [],
            keys : [],
            region:[]
        }

    }
    displayName =(i) => {

        return (this.state.keys.length)? this.state.keys[i] : ' '
    }
    displayAppCount =(item, i) => {
        let regionFiltered = this.state.region;
        return (item && item[this.state.keys[i]])?item[this.state.keys[i]].length:' '
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(nextProps.data) {
            if(nextProps.data !== this.props.data) {
                this.setState({cloudletData:nextProps.data})
                this.setState({keys:Object.keys(nextProps.data)})
                this.setState({region:nextProps.rgn})
                this.forceUpdate()
                return true;
            } else {
                this.setState({cloudletData:this.props.data})
                this.setState({keys:Object.keys(this.props.data)})
                this.setState({region:this.props.rgn})
                this.forceUpdate()
                return false;
            }

        } else {
            return false;
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {

    }

    render() {

        return (
            <div>
                <div>{this.props.title}</div>
                <Grid  columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>{this.displayName(0)}</div>
                                <div>{this.displayAppCount(this.state.cloudletData, 0)}</div>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>{this.displayName(1)}</div>
                                <div>{this.displayAppCount(this.state.cloudletData, 1)}</div>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>{this.displayName(2)}</div>
                                <div>{this.displayAppCount(this.state.cloudletData, 2)}</div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>{this.displayName(3)}</div>
                                <div>{this.displayAppCount(this.state.cloudletData, 3)}</div>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>{this.displayName(4)}</div>
                                <div>{this.displayAppCount(this.state.cloudletData, 4)}</div>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div style={{backgroundColor:'#000'}}>
                                <div>{this.displayName(5)}</div>
                                <div>{this.displayAppCount(this.state.cloudletData, 5)}</div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

        )
    }
}
export default StatusOfLaunch


