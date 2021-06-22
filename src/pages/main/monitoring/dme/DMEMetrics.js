import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fields } from '../../../../services/model/format'
import { primaryKeys as appInstKeys } from '../../../../services/modules/appInst'
import { appInstUsageMetrics } from '../../../../services/modules/appInstUsageMetrics/appInstUsageMetrics'
import { authSyncRequest, responseValid } from '../../../../services/service'
import MexWorker from '../services/metricUsage.worker.js'
import { Card, Dialog, Grid } from '@material-ui/core'
import { Marker } from "react-leaflet";
import MexMap from '../../../../hoc/mexmap/MexMap'
import { cloudGreenIcon } from '../../../../hoc/mexmap/MapProperties'
import { perpetual } from '../../../../helper/constant'
import { FORMAT_FULL_DATE_TIME, FORMAT_FULL_T, time, timeInMilli } from '../../../../utils/date_util'
import { Slider } from '../../../../hoc/mexui'
import { CON_TAGS, CON_TOTAL, CON_VALUES } from '../../../../helper/constant/perpetual'
import MexCircleMarker from '../../../../hoc/mexmap/utils/MexCircleMarker'
import { Popup } from 'react-leaflet';
import DoughnutChart from '../charts/doughnut/Doughnut'
import { generateColor } from '../../../../utils/heatmap_utils'
import MapLegend from './MapLegend'
import './style.css'
import Histogram from '../charts/histogram/Histogram'
import MexCurve from '../../../../hoc/mexmap/utils/MexCurve'

const buckets = [0, 5, 10, 25, 50, 100]
class DMEMetrics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            connectors: {},
            selectedDate: '2021-05-13T00:00:00',
            markerType: 'avg',
            histogramData: undefined
        }
        this._isMounted = false
        this.worker = new MexWorker()
    }

    circlePopup = (dataList) => {
        return (
            <Popup style={{ height: 400, borderRadius: 10 }} >
                <div style={{ width: 200 }}>
                    <DoughnutChart />
                </div>
            </Popup>
        )
    }

    generateColor = (geoValues, markerType) => {
        //todo: geoValues contains multiple values for same geolocation, implement avg of all 
        return generateColor(geoValues[0][markerType])
    }

    setHistogramData = (histogramData) => {
        this.setState({ histogramData })
    }

    renderDevice = (selectedDate, data, markerType) => {
        const datetime = time(FORMAT_FULL_T, selectedDate).toLowerCase() + 'z'
        const deviceGeo = data[CON_VALUES][datetime]
        if (deviceGeo) {
            const deviceGeoObject = deviceGeo[CON_VALUES]
            return Object.keys(deviceGeoObject).map(key => {
                const geoTags = deviceGeoObject[key][perpetual.CON_TAGS]
                const geoValues = deviceGeoObject[key][perpetual.CON_VALUES]
                const geoTotal = deviceGeoObject[key][perpetual.CON_TOTAL]
                return (
                    <React.Fragment key={key}>
                        <MexCircleMarker coords={geoTags['location']} popup={this.circlePopup(geoValues)} color={this.generateColor(geoValues, markerType)} onClick={() => { this.setHistogramData(geoTotal) }} radius={3} />
                    </React.Fragment>
                )
            })
        }
    }

    renderMarker = () => {
        const { data, connectors, selectedDate, markerType } = this.state
        let connectorMerge = []
        return data ?
            <div>
                {
                    Object.keys(data).map((key, i) => {
                        let location = data[key][perpetual.CON_TAGS][fields.cloudletLocation]
                        let lat = location[fields.latitude]
                        let lon = location[fields.longitude]
                        connectorMerge.push(connectors[key])

                        return (
                            <React.Fragment key={key}>
                                <Marker icon={cloudGreenIcon()} position={[lat, lon]} onClick={() => { this.setHistogramData(data[key][CON_TOTAL]) }} />
                                {
                                    selectedDate ? this.renderDevice(selectedDate, data[key], markerType) : null
                                }
                            </React.Fragment>
                        )
                    })
                }
                <MexCurve data={connectorMerge} option={{ color: 'red', fill: false, dashArray: '10', weight: 0.2 }} />
                <MapLegend onChange={(value) => this.setState({ markerType: value })} />
            </div> : null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    valueLabelFormat = (value) => {
        return time(FORMAT_FULL_DATE_TIME, value)
    }

    onSliderChange = (e, value) => {
        if (this.state.selectedDate !== value) {
            this.setState({ selectedDate: value })
        }
    }

    renderMap = () => {
        return (
            <React.Fragment>
                <MexMap renderMarker={this.renderMarker} zoom={2} wheel={true} style={{ height: 'calc(50vh - 0px)' }} />
                <div style={{ position: 'absolute', top: 'calc(46vh - 0px)', zIndex: 999, width: '100%', paddingLeft: 25, paddingRight: 25 }} align='center'>
                    <Slider min={timeInMilli('2021-05-13T00:00:00')} max={timeInMilli('2021-05-13T00:05:00')} valueLabelFormat={this.valueLabelFormat} step={3000} onChange={this.onSliderChange} />
                </div>
            </React.Fragment>
        )
    }

    render() {
        const { histogramData } = this.state
        return (
            <React.Fragment>
                <Dialog fullScreen open={true} PaperProps={{
                    style: {
                        backgroundColor: '#0A0A0A'
                    }
                }}>
                    {this.renderMap()}
                    <Grid container>
                        <Grid item xs={6}>{histogramData ? <Card style={{margin:3}}><Histogram data={histogramData} buckets={buckets} /></Card> : null}</Grid>
                        <Grid item xs={6}>{histogramData ? <Card style={{margin:3}}></Card> : null}</Grid>
                    </Grid>
                </Dialog>
            </React.Fragment>
        )
    }

    tempFetch = () => {
        return { region: "EU", organizationName: "MobiledgeX", appName: "automation-sdk-porttest", version: '1.0' }
    }

    fetchData = async () => {
        const { data } = this.props
        const tempData = this.tempFetch()
        const request = appInstUsageMetrics(this, {
            appInst: appInstKeys(tempData),
            region: tempData[fields.region],
            selector: 'latency'
        })
        let mc = await authSyncRequest(this, request)
        if (responseValid(mc)) {
            this.worker.postMessage({
                selections: data,
                ...mc
            })
            this.worker.addEventListener('message', event => {
                if (this._isMounted) {
                    this.setState({ data: event.data.data, connectors: event.data.connectors, histogramData:event.data.appLatency })
                }
            })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchData()
    }

    componentWillUnmount() {
        this._isMounted = false
        this.worker.terminate()
    }
}

export default withRouter(connect(null, null)(DMEMetrics))