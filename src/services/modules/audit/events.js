import { endpoint } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'
import { authSyncRequest } from '../../service'

export const orgEvents = (data) => {
    return { method: endpoint.EVENTS_SHOW, data: data, showSpinner: false }
}

export const showEvents = async (self, data, showSpinner) => {
    let mcRequest = await authSyncRequest(self, { method: endpoint.EVENTS_SHOW, data: data, showSpinner: showSpinner })
    return mcRequest
}

export const showAudits = async (self, data, org=undefined, showSpinner) => {
    let match = data.match ? data.match : {}
    match.types = [data.type]
    if (!redux_org.isAdmin(self) || Boolean(org)) {
        match.orgs = redux_org.nonAdminOrg(self) ? [redux_org.nonAdminOrg(self)] : [org]
    }
    data.match = match
    let mcRequest = await authSyncRequest(self, { method: endpoint.EVENTS_SHOW, data: data, showSpinner: showSpinner })
    return mcRequest
}