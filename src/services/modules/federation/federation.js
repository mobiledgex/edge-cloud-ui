
import * as formatter from '../../model/format'
import { authSyncRequest, responseValid } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'
import { unionBy } from 'lodash';

let fields = formatter.fields

const federationKeys = () => ([
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationId, serverField: 'selffederationid', label: 'Federation ID' },
    { field: fields.partnerFederationName, serverField: 'name', label: 'Federation Name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.partnerOperatorName, serverField: 'operatorid', label: 'Partner Operator', visible: true, filter: true, key: true },
    { field: fields.partnerCountryCode, serverField: 'countrycode', label: 'Partner Country Code', visible: true, filter: true, key: true },
    { field: fields.partnerFederationId, serverField: 'federationid', label: 'Partner Federation ID' },
    { field: fields.partnerFederationAddr, serverField: 'federationaddr', label: 'Federation Address' },
    { field: fields.partnerAPIKey, serverField: 'apikey', label: 'Api Key' },
    { field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets', key: true, dataType: perpetual.TYPE_ARRAY },
    { field: fields.partnerRoleShareZoneWithSelf, label: 'Partner Share Zone', serverField: 'PartnerRoleShareZonesWithSelf' },
    { field: fields.partnerRoleAccessToSelfZones, label: 'Partner Registered', serverField: 'PartnerRoleAccessToSelfZones' },
])

const federatorKeys = () => ([
    { field: fields.region, label: 'Region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, label: 'Operator', serverField: 'operatorid', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationId, label: 'Federation', serverField: 'federationid', sortable: true, filter: true, key: true },
    { field: fields.federationAddr, serverField: 'federationaddr', label: 'Federation Address' },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true },
    { field: fields.mcc, label: 'MCC', serverField: 'mcc', sortable: true, filter: true, key: true },
    { field: fields.mnc, label: 'MNC', serverField: 'mnc', sortable: true, filter: true, key: true, dataType: perpetual.TYPE_ARRAY }
])

export const keys = (host = false) => {
    let unionKeys = unionBy(federatorKeys(), federationKeys(), 'field');
    unionKeys.push({ field: fields.zoneCount, label: `Zones ${host ? 'Shared' : 'Received'}`, sortable: true, visible: true, filter: true, key: true, detailView: false })
    unionKeys.push({
        field: fields.zones, label: `Zones ${host ? 'Shared' : 'Received'}`,
        keys: [
            { field: fields.zoneId, label: 'Zone' },
            { field: fields.registered, label: 'Registered' }
        ]
    })
    return unionKeys
}

export const iconKeys = (host = false) => ([
    { field: host ? fields.partnerRoleAccessToSelfZones : fields.partnerRoleShareZoneWithSelf, label: 'Registered', icon: 'bookmark_added', count: 0}
])

export const multiDataRequest = (keys, mcList) => {
    let federatorList = [], federationList = [], zoneList = [], isShared = false;
    for (let i = 0; i < mcList.length; i++) {
        let mc = mcList[i];
        let request = mc.request;
        let data = mc.response.data
        if (request.method === endpoint.SHOW_FEDERATION) {
            federationList = data
        }
        else if (request.method === endpoint.SHOW_FEDERATOR) {
            federatorList = data
        }
        else if (request.method === endpoint.SHOW_FEDERATION_SELF_ZONE) {
            isShared = true
            zoneList = data
        }
        else if (request.method === endpoint.SHOW_FEDERATOR_PARTNER_ZONE) {
            zoneList = data
        }
    }
    
    if (federatorList && federatorList.length > 0) {
        for (let federator of federatorList) {
            for (let federation of federationList) {
                if (federator[fields.federationId] === federation[fields.federationId]) {
                    federator[fields.partnerOperatorName] = federation[fields.partnerOperatorName]
                    federator[fields.partnerCountryCode] = federation[fields.partnerCountryCode]
                    federator[fields.partnerFederationName] = federation[fields.partnerFederationName]
                    federator[fields.partnerFederationId] = federation[fields.partnerFederationId]
                    federator[fields.partnerRoleShareZoneWithSelf] = federation[fields.partnerRoleShareZoneWithSelf]
                    federator[fields.partnerRoleAccessToSelfZones] = federation[fields.partnerRoleAccessToSelfZones]
                    federator[fields.partnerFederationAddr] = federation[fields.partnerFederationAddr]
                    break;
                }
            }
            federator[fields.zones] = []
            for (let zone of zoneList) {
                if (federator[fields.partnerFederationName] === zone[fields.partnerFederationName] && federator[fields.operatorName] === zone[fields.operatorName]) {
                    federator[fields.zones].push({ ...zone, registered: zone[fields.registered] ? perpetual.YES : perpetual.NO })
                }
            }
            federator[fields.zoneCount] = federator[fields.zones].length
        }
    }
    federatorList = federatorList.filter(item => {
        if (item[fields.partnerRoleAccessToSelfZones] || item[fields.partnerRoleShareZoneWithSelf]) {
            return isShared ? item[fields.partnerRoleAccessToSelfZones] : item[fields.partnerRoleShareZoneWithSelf]
        }
        return true
    })
    return federatorList;
}

export const getFederationKey = (data, isCreate) => {
    let federation = {}
    federation['selfoperatorid'] = data[fields.operatorName]
    federation['name'] = data[fields.partnerFederationName]
    if (isCreate) {
        federation.apikey = data[fields.partnerAPIKey]
        federation.countrycode = data[fields.partnerCountryCode]
        federation.federationaddr = data[fields.partnerFederationAddr]
        federation.federationid = data[fields.partnerFederationId]
        federation.selffederationid = data[fields.federationId]
        federation.operatorid = data[fields.partnerOperatorName]
    }
    return federation
}

export const getFederatorKey = (data, isCreate) => {
    let federator = {}
    federator.operatorid = data[fields.operatorName]
    if (isCreate) {
        federator.countryCode = data[fields.countryCode].toUpperCase()
        federator.mcc = data[fields.mcc]
        federator.mnc = data[fields.mnc]
        federator.region = data[fields.region]
    }
    if (data[fields.federationId]) {
        federator.federationid = data[fields.federationId]
    }
    if (data[fields.locatorendpoint]) {
        federator.locatorendpoint = data[fields.locatorEndPoint]
    }
    return federator
}

//Federator
export const showFederator = (self, data, single = false) => {
    let requestData = {}
    requestData[fields.region] = data[fields.region]
    requestData.operatorid = redux_org.isOperator(self) ? redux_org.nonAdminOrg(self) : data[fields.operatorName]
    if (single) {
        requestData.federationid = data[fields.federationId]
        requestData.countryCode = data[fields.countryCode]
    }
    return { method: endpoint.SHOW_FEDERATOR, data: requestData, keys: federatorKeys(), iconKeys: iconKeys() }
}

export const createFederator = async (self, data) => {
    let requestData = getFederatorKey(data, true)
    let request = { method: endpoint.CREATE_FEDERATOR, data: requestData }
    return await authSyncRequest(self, request)
}
export const updateFederator = async (self, data) => {
    const requestData = getFederatorKey(data, true)
    let request = { method: endpoint.UPDATE_FEDERATOR, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteFederator = async (self, data) => {
    let requestList = []
    if (data[fields.partnerFederationId]) {
        requestList.push({ method: endpoint.DELETE_FEDERATION, data: getFederationKey(data) })
    }
    requestList.push({ method: endpoint.DELETE_FEDERATOR, data: getFederatorKey(data) })
    let mc = undefined
    for (const request of requestList) {
        mc = await authSyncRequest(self, request)
        if (responseValid(mc)) {
            continue;
        }
        else {
            break;
        }
    }
    return mc
}

export const setApiKey = async (self, data) => {
    let request = { method: endpoint.SET_API_KEY, data: data }
    return await authSyncRequest(self, request)
}

export const generateApiKey = async (self, data) => {
    let requestData = getFederatorKey(data)
    let request = { method: endpoint.GENERATE_API_KEY, data: requestData }
    return await authSyncRequest(self, request)
}

//Federation
export const showFederation = (self, data) => {
    let requestData = {}
    let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
    if (organization) {
        if (redux_org.isOperator(self)) {
            requestData = { selfoperatorid: organization }
        }
    }
    return { method: endpoint.SHOW_FEDERATION, data: requestData, keys: federationKeys(), iconKeys: iconKeys() }
}

export const createFederation = async (self, data, selffederationid) => {
    let requestData = getFederationKey(data, true)
    requestData['selffederationid'] = selffederationid ? selffederationid : data[fields.federationId]
    let request = { method: endpoint.CREATE_FEDERATION, data: requestData }
    return await authSyncRequest(self, request)
}

export const registerFederation = async (self, data) => {
    let requestData = getFederationKey(data)
    let request = { method: endpoint.REGISTER_FEDERATION, data: requestData }
    return await authSyncRequest(self, request)
}

export const deRegisterFederation = async (self, data) => {
    let requestData = getFederationKey(data)
    let request = { method: endpoint.DEREGISTER_FEDERATION, data: requestData }
    return await authSyncRequest(self, request)
} 
