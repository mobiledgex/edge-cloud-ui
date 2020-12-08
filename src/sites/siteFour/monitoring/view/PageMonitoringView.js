import { Center, ClusterCluoudletAppInstLabel, LegendOuterDiv, PageMonitoringStyles } from '../common/PageMonitoringStyles'

import type { PageMonitoringProps } from "../common/PageMonitoringProps";
import { CustomSwitch, graphDataCount, PageDevMonitoringMapDispatchToProps, PageDevMonitoringMapStateToProps } from '../common/PageMonitoringProps'
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AppsIcon from '@material-ui/icons/Apps';
import { SemanticToastContainer } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, { Component } from 'react';
import { withSize } from 'react-sizeme';
import uniqBy from 'lodash/uniqBy'
import { connect } from 'react-redux';
import { Dialog, Toolbar } from '@material-ui/core'
import { Button, Col, ConfigProvider, DatePicker, Dropdown as ADropdown, Menu as AMenu, Popover, Row, Select, TreeSelect } from 'antd';


import { Responsive, WidthProvider } from "react-grid-layout";

import '../common/PageMonitoringStyles.css'

import axios from "axios";
import { UnfoldLess, UnfoldMore } from "@material-ui/icons";
import * as dateUtil from '../../../../utils/date_util'
import { getMexTimezone } from '../../../../utils/sharedPreferences_util';
import CircularProgress from "@material-ui/core/CircularProgress";
import { HELP_MONITORING } from '../../../../tutorial';

const { RangePicker } = DatePicker;
const { Option } = Select;
const ASubMenu = AMenu.SubMenu;
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const FontAwesomeIcon = require('react-fontawesome')
const legendIconSize = 18
const OPTIONS = { delay: 1000 }
const emptyMessage = () => (
    <div style={{ textAlign: 'center', color: 'white !important', display: 'flex' }}>
        <div style={{ marginLeft: 10, color: 'orange' }}>No data available</div>
    </div>
);

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
