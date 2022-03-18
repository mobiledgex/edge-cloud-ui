import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../../../../actions';
import { localFields } from '../../../../services/fields'
import { appInstKeys } from '../../../../services/modules/appInst'
import { cloudletKeys } from '../../../../services/modules/cloudlet'
import { appInstUsageMetrics, deviceKeys as appDeviceKeys } from '../../../../services/modules/appInstUsageMetrics/appInstUsageMetrics'
import { cloudletUsageMetrics, deviceKeys as cloudletDeviceKeys } from '../../../../services/modules/cloudletMetricUsage/cloudletUsageMetrics'
import { authSyncRequest } from '../../../../services/service'
import MexWorker from '../services/metricUsage.worker.js'
import { Dialog, Grid, LinearProgress } from '@material-ui/core'
import { Marker } from "react-leaflet";
import MexMap from '../../../../hoc/mexmap/MexMap'
import { cloudIcon } from '../../../../hoc/mexmap/MapProperties'
import { perpetual } from '../../../../helper/constant'
import { FORMAT_DATE_FILE_NAME, FORMAT_FULL_DATE_TIME, time } from '../../../../utils/date_util'
import { IconButton, Slider } from '../../../../hoc/mexui'
import { CON_TAGS, CON_TOTAL, CON_VALUES, PARENT_APP_INST } from '../../../../helper/constant/perpetual'
import MexCircleMarker from '../../../../hoc/mexmap/utils/MexCircleMarker'
import { colors, generateColor } from '../../../../utils/heatmap_utils'
import MapLegend from './MapLegend'
import Histogram from '../charts/histogram/Histogram'
import MexCurve from '../../../../hoc/mexmap/utils/MexCurve'
import CloseIcon from '@material-ui/icons/Close';
import Legend from '../charts/heatmapLegend/Legend'
import DMEToolbar, { ACTION_CLOSE, ACTION_DATA_TYPE, ACTION_LATENCY_RANGE, ACTION_PICKER } from './DMEToolbar';
import CloudletDetails from './details/CloudletDetails';
import DeviceDetails from './details/DeviceDetails';
import { operators } from "../../../../helper/constant";
import { timeRangeInMin } from '../../../../hoc/mexui/Picker';
import { AIK_APP_ALL, AIK_APP_CLOUDLET_CLUSTER } from '../../../../services/modules/appInst/primary';
import { timezonePref } from '../../../../utils/sharedPreferences_util';
import './style.css'
import { equal } from '../../../../helper/constant/operators';
import { responseValid } from '../../../../services/config';

const buckets = [0, 5, 10, 25, 50, 100]

const formatDate = (data) => {
    return time(FORMAT_DATE_FILE_NAME, data)
}

const fetchFileName=(self)=>{
    return `${self.props.id === PARENT_APP_INST ? 'App' : 'Cloudlet'}LatencyData_${formatDate(self.range.from)}_To_${formatDate(self.range.to)}.csv`
}

class DMEMetrics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            connectors: {},
            selectedDate: undefined,
            markerType: 'avg',
            sliderMarks: undefined,
            histogramData: undefined,
            selectCloudlet: undefined,
            selectDevice: undefined,
            mapcenter: undefined,
            latencyRange: 0,
            csvData: undefined,
            loading: false,
            hoveredLocation:undefined
        }
        this._isMounted = false
        this.worker = new MexWorker()
        this.range = timeRangeInMin()
    }

    generateColor = (geoValues, markerType) => {
        //todo: geoValues contains multiple values for same geolocation, implement avg of all 
        return generateColor(geoValues[0][markerType])
    }

    filterSlider = (cloudletKey, deviceKey) => {
        const { data, markerType, latencyRange } = this.state
        let slider = Object.keys(data).filter(timeKey => {
            let valid = true
            let cloudletValues = data[timeKey][CON_VALUES]
            if (cloudletKey) {
                if (cloudletValues[cloudletKey]) {
                    let deviceValues = cloudletValues[cloudletKey][CON_VALUES]
                    if (deviceKey) {
                        if (deviceValues[deviceKey] === undefined) {
                            valid = false
                        }
                    }
                }
                else {
                    valid = false
                }
            }
            return valid
        })

        let index = 0
        const sliderMarks = this.orgSliderMarks ? this.orgSliderMarks.filter((marks, i) => {
            if (marks[markerType] >= latencyRange && slider.includes(marks.label)) {
                marks.value = index
                index++
                return true
            }
        }) : []

        this.setState({ sliderMarks: undefined }, () => {
            this.setState({ sliderMarks })
        })
    }

    setHistogramData = (cloudlet, key, selection, mapcenter, sliderChange) => {
        let histogramData = selection[key]
        const selectCloudlet = this.state.selectCloudlet
        let update = false
        let data = {}
        if (cloudlet) {
            data.selectCloudlet = key
            if (!sliderChange) {
                this.filterSlider(key)
            }
            data.selectDevice = undefined
            update = true
        }
        else if (selectCloudlet) {
            data.selectDevice = !cloudlet ? key : undefined
            if (!sliderChange) {
                this.filterSlider(this.state.selectCloudlet, key)
            }
            update = true
        }
        else {
            this.props.handleAlertInfo('error', 'Please select a cloudlet before selecting a location tile')
        }
        if (update) {
            this.setState({ histogramData, mapcenter, ...data })
        }
    }

    renderDevice = (data, markerType, connectorMerge) => {
        const { selectDevice, hoveredLocation } = this.state
        const deviceGeoObject = data[CON_VALUES]
        return Object.keys(deviceGeoObject).map(key => {
            if (selectDevice === undefined || selectDevice === key) {
                const geoTags = deviceGeoObject[key][perpetual.CON_TAGS]
                const geoValues = deviceGeoObject[key][perpetual.CON_VALUES]
                const location = geoTags['location']
                let radius = hoveredLocation && equal(location, hoveredLocation) ? 13 : 4
                connectorMerge.push([location.lat, location.lng])
                return (
                    <React.Fragment key={key}>
                        <MexCircleMarker coords={location} color={this.generateColor(geoValues, markerType)} onClick={() => { this.setHistogramData(false, key, deviceGeoObject, [location.lat, location.lng]) }} radius={radius}/>
                    </React.Fragment>
                )
            }
        })
    }

    fetchLegendData = (timeData, selectCloudlet, markerType) => {
        let dataList = []
        Object.keys(timeData).forEach((key) => {
            if (selectCloudlet === undefined || selectCloudlet === key) {
                dataList.push({ ...timeData[key][CON_TAGS], key, locationColor: generateColor(operators._avg(timeData[key][CON_TOTAL][markerType])) })
            }
        })
        return dataList
    }

    renderMarker = () => {
        const { data, selectedDate, markerType, selectCloudlet } = this.state
        const { id } = this.props
        const timeData = selectedDate && data && data[selectedDate] && data[selectedDate][CON_VALUES]
        const connectorMerge = { values: [], color: [] }
        return timeData ?
            <div>
                {
                    Object.keys(timeData).map((key, i) => {
                        if (selectCloudlet === undefined || selectCloudlet === key) {
                            const tags = timeData[key][perpetual.CON_TAGS]
                            let location = tags[localFields.cloudletLocation]
                            let lat = location[localFields.latitude]
                            let lon = location[localFields.longitude]
                            connectorMerge.color.push(tags[localFields.color])
                            connectorMerge.values[i] = [[lat, lon]]
                            return (
                                <React.Fragment key={key}>
                                    <Marker icon={cloudIcon(i, tags[localFields.color])} position={[lat, lon]} onClick={() => { this.setHistogramData(true, key, timeData, [lat, lon]) }} />
                                    {
                                        this.renderDevice(timeData[key], markerType, connectorMerge.values[i])
                                    }
                                </React.Fragment>
                            )
                        }
                    })
                }
                {
                    connectorMerge.values.length > 0 && connectorMerge.values.map((connector, i) => (
                        <MexCurve key={i} data={[connector]} option={{ color: connectorMerge.color[i], fill: false, dashArray: '10', weight: 1.5 }} />
                    ))
                }
                <MapLegend id={id} data={this.fetchLegendData(timeData, selectCloudlet, markerType)} onClick={(key, location) => { this.setHistogramData(true, key, timeData, location) }} />
            </div> : null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    valueLabelFormat = (value) => {
        const { sliderMarks } = this.state
        let selectedDate = sliderMarks[value].label
        return time(FORMAT_FULL_DATE_TIME, selectedDate.toUpperCase())
    }

    updateSelectCharts = (data, selectedDate, selectCloudlet, selectDevice) => {
        const timeData = selectedDate && data && data[selectedDate] && data[selectedDate][CON_VALUES]
        if (timeData) {
            let isCloudlet = true
            let chartData = timeData
            let key = selectCloudlet
            let location = timeData[selectCloudlet][perpetual.CON_TAGS][localFields.cloudletLocation]
            location = [location[localFields.latitude], location[localFields.longitude]]
            if (selectDevice) {
                key = selectDevice
                chartData = timeData[selectCloudlet][perpetual.CON_VALUES]
                location = chartData[selectDevice][perpetual.CON_TAGS]['location']
                location = [location.lat, location.lng]
                isCloudlet = false
            }
            this.setHistogramData(isCloudlet, key, chartData, location, true)
        }
    }

    onSliderChange = (e, value) => {
        const { data, sliderMarks, selectCloudlet, selectDevice } = this.state
        if (sliderMarks && sliderMarks.length > 0) {
            let selectedDate = sliderMarks[value].label
            if (this.state.selectedDate !== selectedDate) {
                this.setState({ selectedDate }, () => {
                    if (selectCloudlet || selectDevice) {
                        this.updateSelectCharts(data, selectedDate, selectCloudlet, selectDevice)
                    }
                })

            }
        }
    }

    renderMap = () => {
        const { mapcenter } = this.state
        return (
            <MexMap renderMarker={this.renderMarker} zoom={3} fullscreen={true} center={mapcenter} />
        )
    }

    onSelectClose = () => {
        this.setState({
            histogramData: undefined,
            mapcenter: undefined,
            selectedData: undefined,
            selectCloudlet: undefined,
            selectDevice: undefined,
        })
        this.filterSlider()
    }

    renderDetails = () => {
        const { selectDevice, histogramData, markerType } = this.state
        const { id } = this.props
        return selectDevice ? <DeviceDetails data={histogramData} keys={id === PARENT_APP_INST ? appDeviceKeys : cloudletDeviceKeys} /> :
            <CloudletDetails data={histogramData} markerType={markerType} onMouseOver={(location)=>{this.setState({hoveredLocation:location})}} onMouseOut={()=>{this.setState({hoveredLocation:undefined})}} onClick={(key, data, location) => { this.setHistogramData(false, key, data, location) }} />
    }

    renderSlider = () => {
        const { histogramData, sliderMarks, markerType, selectCloudlet } = this.state
        const visibility = Boolean(selectCloudlet)
        return (
            <div style={{ position: 'absolute', bottom: 23, zIndex: 999, width: '100%', paddingRight: 15, paddingLeft: 15 }}>
                <div style={{ backgroundColor: `${visibility ? 'rgba(41,44,51,0.6)' : 'transparent'}` }}>
                    {
                        visibility ?
                            <React.Fragment>
                                <div align='right'>
                                    <IconButton onClick={this.onSelectClose}><CloseIcon /></IconButton>
                                </div>
                                <Grid container>
                                    <Grid xs={4} item>
                                        <Histogram data={histogramData[CON_TOTAL]} buckets={buckets} width={'calc(25vw - 0px)'} height={'calc(30vh - 0px)'} />
                                    </Grid>
                                    <Grid xs={4} item>
                                        {this.renderDetails()}
                                    </Grid>
                                </Grid>
                                <br />
                            </React.Fragment> : null
                    }
                    <div align='center'>
                        {sliderMarks && sliderMarks.length > 0 ? <Slider defaultValue={sliderMarks[0].value} min={sliderMarks[0].value} max={sliderMarks.length > 1 ? sliderMarks[sliderMarks.length - 1].value : undefined} valueLabelFormat={this.valueLabelFormat} marks={sliderMarks} onChange={this.onSliderChange} markertype={markerType} step={null} /> : null}
                    </div>
                </div>
            </div>
        )
    }

    onLatencyRangeChange = () => {
        const { markerType, latencyRange } = this.state
        let index = 0
        const sliderMarks = this.orgSliderMarks ? this.orgSliderMarks.filter((marks, i) => {
            if (marks[markerType] >= latencyRange) {
                marks.value = index
                index++
                return true
            }
        }) : []
        this.setState({ sliderMarks: undefined }, () => {
            this.setState({ sliderMarks }, () => {
                this.onSliderChange(undefined, 0)
            })
        })
    }

    onToolbar = (action, value) => {
        switch (action) {
            case ACTION_DATA_TYPE:
                this.setState({ markerType: value }, () => {
                    this.onLatencyRangeChange()
                })
                break;
            case ACTION_CLOSE:
                this.props.onClose()
                break;
            case ACTION_PICKER:
                this.range = value
                this.fetchData()
                break;
            case ACTION_LATENCY_RANGE:
                this.setState({ latencyRange: parseInt(value) }, () => {
                    this.onLatencyRangeChange()
                })
                break;
        }
    }

    render() {
        const { loading, csvData } = this.state
        return (
            <React.Fragment>
                <Dialog fullScreen open={true}>
                    {loading ? <LinearProgress /> : null}
                    <DMEToolbar onChange={this.onToolbar} csvData={csvData} filename={fetchFileName(this)}></DMEToolbar>
                    {this.renderMap()}
                    {this.renderSlider()}
                    <div style={{ position: 'absolute', top: 170, zIndex: 9999, pointerEvents: 'none' }}>
                        <Legend colors={colors} buckets={buckets} />
                    </div>
                </Dialog>
            </React.Fragment>
        )
    }

    fetchData = async () => {
        this.setState({ data: {}, sliderMarks: undefined, selectedDate: undefined, loading: true })
        const { data, id, group } = this.props
        const tempData = data[0]
        const commonRequest = {
            region: tempData[localFields.region],
            selector: 'latency',
            starttime: this.range.from,
            endtime: this.range.to
        }
        const request = id === PARENT_APP_INST ? appInstUsageMetrics(this, {
            appInst: appInstKeys(tempData, group ? AIK_APP_ALL : AIK_APP_CLOUDLET_CLUSTER),
            ...commonRequest
        }) : cloudletUsageMetrics(this, {
            cloudlet: cloudletKeys(tempData),
            ...commonRequest
        })
        let mc = await authSyncRequest(this, request)
        if (responseValid(mc)) {
            this.worker.postMessage({
                id,
                selections: data,
                timezone:timezonePref(),
                ...mc
            })
            this.worker.addEventListener('message', event => {
                if (this._isMounted) {
                    if (event.data.data) {
                        this.orgSliderMarks = event.data.slider
                        this.setState({ data: event.data.data, sliderMarks: this.orgSliderMarks, selectedDate: event.data.starttime, csvData: event.data.csvData })
                    }
                    else {
                        this.props.handleAlertInfo('error', 'No latency samples were found for the selected time period')
                    }
                }
            })
        }
        this.setState({ loading: false })
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

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(DMEMetrics))