// @flow
import * as React from 'react';
import {Component, useEffect, useState} from 'react';
import '../common/PageMonitoringStyles.css'
import {Center} from "../common/PageMonitoringStyles";
import {getMexTimezone} from "../../../../utils/sharedPreferences_util";
import momentTimezone from "moment-timezone";
import moment from "moment";

const clockTile = {
    color: 'white',
    textAlign: 'center'
}
const clockSpan = {
    padding: '4px'
}
let runner;


export default function ClockComponent(props) {
    const [timezoneName, setTimezoneName] = useState('')
    useEffect(() => {
        let timezoneName = getMexTimezone()
        setTimezoneName(timezoneName)
    }, []);

    function renderTitle() {
        return (
            <div style={{
                display: 'flex',
                width: '100%',
                height: 45
            }}>
                <div className='page_monitoring_title_area draggable' style={{backgroundColor: 'transparent', width:'100%'}}>
                    <div className='page_monitoring_title draggable'
                         style={{
                             flex: 1,
                             marginTop: 10,
                             color: 'white',
                         }}
                    >
                        {timezoneName} Standard Time
                    </div>
                </div>

            </div>
        )
    }


    return (
        <div>
            {renderTitle()}
            <Center style={{height: 160}}>
                <ClockCore/>
            </Center>
        </div>
    )

};


class ClockCore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'time': this.getCurrentTime(),
            todayDate: undefined
        }
    }

    getCurrentTimezoneDate() {
        let objToday = moment().tz(getMexTimezone()).toDate();
        let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayOfWeek = weekday[objToday.getDay()],
            domEnder = function () {
                let a = objToday;
                if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
                a = parseInt((a + "").charAt(1));
                return 1 == a ? "st" : 2 == a ? "nd" : 3 == a;
            }(),
            dayOfMonth = (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            curMonth = months[objToday.getMonth()],
            curYear = objToday.getFullYear();

        let today = dayOfWeek + ", " + curMonth + " " + dayOfMonth + ", " + curYear;
        return today;
    }

    componentDidMount() {
        let todayDate = this.getCurrentTimezoneDate()

        this.setState({
            todayDate: todayDate,
        })

        runner = setInterval(() => {
            this.setState({time: this.getCurrentTime()});
        }, 1000);
    }

    getCurrentTime = () => {
        let timezoneHHmmss = momentTimezone().tz(getMexTimezone()).format('hh:mm:ss A');
        return timezoneHHmmss;
    }

    componentWillUnmount() {
        if (runner) {
            clearInterval(runner);
        }
    }

    render() {
        return (
            <div style={clockTile}>
                <div className='clockDiv'>{this.state.time}</div>
                <div style={{marginTop: 5, fontSize: 15, color: '#77BD25'}}>{this.state.todayDate}</div>
            </div>
        );
    }
}
