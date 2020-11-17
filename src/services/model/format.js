import uuid from 'uuid'
import { toJson } from '../../utils/json_util'
import isEqual from 'lodash/isEqual';

export const fields = {
    uuid: 'uuid',
    region: 'region',
    clusterName: 'clusterName',
    organizationName: 'organizationName',
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
    deployment: 'deployment',
    cloudletLocation: 'cloudletLocation',
    latitude: 'latitude',
    longitude: 'longitude',
    ipSupport: 'ipSupport',
    numDynamicIPs: 'numDynamicIPs',
    physicalName: 'physicalName',
    platformType: 'platformType',
    type: 'type',
    address: 'address',
    phone: 'phone',
    privacyPolicyName: 'privacyPolicyName',
    outboundSecurityRules: 'outboundSecurityRules',
    protocol: 'protocol',
    portRangeMin: 'portRangeMin',
    portRangeMax: 'portRangeMax',
    remoteCIDR: 'remoteCIDR',
    autoPolicyName: 'autoPolicyName',
    deployClientCount: 'deployClientCount',
    deployIntervalCount: 'deployIntervalCount',
    undeployClientCount: 'undeployClientCount',
    undeployIntervalCount: 'undeployIntervalCount',
    cloudlets: 'cloudlets',
    organizations: 'organizations',
    appName: 'appName',
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
    defaultPrivacyPolicy: 'defaultPrivacyPolicy',
    ports: 'ports',
    authPublicKey: 'authPublicKey',
    scaleWithCluster: 'scaleWithCluster',
    officialFQDN: 'officialFQDN',
    androidPackageName: 'androidPackageName',
    deploymentGenerator: 'deploymentGenerator',
    accessPorts: 'accessPorts',
    accessType: 'accessType',
    username: 'username',
    password: 'password',
    confirmPassword: 'confirmPassword',
    role: 'role',
    email: 'email',
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
    clusterinst: 'clusterinst',
    container_ids: 'container_ids',
    openRCData: 'openRCData',
    caCertdata: 'caCertdata',
    clusterdeveloper: 'clusterdeveloper',
    appDeveloper: 'appDeveloper',
    containerVersion: 'containerVersion',
    vmImageVersion: 'vmImageVersion',
    configs: 'configs',
    config: 'config',
    kind: 'kind',
    annotations: 'annotations',
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
    time: 'time',
    starttime: 'starttime',
    endtime: 'endtime',
    selector: 'selector',
    metric: 'metric',
    location: 'location',
    values: 'values',
    columns: 'columns',
    labels:'labels',
    job:'job',
    instance:'instance',
    activeAt:'activeAt',
    alertname:'alertname',
    envoyclustername:'envoyclustername',
    slackchannel:'slackchannel',
    slackwebhook:'slackwebhook',
    severity:'severity',
    slack:'slack',
    appCloudlet:'appCloudlet',
    appOperator:'appOperator',
    receiverAddress:'receiverAddress',
    otp:'otp'
}

export const getUserRole = () => {
    return localStorage.selectRole
}

export const isAdmin = () => {
    return localStorage.selectRole && localStorage.selectRole === 'AdminManager'
}

export const isViewer = () => {
    let role = getUserRole()
    return role && role.includes('Viewer')
}

export const getOrganization = () => {
    if (localStorage.selectOrg) {
        return localStorage.selectOrg
    }
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
                    if (isUnique) { value.uuid = uuid() }
                    if (body) { value.region = body.region }
                    let newValue = customData ? customData(value) : value
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

export const formatAlertData = (response, body, keys, customData, isUnique) => {
    let values = [];
    try {
        if (response.data) {
            let jsonData = response.data
            for (let i = 0; i < jsonData.length; i++) {
                let data = jsonData[i].data ? jsonData[i].data : jsonData[i];
                let value = {}
                map(value, data, keys)
                if (isUnique) { value.uuid = uuid() }
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
        if (!accumulator[key]) {
            accumulator[key] = [];
        }
        accumulator[key].push(x);
        return accumulator;
    }, {})
}

export const formatEventData = (response, body, keys) => {
    let formattedData = []
    try {
        if (response && response.data && response.data.data) {
            let dataList = response.data.data;
            if (dataList && dataList.length > 0) {
                let series = dataList[0].Series
                let messages = dataList[0].messages
                if (series && series.length > 0) {
                    formattedData = series.map(data => {
                        let formatted = {}
                        let formattingData = {}
                        let key = data.name
                        formattingData.columns = formatColumns(data.columns, keys)
                        formattingData.values = groupByCompare(data.values, formattingData.columns, body.region)
                        formatted[key] = formattingData
                        return formatted
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

export const updateFields = (self, forms, data, orgData) => {
    let updateFields = []
    for (let i = 0; i < forms.length; i++) {
        let form = forms[i]
        if (form.update && form.updateId) {
            if (!compareObjects(data[form.field], orgData[form.field])) {
                updateFields = [...updateFields, ...form.updateId]
            }
        }
    }
    if (updateFields.length === 0) {
        self.props.handleAlertInfo('error', 'Nothing to update')
    }
    return updateFields
}
