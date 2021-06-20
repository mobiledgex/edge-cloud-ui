import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fields } from '../../../../services/model/format'
import { primaryKeys as appInstKeys } from '../../../../services/modules/appInst'
import { appInstUsageMetrics } from '../../../../services/modules/appInstUsageMetrics/appInstUsageMetrics'
import { authSyncRequest, responseValid } from '../../../../services/service'
import MexWorker from '../services/metricUsage.worker.js'
import { Dialog } from '@material-ui/core'
import { Marker } from "react-leaflet";
import MexMap from '../../../../hoc/mexmap/MexMap'
import { cloudGreenIcon } from '../../../../hoc/mexmap/MapProperties'
import { perpetual } from '../../../../helper/constant'
import { FORMAT_FULL_DATE_TIME, FORMAT_FULL_T, time, timeInMilli } from '../../../../utils/date_util'
import { Slider } from '../../../../hoc/mexui'
import { CON_VALUES } from '../../../../helper/constant/perpetual'
import MexCircleMarker from '../../../../hoc/mexmap/utils/MexCircleMarker'
import { Popup } from 'react-leaflet';
import DoughnutChart from '../charts/doughnut/Doughnut'
import './style.css'
class DMEMetrics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            selectedDate: undefined
        }
        this._isMounted = false
        this.worker = new MexWorker()
    }

    circlePopup = (dataList)=>{
        return(
        <Popup style={{height:400, borderRadius:10}} >
            <div style={{width:200}}>
               <DoughnutChart/>
            </div>
        </Popup>
    )}

    renderDevice = (selectedDate, data) => {
        const datetime = time(FORMAT_FULL_T, selectedDate).toLowerCase() + 'z'
        const deviceGeo = data[CON_VALUES][datetime]
        if (deviceGeo) {
            const deviceGeoObject = deviceGeo[CON_VALUES]
            return Object.keys(deviceGeoObject).map(key => {
                const geoLocation = deviceGeoObject[key][perpetual.CON_TAGS]
                return (
                    <React.Fragment key={key}>
                        <MexCircleMarker coords={geoLocation['location']} popup={this.circlePopup(deviceGeoObject[key][perpetual.CON_VALUES])} />
                    </React.Fragment>
                )
            })
        }
    }

    renderMarker = () => {
        const { data, selectedDate } = this.state
        return data ?
            <div>
                {
                    Object.keys(data).map((key, i) => {
                        let location = data[key][perpetual.CON_TAGS][fields.cloudletLocation]
                        let lat = location[fields.latitude]
                        let lon = location[fields.longitude]
                        return (
                            <React.Fragment key={key}>
                                <Marker icon={cloudGreenIcon()} position={[lat, lon]} />
                                {
                                    selectedDate ? this.renderDevice(selectedDate, data[key]) : null
                                }
                            </React.Fragment>
                        )
                    })
                }
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

    render() {
        return (
            <React.Fragment>
                <Dialog fullScreen open={true}>
                    <MexMap renderMarker={this.renderMarker} zoom={3} fullscreen={true} />
                    <div style={{ position: 'absolute', bottom: 10, zIndex: 999, width: '100%', padding: 20 }} align='center'>
                        <Slider min={timeInMilli('2021-05-13T00:00:00')} max={timeInMilli('2021-05-13T00:05:00')} valueLabelFormat={this.valueLabelFormat} step={3000} onChange={this.onSliderChange} />
                    </div>
                </Dialog>
            </React.Fragment>
        )
    }

    fetchData = async () => {
        const { data } = this.props
        const request = appInstUsageMetrics(this, {
            appInst: appInstKeys(data),
            region: data[fields.region],
            selector: 'latency'
        })
        let mc = await authSyncRequest(this, request)
        if (responseValid(mc)) {
            this.worker.postMessage({
                selections: [data],
                ...mc
            })
            this.worker.addEventListener('message', event => {
                if (this._isMounted) {
                    this.setState({ data: event.data.data })
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