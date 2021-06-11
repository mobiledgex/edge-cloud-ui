import { toJson } from '../../utils/json_util'
import isEqual from 'lodash/isEqual';
import uuid from 'uuid'

export const fields = {
    uuid: 'uuid',
    region: 'region',
    clusterName: 'clusterName',
    cloudlet_name_operator: 'cloudlet_name_operator',
    realclustername: 'realclustername',
    organizationName: 'organizationName',
    org: 'org',
    billingOrgName: 'billingOrgName',
    operatorName: 'operatorName',
    cloudletName: 'cloudletName',
    flavorName: 'flavorName',
    ipAccess: 'ipAccess',
    nodeFlavor: 'nodeFlavor',
    numberOfMasters: 'numberOfMasters',
    numberOfNodes: 'numberOfNodes',
    sharedVolumeSize: 'sharedVolumeSize',
    autoClusterInstance: 'autoClusterInstance',
    state: 'state',
    status: 'status',
    reservable: 'reservable',
    reservedBy: 'reservedBy',
    resources: 'resources',
    deployment: 'deployment',
    cloudletLocation: 'cloudletLocation',
    latitude: 'latitude',
    longitude: 'longitude',
    ipSupport: 'ipSupport',
    numDynamicIPs: 'numDynamicIPs',
    physicalName: 'physicalName',
    platformType: 'platformType',
    vmPool:'vmPool',
    type: 'type',
    firstName: 'firstName',
    lastName: 'lastName',
    name: 'name',
    alertThreshold: 'alertThreshold',
    resourceValue: 'resourceValue',
    resourceName: 'resourceName',
    address: 'address',
    phone: 'phone',
    country: 'country',
    city: 'city',
    postalCode: 'postalCode',
    children: 'children',
    trustPolicyName: 'trustPolicyName',
    outboundSecurityRules: 'outboundSecurityRules',
    outboundSecurityRuleMulti: 'outboundSecurityRuleMulti',
    protocol: 'protocol',
    portRangeMin: 'portRangeMin',
    portRangeMax: 'portRangeMax',
    remoteIP: 'remoteIP',
    remoteCIDR: 'remoteCIDR',
    autoPolicyName: 'autoPolicyName',
    deployClientCount: 'deployClientCount',
    deployIntervalCount: 'deployIntervalCount',
    undeployClientCount: 'undeployClientCount',
    undeployIntervalCount: 'undeployIntervalCount',
    cloudlets: 'cloudlets',
    organizations: 'organizations',
    appName: 'appName',
    app_name_version : 'appnameversion',
    version: 'version',
    uri: 'uri',
    liveness: 'liveness',
    mappedPorts: 'mappedPorts',
    errors: 'errors',
    runtimeInfo: 'runtimeInfo',
    createdAt: 'createdAt',
    seconds: 'seconds',
    updatedAt: 'updatedAt',
    revision: 'revision',
    ram: 'ram',
    vCPUs: 'vCPUs',
    disk: 'disk',
    gpu: 'gpu',
    notifyId: 'notifyId',
    controller: 'controller',
    osMaxRam: 'osMaxRam',
    osMaxVCores: 'osMaxVCores',
    osMaxVolGB: 'osMaxVolGB',
    flavors: 'flavors',
    command: 'command',
    deploymentManifest: 'deploymentManifest',
    imageType: 'imageType',
    imagePath: 'imagePath',
    defaultFlavorName: 'defaultFlavorName',
    defaultTrustPolicy: 'defaultTrustPolicy',
    ports: 'ports',
    authPublicKey: 'authPublicKey',
    scaleWithCluster: 'scaleWithCluster',
    officialFQDN: 'officialFQDN',
    androidPackageName: 'androidPackageName',
    deploymentGenerator: 'deploymentGenerator',
    accessPorts: 'accessPorts',
    accessType: 'accessType',
    username: 'username',
    startdate: 'statedate',
    nextDate:'nextDate',
    timezone:'timezone',
    password: 'password',
    confirmPassword: 'confirmPassword',
    role: 'role',
    email: 'email',
    schedule:'schedule',
    emailVerified: 'emailVerified',
    passHash: 'passHash',
    iter: 'iter',
    familyName: 'familyName',
    givenName: 'givenName',
    picture: 'picture',
    nickName: 'nickName',
    locked: 'locked',
    outboundSecurityRulesCount: 'outboundSecurityRulesCount',
    cloudletCount: 'cloudletCount',
    organizationCount: 'organizationCount',
    fullIsolation: 'fullIsolation',
    cloudletStatus: 'cloudletStatus',
    actions: 'actions',
    manage: 'manage',
    poolName: 'poolName',
    operatorOrg: 'operatorOrg',
    developerOrg: 'developerOrg',
    invite: 'invite',
    confirm: 'confirm',
    decision:'decision',
    grant: 'grant',
    clusterinst: 'clusterinst',
    container_ids: 'container_ids',
    openRCData: 'openRCData',
    caCertdata: 'caCertdata',
    clusterdeveloper: 'clusterdeveloper',
    appDeveloper: 'appDeveloper',
    containerVersion: 'containerVersion',
    vmImageVersion: 'vmImageVersion',
    configs: 'configs',
    configmulti: 'configmulti',
    config: 'config',
    kind: 'kind',
    ocPort: 'ocPort',
    ocRemoteIP: 'ocRemoteIP',
    ocProtocol: 'ocProtocol',
    annotations: 'annotations',
    annotationmulti: 'annotationmulti',
    requiredOutboundConnections: 'requiredOutboundConnections',
    requiredOutboundConnectionmulti: 'requiredOutboundConnectionsmulti',
    key: 'key',
    value: 'value',
    publicImages: 'publicImages',
    updateAvailable: 'updateAvailable',
    update: 'update',
    appInstances: 'appInstances',
    upgrade: 'upgrade',
    refreshAppInst: 'refreshAppInst',
    restagmap: 'restagmap',
    powerState: 'powerState',
    tls: 'tls',
    edgeboxOnly: 'edgeboxOnly',
    userList: 'userList',
    infraApiAccess: 'infraApiAccess',
    infraFlavorName: 'infraFlavorName',
    infraExternalNetworkName: 'infraExternalNetworkName',
    maintenanceState: 'maintenanceState',
    manifest: 'manifest',
    userRole: 'userRole',
    healthCheck: 'healthCheck',
    skipHCPorts: 'skipHCPorts',
    templateDelimiter: 'templateDelimiter',
    autoScalePolicyName: 'autoScalePolicyName',
    minimumNodes: 'minimumNodes',
    maximumNodes: 'maximumNodes',
    scaleUpCPUThreshold: 'scaleUpCPUThreshold',
    scaleDownCPUThreshold: 'scaleDownCPUThreshold',
    triggerTime: 'triggerTime',
    minActiveInstances: 'minActiveInstances',
    maxInstances: 'maxInstances',
    fields: 'fields',
    envVars: 'envVars',
    apps: 'apps',
    eventType: 'eventType',
    resourceQuotas: 'resourceQuotas',
    defaultResourceAlertThreshold: 'defaultResourceAlertThreshold',
    time: 'time',
    starttime: 'starttime',
    endtime: 'endtime',
    selector: 'selector',
    isAdmin: 'isAdmin',
    metric: 'metric',
    location: 'location',
    values: 'values',
    columns: 'columns',
    labels: 'labels',
    job: 'job',
    instance: 'instance',
    activeAt: 'activeAt',
    alertname: 'alertname',
    envoyclustername: 'envoyclustername',
    slackchannel: 'slackchannel',
    pagerDutyIntegrationKey: 'pagerDutyIntegrationKey',
    pagerDutyApiVersion: 'pagerDutyApiVersion',
    slackwebhook: 'slackwebhook',
    severity: 'severity',
    slack: 'slack',
    pagerDuty: 'pagerDuty',
    appCloudlet: 'appCloudlet',
    appOperator: 'appOperator',
    receiverAddress: 'receiverAddress',
    otp: 'otp',
    port: 'port',
    appRevision: 'appRevision',
    autoProvPolicies: 'autoProvPolicies',
    title: 'title',
    description: 'description',
    trusted: 'trusted',
    compatibilityVersion: 'compatibilityVersion',
    kafkaCluster: 'kafkaCluster',
    kafkaUser: 'kafkaUser',
    kafkaPassword: 'kafkaPassword',
    vmappostype:'vmappostype'
}

const mapObject = (currentObject, serverField) => {
    if (currentObject && serverField) {
        let fields = serverField.split('#OS#');
        let length = fields.length;
        for (let i = 0; i < length - 1; i++) {
            currentObject = currentObject[fields[i]] ? currentObject[fields[i]] : {}
        }
        return currentObject[fields[length - 1]]
    }
}

const map = (value, currentObject, keys) => {
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (key && key.serverField) {
            if (key.keys) {
                let childArray = []
                let data = currentObject[key.serverField];
                if (data && data.length > 0) {
                    for (let j = 0; j < data.length; j++) {
                        let childValue = {}
                        map(childValue, data[j], key.keys)
                        childArray.push(childValue)
                    }
                }
                value[key.field] = childArray;
            }
            else {
                let updatedData = mapObject(currentObject, key.serverField);
                if (updatedData) {
                    if (typeof updatedData === 'boolean') {
                        value[key.field] = updatedData
                    }
                    else {
                        value[key.field] = updatedData ? updatedData : key.defaultValue
                    }
                }
            }
        }
    }
    return value
}

export const generateUUID = (keys, data) => {
    let key = ''
    keys.map(item => {
        if (item.key) {
            key = key + data[item.field]
        }
    })
    return key
}

export const formatData = (response, body, keys, customData, isUnique) => {
    let values = [];
    try {
        if (response.data) {
            let jsonData = toJson(response.data);
            if (jsonData && jsonData.length > 0) {
                for (let i = 0; i < jsonData.length; i++) {
                    let data = jsonData[i].data ? jsonData[i].data : jsonData[i];
                    let value = {}
                    map(value, data, keys)
                    if (body && value.region === undefined) { value.region = body.region }
                    value.uuid = (isUnique) ? generateUUID(keys, value) : uuid()
                    let newValue = customData ? customData(value, body) : value
                    if (newValue) {
                        values.push(newValue)
                    }
                }
            }
        }
    }
    catch (e) {
        console.log('Response Error', e)
    }
    return values
}

export const formatChargifyData = (response, body, keys, customData) => {
    let values = [];
    try {
        if (response.data) {
            let invoices = response.data
            if (invoices) {
                for (let data of invoices) {
                    let value = {}
                    map(value, data, keys)
                    let newValue = customData ? customData(value) : value
                    if (newValue) {
                        values.push(newValue)
                    }
                }
            }
            else {
                let data = response.data
                let value = {}
                map(value, data, keys)
                let newValue = customData ? customData(value) : value
                if (newValue) {
                    values.push(newValue)
                }
            }
        }
    }
    catch (e) {
        console.log('Response Error', e)
    }
    return values
}

export const formatAlertData = (response, body, keys, customData, isUnique) => {
    let values = [];
    try {
        if (response.data) {
            let jsonData = response.data
            for (let i = 0; i < jsonData.length; i++) {
                let data = jsonData[i].data ? jsonData[i].data : jsonData[i];
                let value = {}
                map(value, data, keys)
                value.uuid = (isUnique) ? generateUUID(keys, value) : uuid()
                let newValue = customData ? customData(value) : value
                if (newValue) {
                    values.push(newValue)
                }
            }
        }
    }
    catch (e) {
        console.log('Response Error', e)
    }
    return values
}

export const colorType = (value) => {
    switch (value) {
        case 'UP':
            return '#66BB6A'
        case 'DOWN':
            return '#EF5350'
        case 'RESERVED':
            return '#66BB6A'
        case 'UNRESERVED':
            return '#FF7043'
        case 'DELETED':
            return '#EF5350'
        default:
            return undefined
    }
}

export const formatColumns = (columns, keys) => {
    columns.splice(1, 0, 'region');
    let newColumns = []
    keys.map(key => {
        newColumns[columns.indexOf(key.serverField)] = key
    })
    return newColumns
}

export const groupByCompare = (dataList, columns, region) => {
    let keys = []
    columns.map((item, i) => {
        if (item.groupBy) {
            keys.push(i)
        }
    })
    return dataList.reduce((accumulator, x) => {
        x.splice(1, 0, region);
        let key = ''
        for (let i = 0; i < keys.length; i++) {
            key = key + x[keys[i]]
            if (i < keys.length - 1) {
                key = key + '_'
            }
        }
        key = key.toLowerCase()
        if (!accumulator[key]) {
            accumulator[key] = [];
        }
        accumulator[key].push(x);
        return accumulator;
    }, {})
}

export const formatUsageData = (response, body, keys) => {
    let formattedData = []
    try {
        if (response && response.data && response.data.data) {
            let dataList = response.data.data;
            if (dataList && dataList.length > 0) {
                let series = dataList[0].Series
                let messages = dataList[0].messages
                if (series && series.length > 0) {
                    series.map(data => {
                        let columns = data.columns
                        let values = data.values
                        for (let value of values) {
                            if (value.includes('MEXPrometheusAppName')) {
                                continue;
                            }
                            let data = {}
                            columns.map((column, i) => {
                                data[column] = value[i]
                            })
                            formattedData.push(data)
                        }
                    })
                }
            }
        }
    }
    catch (e) {
        //alert(e)
    }
    return formattedData
}

/**
 * Use this method if the data specific to org 
 */
export const formatEventData = (response, body, keys) => {
    let formattedData = []
    try {
        if (response && response.data && response.data.data) {
            let dataList = response.data.data;
            if (dataList && dataList.length > 0) {
                let series = dataList[0].Series
                let messages = dataList[0].messages
                if (series && series.length > 0) {
                    for(let data of series)
                    {
                        let formatted = {}
                        let formattingData = {}
                        let key = data.name
                        if(key === 'clusterinst-checkpoints')
                        {
                            continue
                        }
                        formattingData.columns = formatColumns(data.columns, keys)
                        formattingData.values = groupByCompare(data.values, formattingData.columns, body.region)
                        formatted[key] = formattingData
                        formattedData.push(formatted)
                    }

                }
            }
        }
    }
    catch (e) {
        //alert(e)
    }
    return formattedData
}

export const compareObjects = (newData, oldData, ignoreCase) => {
    if ((newData === undefined || newData.length === 0) && (oldData === undefined || oldData.length === 0)) {
        return true
    }
    else if (newData !== undefined && newData.length > 0 && oldData === undefined) {
        return false
    }
    else if (newData === undefined && oldData !== undefined && oldData.length > 0) {
        return false
    }
    else if (ignoreCase) {
        return isEqual(newData.toLowerCase(), oldData.toLowerCase())
    }
    else {
        return isEqual(newData, oldData)
    }
}

export const updateFieldData = (self, forms, data, orgData) => {
    let updateData = {}
    let updateFields = []
    for (let i = 0; i < forms.length; i++) {
        let form = forms[i]
        if (form.update) {
            let update = form.update
            if (update.key) {
                updateData[form.field] = data[form.field]
            }
            else if (update.id) {
                let updateId = update.id
                let ignoreCase = update.ignoreCase ? update.ignoreCase : false
                if (!compareObjects(data[form.field], orgData[form.field], ignoreCase)) {
                    updateData[form.field] = data[form.field]
                    updateFields = [...updateFields, ...updateId]
                }
            }
        }
    }
    if (updateFields.length === 0) {
        self.props.handleAlertInfo('error', 'Nothing to update')
    }
    updateData.fields = updateFields
    return updateData
}