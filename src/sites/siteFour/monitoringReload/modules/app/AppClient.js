import React from 'react'
import HorizontalBar from '../../charts/horizontalBar/MexHorizontalBar'
import * as serverData from '../../../../../services/model/serverData'
import { clientMetrics } from '../../../../../services/model/clientMetrics'

class MexAppClient extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            stackedData: {}
        }
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
        const {stackedData} = this.state
        const {filter} = this.props
        return this.validatData(stackedData) ? <HorizontalBar header='Client API Usage Count' chartData={stackedData} filter={filter}/> : null
    }

    client = async (region, range) => {
        let mc = await serverData.sendRequest(this, clientMetrics({
            region: region, 
            selector: "api",
            starttime: range.starttime,
            endtime: range.endtime
        }))
        if (mc && mc.response && mc.response.data) {
            let data = []
            let findCloudletList = []
            let registerClientList = []
            let verifyLocationList = []
            let labelList = []
            let dataList = mc.response.data
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
            this.setState(prevState => {
                let stackedData = prevState.stackedData
                stackedData[region] = data
                return { stackedData }
            })
        }
    }

    componentDidMount() {
        this.regions.map(region => {
            this.client(region, this.props.range)
        })
    }
}

export default MexAppClient