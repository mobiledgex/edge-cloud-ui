import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import MexMap from './mexmap/MexMap'
import { appInstMetricTypeKeys } from '../../../services/model/appMetrics'
import { fields } from '../../../services/model/format'
import { LinearProgress, Card, Box, TextField, IconButton } from '@material-ui/core'
import MexChart from './charts/MexChart'
import './style.css'
import { Dropdown, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';

const timeUnit = [
    { unit: 'Minute', min: 1, max: 59, default: 5 },
    { unit: 'Hour', min: 1, max: 24, default: 24 },
    { unit: 'Day', max: 31, min: 1, default: 1 },
    { unit: 'Month', min: 1, max: 12, default: 5 },
    { unit: 'Year', min: 1, max: 1, default: 1 }
]


export default class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData: {},
            mapData: {},
            loading: false,
            timeUnit : timeUnit[2],
            filter: { region: 'ALL', time: timeUnit[2].default, unit: timeUnit[2].unit, metricType: [appInstMetricTypeKeys[0]] },
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.regions.splice(0, 0, 'ALL')
    }

    onTimeSelectUnit = (value) => {
        this.setState(prevState=>{
            let filter = prevState.filter
            filter.time = value.default
            filter.unit = value.unit
            return {filter, timeUnit:value}
        })
    }

    onRegionSelectChange = (value) => {
        let filter = this.state.filter
        filter[fields.region] = value
        this.setState({filter})
    }

    onAppInstMetricTypeChange = (value) => {
        let filter = this.state.filter
        filter['metricType'] = value
        this.setState({filter})
    }

    onTimeChange = (event)=>{
        let value = event.target.value
        this.setState(prevState=>{
            let filter = prevState.filter
            filter.time = value
            return {filter}
        })
    }

    renderSelect = (placeholder, dataList, click,  isMultiple, value, field) => {
        return (
            <div className="mex-monitoring-select-container">
                <Box order={2} p={1} style={{ marginTop: 4, marginRight: 12  }}>
                    {placeholder ? <strong>{placeholder}:&nbsp;&nbsp;</strong> : null}
                    <Dropdown
                        className="mex-monitoring-select"
                        selection
                        multiple = {isMultiple}
                        search
                        options={dataList.map(data => {
                            let text = field ? data[field] : data
                            return { key: text, value: data, text: text }
                        })}
                        defaultValue={value}
                        onChange={(e, { value }) => { click(value) }}
                    />
                </Box>
            </div>
        )
    }

    renderTimeRange = (filter) => {
        return (
            <div style={{ display: 'inline' }}>
                <Icon name='clock outline' size='large' style={{color:'rgba(255,255,255,.6)'}}/>
                <input className="mex-monitoring-time-range-input" type="number" value={filter.time} onChange={this.onTimeChange}/>
                {this.renderSelect(null, timeUnit, this.onTimeSelectUnit, false, this.state.timeUnit, 'unit')}
            </div>
        )
    }

    render() {
        const { mapData, loading, filter } = this.state
        return (
            <div className="monitoring-main" mex-test="component-monitoring">
                {loading ? <LinearProgress /> : null}
                <div className="monitoring-header">
                    <div className="mex-monitoring-filter-left">
                        <h2 className="mex-monitoring-header-label">Monitoring</h2>
                    </div>
                    <div className="mex-monitoring-filter-right">
                        {this.renderSelect('Metric Type', appInstMetricTypeKeys, this.onAppInstMetricTypeChange, true, filter.metricType, 'header')}
                        {this.renderSelect('Region', this.regions, this.onRegionSelectChange, false, filter.region)}
                        {this.renderTimeRange(filter)}
                    </div>
                </div>
                <div className="monitoring-content">
                    <Card style={{ width: '100%' }}>
                        <MexMap data={mapData} />
                    </Card>
                    <MexChart filter={filter}/>
                </div>
            </div>
        )
    }

    formatMapData = (dataList) => {
        let data = dataList.reduce((accumulator, x) => {
            let location = x[fields.cloudletLocation]
            let key = location.latitude + '_' + location.longitude
            if (!accumulator[key]) {
                accumulator[key] = [];
            }
            accumulator[key].push(x);
            return accumulator;
        }, {})

        let mapData = this.state.mapData

        Object.keys(data).map(item => {
            if (mapData[item]) {
                mapData[item] = [...mapData[item], ...data[item]]
            }
            else {
                mapData[item] = data[item]
            }
        })
        return mapData
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

withRouter(connect(null, mapDispatchProps)(Monitoring));