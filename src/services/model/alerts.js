import AlertWorker from '../worker/mex.worker.js'
import { SHOW_ALERT } from './endPointTypes'
import { getToken } from './serverData'
import * as formatter from './format'
import { WORKER_METRIC } from '../worker/constant.js'

let fields = formatter.fields
const showAlertKeys = () => (
    [
        { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true },
        { field: fields.alertname, serverField: 'labels#OS#alertname', label: 'Alert Name', sortable: true, visible: true },
        { field: fields.appName, serverField: 'labels#OS#app', label: 'App', sortable: true, visible: true },
        { field: fields.appDeveloper, serverField: 'labels#OS#apporg', label: 'App Developer', sortable: true, visible: true },
        { field: fields.appDeveloper, serverField: 'labels#OS#apporg', label: 'App Developer', sortable: true, visible: true },
        { field: fields.version, serverField: 'labels#OS#appver', label: 'App Version', sortable: true, visible: true },
        { field: fields.cloudletName, serverField: 'labels#OS#cloudlet', label: 'Cloudlet', sortable: true, visible: true },
        { field: fields.operatorName, serverField: 'labels#OS#cloudletorg', label: 'Operator', sortable: true, visible: true },
        { field: fields.clusterName, serverField: 'labels#OS#cluster', label: 'Cluster', sortable: true, visible: true },
        { field: fields.clusterdeveloper, serverField: 'labels#OS#clusterorg', label: 'Cluster Developer', sortable: true, visible: true },
        { field: fields.envoyclustername, serverField: 'labels#OS#envoy_cluster_name', label: 'Envoy Cluster', sortable: true, visible: true },
        { field: fields.instance, serverField: 'labels#OS#instance', label: 'Instance', sortable: true, visible: true },
        { field: fields.job, serverField: 'labels#OS#job', label: 'Job', sortable: true, visible: true },
        { field: fields.status, serverField: 'labels#OS#status', label: 'Status', sortable: true, visible: true },
        { field: fields.state, serverField: 'state', label: 'State', sortable: true, visible: true },
        { field: fields.activeAt, serverField: 'active_at', label: 'Active At', sortable: true, visible: true },
        { field: fields.notifyId, serverField: 'notify_id', label: 'Notify ID', sortable: true, visible: true },
        { field: fields.controller, serverField: 'controller', label: 'Controller', sortable: true, visible: true }
    ]
)

export const showAlerts = (data) => {
    return { method: SHOW_ALERT, data: data, token: getToken(), keys : showAlertKeys() }
}

export const sendRequest = (request, callback) => {
    const worker = new AlertWorker();
    worker.postMessage({ type: WORKER_METRIC, request: request, requestType: 'object' });
    worker.addEventListener('message', event => {
        callback(event.data)
    });
}
