// @flow
import * as React from 'react';
import {Component} from 'react';
import momentTimezone from "moment-timezone";
import moment from "moment";
import {getMexTimezone} from "../../../utils/sharedPreferences_util";

let runner;

export default class MiniClockComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'time': this.getCurrentTime(),
            todayDate: undefined
        }
    }

    getDayofWeek() {
        let objToday = moment().tz(getMexTimezone()).toDate();
        let weekday = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'],
            dayOfWeek = weekday[objToday.getDay()];

        return dayOfWeek;
    }

    componentDidMount() {
        this.setState({
            dayOfWeek: this.getDayofWeek(),
        })

        runner = setInterval(() => {
            this.setState({time: this.getCurrentTime()});
        }, 1000);
    }

    getCurrentTime = () => {
        let timezoneHHmmss = momentTimezone().tz(getMexTimezone()).format('hh:mm A');
        return timezoneHHmmss;
    }

    componentWillUnmount() {
        if (runner) {
            clearInterval(runner);
        }
    }

    render() {
        return (
            <div style={{
                color: 'white',
                display: 'flex',
                height: 15,
                marginLeft: 7,
                marginTop: -2,
            }}>
                <div style={{
                    fontSize: '11pt',
                    color: 'rgba(255, 255, 255, 0.85)',
                }}>{this.state.dayOfWeek} {this.state.time}</div>
            </div>
        );
    }
}
