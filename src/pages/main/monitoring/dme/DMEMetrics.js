import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as actions from '../../../../actions';
import { fields } from '../../../../services/model/format'
import { primaryKeys as appInstKeys } from '../../../../services/modules/appInst'
import { appInstUsageMetrics } from '../../../../services/modules/appInstUsageMetrics/appInstUsageMetrics'
import { authSyncRequest, responseValid } from '../../../../services/service'
import MexWorker from '../services/metricUsage.worker.js'
import { Dialog } from '@material-ui/core'
import { Marker } from "react-leaflet";
import MexMap from '../../../../hoc/mexmap/MexMap'
import { cloudIcon } from '../../../../hoc/mexmap/MapProperties'
import { perpetual } from '../../../../helper/constant'
import { FORMAT_FULL_DATE_TIME, FORMAT_FULL_T, time, timeInMilli } from '../../../../utils/date_util'
import { IconButton, Slider } from '../../../../hoc/mexui'
import { CON_TAGS, CON_TOTAL, CON_VALUES } from '../../../../helper/constant/perpetual'
import MexCircleMarker from '../../../../hoc/mexmap/utils/MexCircleMarker'
import { colors, generateColor } from '../../../../utils/heatmap_utils'
import MapLegend from './MapLegend'
import './style.css'
import Histogram from '../charts/histogram/Histogram'
import MexCurve from '../../../../hoc/mexmap/utils/MexCurve'
import CloseIcon from '@material-ui/icons/Close';
import Legend from '../charts/heatmapLegend/Legend'

const buckets = [0, 5, 10, 25, 50, 100]
class DMEMetrics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            connectors: {},
            selectedDate: '2021-05-13t00:00:00z',
            markerType: 'avg',
            sliderMarks: undefined,
            histogramData: undefined,
            selectCloudlet: undefined,
            selectDevice: undefined,
            mapcenter: undefined
        }
        this._isMounted = false
        this.worker = new MexWorker()
    }

    generateColor = (geoValues, markerType) => {
        //todo: geoValues contains multiple values for same geolocation, implement avg of all 
        return generateColor(geoValues[0][markerType])
    }

    setHistogramData = (cloudlet, key, histogramData, mapcenter) => {
        const selectCloudlet = this.state.selectCloudlet
        let update = false
        let data = {}
        if (cloudlet) {
            data.selectCloudlet = key
            data.selectDevice = undefined
            update = true
        }
        else if (selectCloudlet) {
            data.selectDevice = !cloudlet ? key : undefined
            update = true
        }
        else {
            this.props.handleAlertInfo('error', 'Please select cloudlet')
        }
        if (update) {
            this.setState({ histogramData, mapcenter, ...data })
        }
    }

    renderDevice = (data, markerType, connectorMerge) => {
        const { selectDevice } = this.state
        const deviceGeoObject = data[CON_VALUES]
        return Object.keys(deviceGeoObject).map(key => {
            if (selectDevice === undefined || selectDevice === key) {
                const geoTags = deviceGeoObject[key][perpetual.CON_TAGS]
                const geoValues = deviceGeoObject[key][perpetual.CON_VALUES]
                const geoTotal = deviceGeoObject[key][perpetual.CON_TOTAL]
                const location = geoTags['location']
                connectorMerge.push([location.lat, location.lng])
                return (
                    <React.Fragment key={key}>
                        <MexCircleMarker coords={location} color={this.generateColor(geoValues, markerType)} onClick={() => { this.setHistogramData(false, key, geoTotal, [location.lat, location.lng]) }} radius={3} />
                    </React.Fragment>
                )
            }
        })
    }

    fetchLegendData = (timeData, selectCloudlet) => {
        let dataList = []
        Object.keys(timeData).forEach((key) => {
            if (selectCloudlet === undefined || selectCloudlet === key) {
                dataList.push(timeData[key][CON_TAGS])
            }
        })
        return dataList
    }

    renderMarker = () => {
        const { data, selectedDate, markerType, selectCloudlet } = this.state
        const timeData = selectedDate && data && data[selectedDate] && data[selectedDate][CON_VALUES]
        const connectorMerge = { values: [], color: [] }
        return timeData ?
            <div>
                {
                    Object.keys(timeData).map((key, i) => {
                        if (selectCloudlet === undefined || selectCloudlet === key) {
                            const tags = timeData[key][perpetual.CON_TAGS]
                            let location = tags[fields.cloudletLocation]
                            let lat = location[fields.latitude]
                            let lon = location[fields.longitude]
                            connectorMerge.color.push(tags[fields.color])
                            connectorMerge.values[i] = [[lat, lon]]
                            return (
                                <React.Fragment key={key}>
                                    <Marker icon={cloudIcon(i, tags[fields.color])} position={[lat, lon]} onClick={() => { this.setHistogramData(true, key, timeData[key][CON_TOTAL], [lat, lon]) }} />
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
                        <MexCurve key={i} data={[connector]} option={{ color: connectorMerge.color[i], fill: false, dashArray: '10', weight: 0.6 }} />
                    ))
                }
                <MapLegend onChange={(value) => this.setState({ markerType: value })} data={this.fetchLegendData(timeData, selectCloudlet)} />
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

    onSliderChange = (e, value) => {
        const { sliderMarks } = this.state
        let selectedDate = sliderMarks[value].label
        if (this.state.selectedDate !== selectedDate) {
            this.setState({ selectedDate })
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
    }



    renderSlider = () => {
        const { histogramData, sliderMarks } = this.state
        const visibility = Boolean(histogramData)
        return (
            <div style={{ position: 'absolute', bottom: 23, zIndex: 999, width: '100%', paddingRight: 15, paddingLeft: 15 }}>
                <div style={{ backgroundColor: `${visibility ? 'rgba(41,44,51,0.6)' : 'transparent'}` }}>
                    <div align='right'>
                        {visibility ? <IconButton onClick={this.onSelectClose}><CloseIcon /></IconButton> : null}
                    </div>
                    {histogramData ? <Histogram data={histogramData} buckets={buckets} width={'calc(25vw - 0px)'} height={'calc(30vh - 0px)'} />
                        : null}
                    <br/>
                    <div align='center'>
                        {sliderMarks ? <Slider defaultValue={sliderMarks[0].value} min={sliderMarks[0].value} max={sliderMarks[sliderMarks.length - 1].value} valueLabelFormat={this.valueLabelFormat} marks={sliderMarks} onChange={this.onSliderChange} step={null} /> : null}
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { selectedDate, data, histogramData } = this.state
        return (
            <React.Fragment>
                <Dialog fullScreen open={true}>
                    {this.renderMap()}
                    {this.renderSlider()}
                    <div style={{ position: 'absolute', top: 100, zIndex: 9999 }}>
                        <Legend colors={colors} buckets={buckets} />
                    </div>
                </Dialog>
            </React.Fragment>
        )
    }

    tempFetch = () => {
        return { region: "EU", organizationName: "MobiledgeX", appName: "automation-sdk-porttest", version: '1.0' }
    }

    fetchData = async () => {
        const { data } = this.props
        const { selectedDate } = this.state
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
                    console.log(event.data.data)
                    this.setState({ data: event.data.data, sliderMarks: event.data.slider })
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

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(DMEMetrics))