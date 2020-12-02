
import { SHOW_ALERT } from './endpoints'
import { ALERT_SHOW_RECEIVER, ALERT_DELETE_RECEIVER, ALERT_CREATE_RECEIVER } from './endPointTypes'
import * as serverData from './serverData'
import * as formatter from './format'
import { ADMIN_MANAGER, RECEIVER_TYPE_SLACK, RECEIVER_TYPE_EMAIL, HEALTH_CHECK } from '../../constant'
import { FORMAT_FULL_DATE_TIME } from '../../utils/date_util'

let fields = formatter.fields
export const showAlertKeys = () => (
    [
        { field: fields.region, label: 'Region', serverField: 'labels#OS#region', sortable: true, visible: true, summary: false },
        { field: fields.alertname, serverField: 'labels#OS#alertname', label: 'Alert Name', sortable: true, visible: true, summary: false },
        { field: fields.appName, serverField: 'labels#OS#app', label: 'App Instance', sortable: true, visible: true, summary: false },
        { field: fields.appDeveloper, serverField: 'labels#OS#apporg', label: 'App Developer', sortable: true, visible: false, summary: false },
        { field: fields.version, serverField: 'labels#OS#appver', label: 'App Version', sortable: true, visible: false, summary: false },
        { field: fields.cloudletName, serverField: 'labels#OS#cloudlet', label: 'Cloudlet', sortable: true, visible: false, summary: false },
        { field: fields.operatorName, serverField: 'labels#OS#cloudletorg', label: 'Operator', sortable: true, visible: false, summary: false },
        { field: fields.clusterName, serverField: 'labels#OS#cluster', label: 'Cluster', sortable: true, visible: false, summary: false },
        { field: fields.clusterdeveloper, serverField: 'labels#OS#clusterorg', label: 'Cluster Developer', sortable: true, visible: false, summary: false },
        { field: fields.envoyclustername, serverField: 'labels#OS#envoy_cluster_name', label: 'Envoy Cluster', sortable: true, visible: false, summary: true },
        { field: fields.instance, serverField: 'labels#OS#instance', label: 'Instance', sortable: true, visible: false, summary: true },
        { field: fields.job, serverField: 'labels#OS#job', label: 'Job', sortable: true, visible: false, summary: true },
        { field: fields.port, serverField: 'labels#OS#port', label: 'Port', sortable: true, visible: false, summary: true },
        { field: fields.status, serverField: 'labels#OS#status', label: 'Status', sortable: true, visible: false, summary: true, formatData: HEALTH_CHECK },
        { field: fields.state, serverField: 'state', label: 'State', sortable: true, visible: false, summary: false },
        { field: fields.activeAt, serverField: 'active_at#OS#seconds', label: 'Active At', sortable: true, visible: false, summary: true, formatDate: FORMAT_FULL_DATE_TIME },
        { field: fields.notifyId, serverField: 'notify_id', label: 'Notify ID', sortable: true, visible: false, summary: false },
        { field: fields.controller, serverField: 'controller', label: 'Controller', sortable: true, visible: false, summary: false }
    ]
)

export const showAlertReceiverKeys = () => (
    [   
        { field: fields.region, serverField: 'Region', label: 'Region', visible: false, filter:true },
        { field: fields.alertname, serverField: 'Name', label: 'Receiver Name', sortable: true, visible: true, filter: true },
        { field: fields.severity, serverField: 'Severity', label: 'Severity', sortable: true, visible: true, filter: true },
        { field: fields.username, serverField: 'User', label: 'Username', sortable: true, visible: true, filter: true },
        { field: fields.type, serverField: 'Type', label: 'Type', sortable: true, visible: false, filter: true },
        { field: fields.email, serverField: 'Email', label: 'Email', sortable: true, visible: false, filter: true },
        { field: fields.slackchannel, serverField: 'SlackChannel', label: 'Slack Channel', sortable: true, visible: false, filter: true },
        { field: fields.receiverAddress, label: 'Receiver Address', sortable: true, visible: true, filter: true, detailView: false },
        { field: fields.slackwebhook, serverField: 'SlackWebhook', label: 'Slack Webhook', sortable: true, visible: false },
        // { field: fields.alertname, serverField: 'Cloudlet', label: 'Alert Name', sortable: true, visible: true },
        { field: fields.appDeveloper, serverField: 'AppInst#OS#app_key#OS#organization', label: 'App Developer', sortable: true, visible: false },
        { field: fields.appName, serverField: 'AppInst#OS#app_key#OS#name', label: 'App Instance', sortable: true, visible: false },
        { field: fields.version, serverField: 'AppInst#OS#app_key#OS#version', label: 'Version', sortable: true, visible: false },
        { field: fields.clusterName, serverField: 'AppInst#OS#cluster_inst_key#OS#cluster_key#OS#name', label: 'Cluster', sortable: true, visible: false },
        { field: fields.clusterdeveloper, serverField: 'AppInst#OS#cluster_inst_key#OS#organization', label: 'Cluster Developer', sortable: true, visible: false },
        { field: fields.appOperator, serverField: 'AppInst#OS#cluster_inst_key#OS#cloudlet_key#OS#organization', label: 'Operator', sortable: true, visible: false },
        { field: fields.appCloudlet, serverField: 'AppInst#OS#cluster_inst_key#OS#cloudlet_key#OS#name', label: 'Cloudlet', sortable: true, visible: false },
        { field: fields.operatorName, serverField: 'Cloudlet#OS#organization', label: 'Operator', sortable: true, visible: false },
        { field: fields.cloudletName, serverField: 'Cloudlet#OS#name', label: 'Cloudlet', sortable: true, visible: false },
        { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
    ]
)

const cloudletSelector = (data) => {
    let clouldet_key = {}
    if (data[fields.operatorName] || data[fields.cloudletName]) {
        if (data[fields.cloudletName]) {
            clouldet_key.name = data[fields.cloudletName]
        }
        if (data[fields.operatorName]) {
            clouldet_key.organization = data[fields.operatorName]
        }
    }
    return clouldet_key
}

const clusterInstSelector = (data) => {
    let requestData = {}
    if (data[fields.clusterName]) {
        let cluster_key = { name: data[fields.clusterName] }
        requestData.cluster_key = cluster_key
    }
    if (data[fields.operatorName] || data[fields.cloudletName]) {
        requestData.cloudlet_key = cloudletSelector(data)
    }
    requestData.organization = data[fields.clusterdeveloper] ?  data[fields.clusterdeveloper] : data[fields.organizationName]
    return requestData
}

const selector = (data) => {
    let requestData = {}
    if (data[fields.appName] || data[fields.version] || data[fields.organizationName]) {
        let app_key = {}
        app_key.organization = data[fields.organizationName]
        if (data[fields.appName]) {
            app_key.name = data[fields.appName]
        }
        if (data[fields.version]) {
            app_key.version = data[fields.version]
        }
        requestData.app_key = app_key
    }
    if (data[fields.clusterName] || data[fields.cloudletName] || data[fields.operatorName]) {
        requestData.cluster_inst_key = clusterInstSelector(data)
    }
    return requestData
}

const getKey = (data, isDelete) => {
    let alert = {}
    alert = {
        name: data[fields.alertname],
        type: data[fields.type].toLowerCase(),
        severity: data[fields.severity].toLowerCase()
    }
    if(data[fields.region])
    {
        alert['region'] = data[fields.region] 
    }
    if(data[fields.username])
    {
        alert['user'] = data[fields.username]
    }
    if (data[fields.type] === RECEIVER_TYPE_SLACK) {
        alert['slackchannel'] = data[fields.slackchannel]
        alert['slackwebhook'] = data[fields.slackwebhook]
    }
    else if (data[fields.type] === RECEIVER_TYPE_EMAIL) {
        alert['email'] = data[fields.email]
    }


    if (isDelete) {
        let temp = {}
        if (data[fields.operatorName] || data[fields.cloudletName]) {
            alert['Cloudlet'] = cloudletSelector(data)
        }
        else {
            temp[fields.organizationName] = data[fields.appDeveloper]
            temp[fields.appName] = data[fields.appName]
            temp[fields.version] = data[fields.version]
            temp[fields.operatorName] = data[fields.appOperator]
            temp[fields.cloudletName] = data[fields.appCloudlet]
            temp[fields.clusterName] = data[fields.clusterName]
            temp[fields.clusterdeveloper] = data[fields.clusterdeveloper]
            alert['appinst'] = selector(temp)
        }
    }
    else {
        if (data[fields.selector] === 'Cloudlet') {
            alert['Cloudlet'] = cloudletSelector(data)
        }
        else if (data[fields.selector] === 'Cluster') {
            alert['appinst'] = {}
            alert['appinst']['cluster_inst_key'] = clusterInstSelector(data)
        }
        else {
            alert['appinst'] = selector(data)
        }
    }
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
    let requestData = getKey(data, true)
    return { method: ALERT_DELETE_RECEIVER, data: requestData, success: `Alert Receiver ${data[fields.alertname]} deleted successfully` }
}

export const showAlerts = (data) => {
    return { method: SHOW_ALERT, data: data, keys: showAlertKeys() }
}





const customData = (value) => {
    value[fields.receiverAddress] = value[fields.type] === 'email' ? value[fields.email] : value[fields.slackchannel]
    value[fields.receiverAddress] = value[fields.type] + '#OS#' + value[fields.receiverAddress]
    return value
}

export const getData = (response, body) => {
    return formatter.formatAlertData(response, body, showAlertReceiverKeys(), customData)
}
