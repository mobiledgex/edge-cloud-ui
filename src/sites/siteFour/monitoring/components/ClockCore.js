import React, {Component} from 'react';

const clockTile = {
    color: 'white',
    textAlign: 'center'
}
const clockSpan = {
    padding: '4px'
}
let runner;

export default class ClockCore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'time': this.getCurrentTime(),
            todayDate: undefined
        }
    }


    getDate() {
        let objToday = new Date(),
            weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayOfWeek = weekday[objToday.getDay()],
            domEnder = function () {
                let a = objToday;
                if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
                a = parseInt((a + "").charAt(1));
                return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th"
            }(),
            dayOfMonth = (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            curMonth = months[objToday.getMonth()],
            curYear = objToday.getFullYear(),
            curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
            curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
            curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
            curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
        let today = dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
        return today;

    }

    componentDidMount() {
        let todayDate = this.getDate()

        this.setState({
            todayDate: todayDate,
        })

        runner = setInterval(() => {
            this.setState({time: this.getCurrentTime()});
        }, 1000);
    }

    getCurrentTime = () => {
        const locale = this.props.locale ? this.props.locale : [];
        const hour12 = (this.props.hour12 == false) ? false : true;
        let hour, minute, second;
        if (this.props.format) {
            switch (this.props.format.toLowerCase()) {
                case 'hh':
                    hour = '2-digit';
                    break;
                case 'hh-mm':
                    hour = '2-digit';
                    minute = '2-digit';
                    break;
                case 'hh-mm-ss':
                    hour = '2-digit';
                    minute = '2-digit';
                    second = '2-digit';
                    break;
                default:
                    hour = '2-digit';
                    minute = '2-digit';
                    second = '2-digit';
            }
        }
        let time = new Date().toLocaleTimeString(locale, {'hour12': hour12, 'hour': hour, 'minute': minute, 'second': second});
        return time;
    }

    componentWillUnmount() {
        if (runner) {
            clearInterval(runner);
        }
    }

    render() {
        return (
            <div style={clockTile}>
                <div className='clock001'>{this.state.time}</div>
                <div style={{marginTop: 5, fontSize: 15, color: '#77BD25'}}>{this.state.todayDate}</div>
            </div>
        );
    }
}


