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
class DMEMetrics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
        this._isMounted = false
        this.worker = new MexWorker()
    }

    renderMarker = () => {
        const { data } = this.state
        return data ?
            <div>
                {Object.keys(data).map((key, i) => {
                    let location = data[key][perpetual.CON_TAGS][fields.cloudletLocation]
                    let lat = location[fields.latitude]
                    let lon = location[fields.longitude]
                    return (
                        <React.Fragment key={key}>
                            <Marker icon={cloudGreenIcon()} position={[lat, lon]}>
                            </Marker>
                        </React.Fragment>
                    )
                })}
            </div> : null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    render() {
        return (
            <React.Fragment>
                <Dialog fullScreen open={true}>
                    <MexMap renderMarker={this.renderMarker} zoom={3} fullscreen={true} />
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
                    console.log(event.data)
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