
import { SHOW_ALERT } from './endpoints'
import { ALERT_SHOW_RECEIVER, ALERT_DELETE_RECEIVER, ALERT_CREATE_RECEIVER } from './endPointTypes'
import * as serverData from './serverData'
import * as formatter from './format'
import AlertWorker from '../worker/mex.worker.js'
import { WORKER_SERVER } from '../worker/constant.js'
import { ADMIN_MANAGER, RECEIVER_TYPE_SLACK, RECEIVER_TYPE_EMAIL } from '../../constant'
import {appInstanceKey} from './appInstClient'

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

export const showAlertReceiverKeys = () => (
    [
        { field: fields.alertname, serverField: 'Name', label: 'Alert Name', sortable: true, visible: true },
        { field: fields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true },
        { field: fields.severity, serverField: 'Severity', label: 'Severity', sortable: true, visible: true },
        { field: fields.username, serverField: 'User', label: 'Username', sortable: true, visible: true },
        { field: fields.slackchannel, serverField: 'SlackChannel', label: 'Slack Channel', sortable: true, visible: true },
        { field: fields.slackwebhook, serverField: 'SlackWebhook', label: 'Slack Webhook', sortable: true, visible: false },
        // { field: fields.alertname, serverField: 'Cloudlet', label: 'Alert Name', sortable: true, visible: true },
        { field: fields.appDeveloper, serverField: 'AppInst#OS#app_key#OS#organization', label: 'App Developer', sortable: true, visible: true },
        { field: fields.appName, serverField: 'AppInst#OS#app_key#OS#name', label: 'App Name', sortable: true, visible: true },
        { field: fields.version, serverField: 'AppInst#OS#app_key#OS#version', label: 'Version', sortable: true, visible: true },
        // { field: fields.alertname, serverField: 'AppInst#OS#cluster_inst_key#OS#cluster_key', label: 'Alert Name', sortable: true, visible: true },
        // { field: fields.alertname, serverField: 'AppInst#OS#cluster_inst_key#OS#cloudlet_key', label: 'Alert Name', sortable: true, visible: true },
        { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: [ADMIN_MANAGER] }
    ]
)

const getKey = (data) => {
    let alert = {}
    alert = {
        name: data[fields.alertname],
        type: data[fields.type].toLowerCase(),
        severity: data[fields.severity].toLowerCase()
    }
    if(data[fields.type] === RECEIVER_TYPE_SLACK)
    {
        alert['slackchannel'] = data[fields.slackchannel]
        alert['slackwebhook'] = data[fields.slackwebhook]
    }
    else if(data[fields.type] === RECEIVER_TYPE_EMAIL)
    {
       alert['email'] = data[fields.email] 
    }
    alert['AppInst'] = appInstanceKey(data)
    return alert
}


export const showAlertReceiver = (data) => {
    return { method: ALERT_SHOW_RECEIVER, data: data }
}

export const createAlertReceiver = async (self, data) => {
    let requestData = getKey(data)
    let request = { method: ALERT_CREATE_RECEIVER, data: requestData }
    return await serverData.sendRequest(self, request)
}

export const deleteAlertReceiver = (data) => {
    let requestData = getKey(data)
    return { method: ALERT_DELETE_RECEIVER, data: requestData, success: `Alert Receiver ${data[fields.alertname]} deleted successfully` }
}

export const showAlerts = (data) => {
    return { method: SHOW_ALERT, data: data, token: serverData.getToken(), keys: showAlertKeys() }
}

export const sendRequest = (request, callback) => {
    const worker = new AlertWorker();
    worker.postMessage({ type: WORKER_SERVER, request: request, requestType: 'object' });
    worker.addEventListener('message', event => {
        callback(event.data)
    });
}

const customData = (value) => {
    return value
}

export const getData = (response, body) => {
    return formatter.formatAlertData(response, body, showAlertReceiverKeys(), customData)
}
