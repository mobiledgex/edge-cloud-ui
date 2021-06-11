import * as endpoint from '../../helper/constant/endpoint';
import * as formatter from './format'

export const getPath = (request) => {
    return `/api/v1/${request.method}`
}

export const getHeader = (request) => {
    if (request.token) {
        return { 'Authorization': `Bearer ${request.token}` }
    }
}

export function formatData(request, response) {
    let data = undefined
    switch (request.method) {
        case endpoint.SHOW_CLOUDLET:
        case endpoint.SHOW_ORG_CLOUDLET:
        case endpoint.SHOW_CLOUDLET_INFO:
        case endpoint.SHOW_ORG_CLOUDLET_INFO:
        case endpoint.SHOW_APP_INST:
        case endpoint.SHOW_CLUSTER_INST:
        case endpoint.SHOW_ALERT:
        case endpoint.SHOW_ORG:
            data = formatter.formatData(response, request.data, request.keys)
            break;
        case endpoint.CLOUDLET_METRICS_ENDPOINT:
        case endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT:
        case endpoint.APP_INST_METRICS_ENDPOINT:
        case endpoint.CLUSTER_METRICS_ENDPOINT:
        case endpoint.CLIENT_METRICS_ENDPOINT:
        case endpoint.CLOUDLET_EVENT_LOG_ENDPOINT:
        case endpoint.CLUSTER_EVENT_LOG_ENDPOINT:
        case endpoint.APP_INST_EVENT_LOG_ENDPOINT:
            data = formatter.formatEventData(response, request.data, request.keys)
            break;
        case endpoint.APP_INST_USAGE_ENDPOINT:
        case endpoint.CLUSTER_INST_USAGE_ENDPOINT:
            data = formatter.formatUsageData(response, request.data, request.keys)
            break;
        default:
            data = response.data;
    }
    return { request, response: { status: response.status, data } }
}