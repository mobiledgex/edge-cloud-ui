import { EVENTS_SHOW } from './endPointTypes'
import * as serverData from './serverData'

export const orgEvents = (data) => {
    return { method: EVENTS_SHOW, data: data, showSpinner: false }
}

export const showEvents = async (self, data, showSpinner) => {
    let mcRequest = await serverData.sendRequest(self, { method: EVENTS_SHOW, data: data, showSpinner: showSpinner })
    return mcRequest
}

export const showAudits = async (self, data, showSpinner) => {
    let match = data.match ? data.match : {}
    match.types = [data.type]
    data.match = match
    let mcRequest = await serverData.sendRequest(self, { method: EVENTS_SHOW, data: data, showSpinner: showSpinner })
    return mcRequest
}

export const getData = (response, body) => {
    return response && response.data ? response.data : []
}