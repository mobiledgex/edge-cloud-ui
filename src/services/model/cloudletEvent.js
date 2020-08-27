
import * as formatter from './format'
import { CLOUDLET_EVENT_LOG_ENDPOINT } from './endPointTypes'
import * as serverData from './serverData'
import * as dateUtil from '../../utils/date_util'
let fields = formatter.fields

export const showKey = () => (
    { region: 'EU', cloudlet: { organization: "TDG", name: "automationBerlinCloudlet" } }
)

export const cloudletEvents = async (self, data) => {
    let requestInfo = { method: CLOUDLET_EVENT_LOG_ENDPOINT, data: showKey() }
    let mcRequest = await serverData.sendRequest(self, requestInfo)
    return getData(mcRequest)
}

const customData = (value) => {
    value[fields.time] = dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value[fields.time])
}

export const getData = (mcRequest) => {
    if (mcRequest && mcRequest.response) {
        let response = mcRequest.response
        let body = mcRequest.request
        return formatter.formatEventData(response, body, customData)
    }
}
