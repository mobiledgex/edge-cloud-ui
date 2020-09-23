import React from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import MexMap from './mexmap/MexMap'
import { showAppInsts } from '../../../services/model/appInstance'
import { appInstMetrics } from '../../../services/model/appMetrics'
import * as serverData from '../../../services/model/serverData'
import { fields } from '../../../services/model/format'
import { LinearProgress, Card, Box } from '@material-ui/core'
import MexChart from './charts/MexChart'
import './style.css'
import { Dropdown } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';

export default class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData:{},
            mapData: {},
            loading: false,
            filter : {region : 'ALL'}
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.regions.splice(0, 0, 'ALL')
    }

    onAppInstSelectChange = (value) => {
    }

    onRegionSelectChange = (value) => {
        let filter = this.state.filter
        filter[fields.region] = value
        this.setState({filter})
    }

    renderSelect = (placeholder, dataList, click,  isMultiple, field) => {
        return (
            <div className="mex-monitoring-select-container">
                <Box order={2} p={1} style={{ marginTop: 4, marginRight: 12  }}>
                    <strong>{placeholder}:&nbsp;&nbsp;</strong>
                    <Dropdown
                        className="mex-monitoring-select"
                        selection
                        multiple = {isMultiple}
                        search
                        options={dataList.map(data => {
                            let text = field ? data[field] : data
                            return { key: text, value: data, text: text }
                        })}
                        defaultValue={dataList[0]}
                        onChange={(e, { value }) => { click(value) }}
                    />
                </Box>
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
                        {this.renderSelect('Region', this.regions, this.onRegionSelectChange, false)}
                        {/* {this.renderSelect('App Instances', dataList, this.onAppInstSelectChange, true, fields.appName)} */}
                    </div>
                </div>
                <div className="monitoring-content">
                    {/* <Card style={{ width: '100%' }}>
                        <MexMap data={mapData} />
                    </Card> */}
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