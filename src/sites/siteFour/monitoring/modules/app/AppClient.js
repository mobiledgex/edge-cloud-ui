import React from 'react'
import HorizontalBar from '../../charts/horizontalBar/MexHorizontalBar'
import { clientMetrics } from '../../../../../services/model/clientMetrics'
import { sendAuthRequest } from '../../../../../services/model/serverWorker'
import { withRouter } from 'react-router-dom'
import { getOrganization, isAdmin } from '../../../../../services/model/format'

class MexAppClient extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            stackedData: {}
        }
        this._isMounted = false
        this.regions = props.regions
    }

    validatData = (data) => {
        let valid = false
        this.regions.map(region => {
            if (!valid && data[region]) {
                [
                    valid = data[region].length > 0
                ]
            }
        })
        return valid
    }

    render() {
        const { stackedData } = this.state
        const { filter } = this.props
        return this.validatData(stackedData) ? <HorizontalBar header='Client API Usage Count' chartData={stackedData} filter={filter} /> :
            <div className="event-list-main" align="center" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div align="left" className="event-list-header">
                    <h3>Client API Usage Count</h3>
                </div>
                <h3 style={{ marginTop: '8vh' }}><b>No Data</b></h3>
            </div>
    }

    serverResponse = (mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            let data = []
            let findCloudletList = []
            let registerClientList = []
            let verifyLocationList = []
            let labelList = []
            let dataList = mc.response.data
            let region = mc.request.data.region
            dataList.map(clientData => {
                let dataObject = clientData['dme-api'].values
                Object.keys(dataObject).map(key => {
                    let findCloudlet = 0
                    let registerClient = 0
                    let verifyLocation = 0
                    dataObject[key].map(data => {
                        findCloudlet += data.includes('FindCloudlet') ? 1 : 0
                        registerClient += data.includes('RegisterClient') ? 1 : 0
                        verifyLocation += data.includes('VerifyLocation') ? 1 : 0
                    })
                    findCloudletList.push(findCloudlet)
                    registerClientList.push(registerClient)
                    verifyLocationList.push(verifyLocation)
                    labelList.push(`${dataObject[key][0][7]} [${dataObject[key][0][18]}]`)
                    data.push({ key: `${region} -  ${dataObject[key][0][7]} [${dataObject[key][0][18]}]`, findCloudlet, registerClient, verifyLocation })
                })
            })
            if (this._isMounted) {
                this.setState(prevState => {
                    let stackedData = prevState.stackedData
                    stackedData[region] = data
                    return { stackedData }
                })
            }
        }
    }

    client = (range) => {
        this.regions.map(region => {
            sendAuthRequest(this, clientMetrics({
                region: region,
                selector: "api",
                starttime: range.starttime,
                endtime: range.endtime
            }, isAdmin() ? this.props.org : getOrganization()), this.serverResponse)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.org !== this.props.org) {
            this.setState({ stackedData: {} }, () => {
                this.client(this.props.range)
            })
        }
        if (prevProps.range !== this.props.range) {
            this.client(this.props.range)
        }
    }


    componentDidMount() {
        this._isMounted = true
        if (!isAdmin() || this.props.org) {
            this.client(this.props.range)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

export default withRouter(MexAppClient);