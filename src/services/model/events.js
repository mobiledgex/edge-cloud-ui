import { EVENTS_FIND } from './endPointTypes'

export const orgEvents = (data) => {

    if (!formatter.isAdmin()) {
        {
            data.clusterinst = {
                organization: formatter.getOrganization()
            }
        }
    }
    return { method: CLUSTER_METRICS_ENDPOINT, data: data, showSpinner: false }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, clusterMetricsKeys)
}