
import * as formatter from '../../fields'
import { authSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'
import { unionBy } from 'lodash';
import { responseValid } from '../../config';

let fields = formatter.fields

const federationKeys = () => ([
    { field: localFields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.federationId, serverField: 'selffederationid', label: 'Federation ID' },
    { field: localFields.partnerFederationName, serverField: 'name', label: 'Federation Name', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.partnerOperatorName, serverField: 'operatorid', label: 'Partner Operator', visible: true, filter: true, key: true },
    { field: localFields.partnerCountryCode, serverField: 'countrycode', label: 'Partner Country Code', visible: true, filter: true, key: true },
    { field: localFields.partnerFederationId, serverField: 'federationid', label: 'Partner Federation ID' },
    { field: localFields.partnerFederationAddr, serverField: 'federationaddr', label: 'Federation Address' },
    { field: localFields.partnerAPIKey, serverField: 'apikey', label: 'Api Key' },
    { field: localFields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets', key: true, dataType: perpetual.TYPE_ARRAY },
    { field: localFields.partnerRoleShareZoneWithSelf, label: 'Partner Share Zone', serverField: 'PartnerRoleShareZonesWithSelf' },
    { field: localFields.partnerRoleAccessToSelfZones, label: 'Partner Registered', serverField: 'PartnerRoleAccessToSelfZones' },
])

const federatorKeys = () => ([
    { field: localFields.region, label: 'Region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.operatorName, label: 'Operator', serverField: 'operatorid', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.federationId, label: 'Federation', serverField: 'federationid', sortable: true, filter: true, key: true },
    { field: localFields.federationAddr, serverField: 'federationaddr', label: 'Federation Address' },
    { field: localFields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true },
    { field: localFields.mcc, label: 'MCC', serverField: 'mcc', sortable: true, filter: true, key: true },
    { field: localFields.mnc, label: 'MNC', serverField: 'mnc', sortable: true, filter: true, key: true, dataType: perpetual.TYPE_ARRAY }
])

export const keys = (host = false) => {
    let unionKeys = unionBy(federatorKeys(), federationKeys(), 'field');
    unionKeys.push({ field: localFields.zoneCount, label: `Zones ${host ? 'Shared' : 'Received'}`, sortable: true, visible: true, filter: true, key: true, detailView: false })
    unionKeys.push({
        field: localFields.zones, label: `Zones ${host ? 'Shared' : 'Received'}`,
        keys: [
            { field: localFields.zoneId, label: 'Zone' },
            { field: localFields.registered, label: 'Registered' }
        ]
    })
    return unionKeys
}

export const iconKeys = (host = false) => ([
    { field: host ? localFields.partnerRoleAccessToSelfZones : localFields.partnerRoleShareZoneWithSelf, label: 'Registered', icon: 'bookmark_added', count: 0}
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
                if (federator[localFields.federationId] === federation[localFields.federationId]) {
                    federator[localFields.partnerOperatorName] = federation[localFields.partnerOperatorName]
                    federator[localFields.partnerCountryCode] = federation[localFields.partnerCountryCode]
                    federator[localFields.partnerFederationName] = federation[localFields.partnerFederationName]
                    federator[localFields.partnerFederationId] = federation[localFields.partnerFederationId]
                    federator[localFields.partnerRoleShareZoneWithSelf] = federation[localFields.partnerRoleShareZoneWithSelf]
                    federator[localFields.partnerRoleAccessToSelfZones] = federation[localFields.partnerRoleAccessToSelfZones]
                    federator[localFields.partnerFederationAddr] = federation[localFields.partnerFederationAddr]
                    break;
                }
            }
            federator[localFields.zones] = []
            for (let zone of zoneList) {
                if (federator[localFields.partnerFederationName] === zone[localFields.partnerFederationName] && federator[localFields.operatorName] === zone[localFields.operatorName]) {
                    federator[localFields.zones].push({ ...zone, registered: zone[localFields.registered] ? perpetual.YES : perpetual.NO })
                }
            }
            federator[localFields.zoneCount] = federator[localFields.zones].length
        }
    }
    federatorList = federatorList.filter(item => {
        if (item[localFields.partnerRoleAccessToSelfZones] || item[localFields.partnerRoleShareZoneWithSelf]) {
            return isShared ? item[localFields.partnerRoleAccessToSelfZones] : item[localFields.partnerRoleShareZoneWithSelf]
        }
        return true
    })
    return federatorList;
}

export const getFederationKey = (data, isCreate) => {
    let federation = {}
    federation['selfoperatorid'] = data[localFields.operatorName]
    federation['name'] = data[localFields.partnerFederationName]
    if (isCreate) {
        federation.apikey = data[localFields.partnerAPIKey]
        federation.countrycode = data[localFields.partnerCountryCode]
        federation.federationaddr = data[localFields.partnerFederationAddr]
        federation.federationid = data[localFields.partnerFederationId]
        federation.selffederationid = data[localFields.federationId]
        federation.operatorid = data[localFields.partnerOperatorName]
    }
    return federation
}

export const getFederatorKey = (data, isCreate) => {
    let federator = {}
    federator.operatorid = data[localFields.operatorName]
    if (isCreate) {
        federator.countryCode = data[localFields.countryCode].toUpperCase()
        federator.mcc = data[localFields.mcc]
        federator.mnc = data[localFields.mnc]
        federator.region = data[localFields.region]
    }
    if (data[localFields.federationId]) {
        federator.federationid = data[localFields.federationId]
    }
    if (data[localFields.locatorendpoint]) {
        federator.locatorendpoint = data[localFields.locatorEndPoint]
    }
    return federator
}

//Federator
export const showFederator = (self, data, single = false) => {
    let requestData = {}
    requestData[localFields.region] = data[localFields.region]
    requestData.operatorid = redux_org.isOperator(self) ? redux_org.nonAdminOrg(self) : data[localFields.operatorName]
    if (single) {
        requestData.federationid = data[localFields.federationId]
        requestData.countryCode = data[localFields.countryCode]
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
    if (data[localFields.partnerFederationId]) {
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
    requestData['selffederationid'] = selffederationid ? selffederationid : data[localFields.federationId]
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
