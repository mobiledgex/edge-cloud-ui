// @flow
import * as React from 'react';
import { Component } from 'react';
import * as date_util from '../../../../utils/date_util'
export default class MiniClockComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'time': this.getCurrentTime(),
        }
        this.clockInterval = undefined
    }

    componentDidMount() {
        this.clockInterval = setInterval(() => {
            this.setState({ time: this.getCurrentTime() });
        }, 1000);
    }

    getCurrentTime = () => {
        return date_util.currentTime(date_util.FORMAT_WD_TIME_HH_mm)
    }

    componentWillUnmount() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
    }

    render() {
        return (
            <p style={{
                color: '#d3d3d3',
                fontSize:11,
                width:80
            }}>
                {this.state.time}
            </p>
        );
    }
}
