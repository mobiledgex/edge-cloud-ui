
import React, { Component } from 'react';
import {  DatePicker } from 'antd';



import '../common/PageMonitoringStyles.css'

import axios from "axios";

const { RangePicker } = DatePicker;


export const CancelToken = axios.CancelToken;
export const source = CancelToken.source();

export default class PageDevMonitoring extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div></div>

        )
    }
}
