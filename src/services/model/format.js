import { generateUniqueId } from '../serviceMC';
import { toJson } from '../JsonUtil'

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
    autoClusterInstance:'autoClusterInstance',
    state: 'state',
    status: 'status',
    reservable: 'reservable',
    reservedBy:'reservedBy',
    deployment: 'deployment',
    cloudletLocation: 'cloudletLocation',
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
    cloudlets: 'cloudlets',
    organizations:'organizations',
    appName: 'appName',
    version: 'version',
    uri: 'uri',
    liveness: 'liveness',
    mappedPorts: 'mappedPorts',
    errors: 'errors',
    runtimeInfo: 'runtimeInfo',
    createdAt: 'createdAt',
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
    containerVersion: 'containerVersion',
    command: 'command',
    deploymentManifest: 'deploymentManifest',
    imageType: 'imageType',
    imagePath: 'imagePath',
    defaultFlavorName: 'defaultFlavorName',
    defaultPrivacyPolicy:'defaultPrivacyPolicy',
    ports: 'ports',
    authPublicKey: 'authPublicKey',
    scaleWithCluster: 'scaleWithCluster',
    officialFQDN: 'officialFQDN',
    androidPackageName: 'androidPackageName',
    accessPorts: 'accessPorts',
    deploymentGenerator: 'deploymentGenerator',
    accessPorts: 'accessPorts',
    accessType: 'accessType',
    username: 'username',
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
    organizationCount:'organizationCount',
    fullIsolation: 'fullIsolation',
    cloudletStatus: 'cloudletStatus',
    actions: 'actions',
    manage: 'manage',
    poolName:'poolName',
    clusterinst:'clusterinst'

}

export const getUserRole = () => {
    return localStorage.selectRole
}

export const isAdmin = () => {
    return localStorage.selectRole && localStorage.selectRole === 'AdminManager'
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
                if (typeof updatedData === 'boolean') {
                    value[key.field] = updatedData
                }
                else {
                    value[key.field] = updatedData ? updatedData : key.defaultValue
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
                    if (isUnique) { value.uuid = generateUniqueId() }
                    if (body) { value.region = body.region }
                    customData(value)
                    values.push(value)
                }
            }
        }
    }
    catch (e) {
        alert(e)
    }
    return values
}