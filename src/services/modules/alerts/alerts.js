
import * as formatter from '../../fields'
import { redux_org } from '../../../helper/reduxData'
import { perpetual } from '../../../helper/constant'
import { authSyncRequest } from '../../service'
import { endpoint } from '../..'

let localFields = formatter.localFields
export const showAlertKeys = () => (
    [
        { field: localFields.region, label: 'Region', serverField: 'labels#OS#region', sortable: true, visible: true },
        { field: localFields.alertname, serverField: 'labels#OS#alertname', label: 'Alert Name', sortable: true, visible: true, filter: true },
        { field: localFields.description, serverField: 'annotations#OS#description', label: 'Description', sortable: true, visible: true, summary: true },
        { field: localFields.title, serverField: 'annotations#OS#title', label: 'Receiver Name', sortable: true, visible: true, filter: true },
        { field: localFields.appName, serverField: 'labels#OS#app', label: 'App Instance', sortable: true, visible: true, summary: true, format: true, filter: true },
        { field: localFields.appDeveloper, serverField: 'labels#OS#apporg', label: 'App Developer', sortable: true, visible: false, filter: true },
        { field: localFields.version, serverField: 'labels#OS#appver', label: 'App Version', sortable: true, visible: false, summary: false },
        { field: localFields.cloudletName, serverField: 'labels#OS#cloudlet', label: 'Cloudlet', sortable: true, visible: false, summary: true, format: true, filter: true },
        { field: localFields.operatorName, serverField: 'labels#OS#cloudletorg', label: 'Operator', sortable: true, visible: false, filter: true },
        { field: localFields.clusterName, serverField: 'labels#OS#cluster', label: 'Cluster', sortable: true, visible: false, summary: true, format: true, filter: true },
        { field: localFields.clusterdeveloper, serverField: 'labels#OS#clusterorg', label: 'Cluster Developer', sortable: true, visible: false, filter: true },
        { field: localFields.envoyclustername, serverField: 'labels#OS#envoy_cluster_name', label: 'Envoy Cluster', sortable: true, visible: false, summary: true },
        { field: localFields.instance, serverField: 'labels#OS#instance', label: 'Instance', sortable: true, visible: false, summary: true },
        { field: localFields.job, serverField: 'labels#OS#job', label: 'Job', sortable: true, visible: false, summary: true },
        { field: localFields.port, serverField: 'labels#OS#port', label: 'Port', sortable: true, visible: false, summary: true },
        { field: localFields.status, serverField: 'labels#OS#status', label: 'Status', sortable: true, visible: false, summary: true, format: true },
        { field: localFields.state, serverField: 'state', label: 'State', sortable: true, visible: false, summary: false },
        { field: localFields.activeAt, serverField: 'active_at#OS#seconds', label: 'Active At', sortable: true, visible: false, format: true },
        { field: localFields.notifyId, serverField: 'notify_id', label: 'Notify ID', sortable: true, visible: false, summary: false },
        { field: localFields.controller, serverField: 'controller', label: 'Controller', sortable: true, visible: false, summary: false }
    ]
)

export const showAlertReceiverKeys = () => (
    [
        { field: localFields.region, serverField: 'Region', label: 'Region', visible: false, filter: true },
        { field: localFields.alertname, serverField: 'Name', label: 'Receiver Name', sortable: true, visible: true, filter: true },
        { field: localFields.severity, serverField: 'Severity', label: 'Severity', sortable: true, visible: true, filter: true, format: true },
        { field: localFields.username, serverField: 'User', label: 'Username', sortable: true, visible: true, filter: true },
        { field: localFields.type, serverField: 'Type', label: 'Type', sortable: true, visible: false, filter: true },
        { field: localFields.email, serverField: 'Email', label: 'Email', sortable: true, visible: false, filter: true },
        { field: localFields.pagerDutyIntegrationKey, serverField: 'PagerDutyIntegrationKey', label: 'PagerDuty Integration Key', sortable: false, visible: false, filter: true },
        { field: localFields.pagerDutyApiVersion, serverField: 'PagerDutyApiVersion', label: 'PagerDuty API Version', sortable: false, visible: false, filter: true },
        { field: localFields.slackchannel, serverField: 'SlackChannel', label: 'Slack Channel', sortable: true, visible: false, filter: true },
        { field: localFields.receiverAddress, label: 'Receiver Address', sortable: true, visible: true, filter: true, detailView: false, format: true },
        { field: localFields.slackwebhook, serverField: 'SlackWebhook', label: 'Slack Webhook', sortable: true, visible: false },
        // { field: localFields.alertname, serverField: 'Cloudlet', label: 'Alert Name', sortable: true, visible: true },
        { field: localFields.appDeveloper, serverField: 'AppInst#OS#app_key#OS#organization', label: 'App Developer', sortable: true, visible: false },
        { field: localFields.appName, serverField: 'AppInst#OS#app_key#OS#name', label: 'App Instance', sortable: true, visible: false },
        { field: localFields.version, serverField: 'AppInst#OS#app_key#OS#version', label: 'Version', sortable: true, visible: false },
        { field: localFields.clusterName, serverField: 'AppInst#OS#cluster_inst_key#OS#cluster_key#OS#name', label: 'Cluster', sortable: true, visible: false },
        { field: localFields.clusterdeveloper, serverField: 'AppInst#OS#cluster_inst_key#OS#organization', label: 'Cluster Developer', sortable: true, visible: false },
        { field: localFields.appOperator, serverField: 'AppInst#OS#cluster_inst_key#OS#cloudlet_key#OS#organization', label: 'Operator', sortable: true, visible: false },
        { field: localFields.appCloudlet, serverField: 'AppInst#OS#cluster_inst_key#OS#cloudlet_key#OS#name', label: 'Cloudlet', sortable: true, visible: false },
        { field: localFields.operatorName, serverField: 'Cloudlet#OS#organization', label: 'Operator', sortable: true, visible: false },
        { field: localFields.cloudletName, serverField: 'Cloudlet#OS#name', label: 'Cloudlet', sortable: true, visible: false }
    ]
)

const cloudletSelector = (data) => {
    let cloudlet_key = {}
    if (data[localFields.operatorName] || data[localFields.cloudletName]) {
        if (data[localFields.cloudletName]) {
            cloudlet_key.name = data[localFields.cloudletName]
        }
        if (data[localFields.operatorName]) {
            cloudlet_key.organization = data[localFields.operatorName]
        }
    }
    return cloudlet_key
}

const clusterInstSelector = (data) => {
    let requestData = {}
    if (data[localFields.clusterName]) {
        let cluster_key = { name: data[localFields.clusterName] }
        requestData.cluster_key = cluster_key
    }
    if (data[localFields.operatorName] || data[localFields.cloudletName]) {
        requestData.cloudlet_key = cloudletSelector(data)
    }
    requestData.organization = data[localFields.clusterdeveloper] ? data[localFields.clusterdeveloper] : data[localFields.organizationName]
    return requestData
}

const selector = (data) => {
    let requestData = {}
    if (data[localFields.appName] || data[localFields.version] || data[localFields.organizationName]) {
        let app_key = {}
        app_key.organization = data[localFields.organizationName]
        if (data[localFields.appName]) {
            app_key.name = data[localFields.appName]
        }
        if (data[localFields.version]) {
            app_key.version = data[localFields.version]
        }
        requestData.app_key = app_key
    }
    if (data[localFields.clusterName] || data[localFields.cloudletName] || data[localFields.operatorName] || data[localFields.clusterdeveloper]) {
        requestData.cluster_inst_key = clusterInstSelector(data)
    }
    return requestData
}

const getKey = (data, isDelete) => {
    let alert = {}
    alert = {
        name: data[localFields.alertname],
        type: data[localFields.type].split(" ").join("").toLowerCase(),
        severity: data[localFields.severity]
    }

    if (data[localFields.region]) {
        alert['region'] = data[localFields.region]
    }
    if (data[localFields.username]) {
        alert['user'] = data[localFields.username]
    }
    if (data[localFields.type] === perpetual.RECEIVER_TYPE_SLACK) {
        alert['slackchannel'] = data[localFields.slackchannel]
        alert['slackwebhook'] = data[localFields.slackwebhook]
    }
    else if (data[localFields.type] === perpetual.RECEIVER_TYPE_EMAIL) {
        alert['email'] = data[localFields.email]
    }
    else if (data[localFields.type] === perpetual.RECEIVER_TYPE_PAGER_DUTY) {
        alert['pagerdutyintegrationkey'] = data[localFields.pagerDutyIntegrationKey]
    }


    if (isDelete) {
        let temp = {}
        if (data[localFields.operatorName] || data[localFields.cloudletName]) {
            alert['Cloudlet'] = cloudletSelector(data)
        }
        else {
            temp[localFields.organizationName] = data[localFields.appDeveloper]
            temp[localFields.appName] = data[localFields.appName]
            temp[localFields.version] = data[localFields.version]
            temp[localFields.operatorName] = data[localFields.appOperator]
            temp[localFields.cloudletName] = data[localFields.appCloudlet]
            temp[localFields.clusterName] = data[localFields.clusterName]
            temp[localFields.clusterdeveloper] = data[localFields.clusterdeveloper]
            alert['appinst'] = selector(temp)
        }
    }
    else {
        if (data[localFields.selector] === 'Cloudlet') {
            alert['Cloudlet'] = cloudletSelector(data)
        }
        else if (data[localFields.selector] === 'Cluster') {
            alert['appinst'] = {}
            alert['appinst']['cluster_inst_key'] = clusterInstSelector(data)
        }
        else {
            alert['appinst'] = selector(data)
        }
    }
    return alert
}


export const showAlertReceiver = (self, data) => {
    return { method: endpoint.ALERT_SHOW_RECEIVER, data: data, keys: showAlertReceiverKeys() }
}

export const createAlertReceiver = async (self, data) => {
    let requestData = getKey(data)
    let request = { method: endpoint.ALERT_CREATE_RECEIVER, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteAlertReceiver = (self, data) => {
    let requestData = getKey(data, true)
    return { method: endpoint.ALERT_DELETE_RECEIVER, data: requestData, success: `Alert Receiver ${data[localFields.alertname]} deleted successfully` }
}

export const showAlerts = (self, data) => {
    let orgName = redux_org.nonAdminOrg(self)
    if (orgName) {
        if (redux_org.isDeveloper(self)) {
            let labels = {}
            labels.apporg = orgName
            data.alert = { labels }
        }
        else if (redux_org.isOperator(self)) {
            let labels = {}
            labels.cloudletorg = orgName
            data.alert = { labels }
        }

    }

    return { method: endpoint.SHOW_ALERT, data: data, keys: showAlertKeys() }
}
