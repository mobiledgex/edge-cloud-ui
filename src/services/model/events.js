import { endpoint } from '../../helper/constant'
import { redux_org } from '../../helper/reduxData'
import * as serverData from './serverData'

export const orgEvents = (data) => {
    return { method: endpoint.EVENTS_SHOW, data: data, showSpinner: false }
}

export const showEvents = async (self, data, showSpinner) => {
    let mcRequest = await serverData.sendRequest(self, { method: endpoint.EVENTS_SHOW, data: data, showSpinner: showSpinner })
    return mcRequest
}

export const showAudits = async (self, data, showSpinner, isPrivate) => {
    let match = data.match ? data.match : {}
    match.types = [data.type]
    if(!isPrivate)
    {
        match.orgs = redux_org.nonAdminOrg(self) ? [redux_org.nonAdminOrg(self)] : undefined
    }
    data.match = match
    let mcRequest = await serverData.sendRequest(self, { method: endpoint.EVENTS_SHOW, data: data, showSpinner: showSpinner })
    return mcRequest
}