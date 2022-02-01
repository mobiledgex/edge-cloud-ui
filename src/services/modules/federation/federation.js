
import * as formatter from '../../model/format'
import { authSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'Region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationName, serverField: 'name', label: 'Federation Name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationAddr, serverField: 'federationaddr', label: 'Federation Address' },
    { field: fields.partnerOperatorName, serverField: 'operatorid', label: 'Partner Operator', visible: true, filter: true, key: true },
    { field: fields.partnerCountryCode, serverField: 'countrycode', label: 'Partner Country Code', visible: true, filter: true, key: true },
    { field: fields.partnerFederationid, serverField: 'federationid', label: 'Partner Federation ID' },
    { field: fields.apiKey, serverField: 'apikey', label: 'Api Key' },
    { field: fields.federationId, serverField: 'selffederationid', label: 'Federation ID' },
    { field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets', key: true, dataType: perpetual.TYPE_ARRAY },
    { field: fields.zoneId, label: 'Shared Zone', serverField: 'zoneid', dataType: perpetual.TYPE_ARRAY },
    { field: fields.zoneCount, label: 'Zone Shared', sortable: true, visible: true, filter: true, key: true, detailView: false },
    { field: fields.partnerRoleShareZoneWithSelf, label: 'Partner Share Zone', serverField: 'PartnerRoleShareZonesWithSelf', detailView: true, key: true, filter: true },
])

export const iconKeys = () => ([
    { field: fields.partnerRoleShareZoneWithSelf, label: 'Registered', icon: 'bookmark_added', clicked: false, count: 0, roles: [perpetual.ADMIN_MANAGER, perpetual.OPERATOR] },
])

export const getKey = (data, isCreate) => {
    let federation = {}
    federation.selfoperatorid = data[fields.operatorName]
    federation.name = data[fields.federationName]
    if (isCreate) {
        data[fields.apiKey] ? (federation.apikey = data[fields.apiKey]) : null
        data[fields.partnerCountryCode] ? (federation.countrycode = data[fields.partnerCountryCode].toUpperCase()) : null
        data[fields.federationAddr] ? (federation.federationaddr = data[fields.federationAddr]) : null
        data[fields.partnerFederationid] ? federation.federationid = data[fields.partnerFederationid] : null
        data[fields.federationId] ? federation.selffederationid = data[fields.federationId] : null
        data[fields.partnerOperatorName] ? federation.operatorid = data[fields.partnerOperatorName] : null
    }
    data[fields.zonesList] ? federation.zones = data[fields.zonesList] : null

    return federation
}

export const showFederation = (self, data) => {
    let requestData = {}
    let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
    if (organization) {
        if (redux_org.isOperator(self)) {
            requestData = { selfoperatorid: organization }
        }
    }
    return { method: endpoint.SHOW_FEDERATION, data: requestData, keys: keys(),iconKeys: iconKeys() }
}

export const createFederation = async (self, data, selffederationid) => {
    let requestData = getKey(data, true)
    requestData['selffederationid'] = selffederationid ? selffederationid : data[fields.federationId]
    let request = { method: endpoint.CREATE_FEDERATION, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteFederation = (self, data) => {
    let requestData = getKey(data)
    return { method: endpoint.DELETE_FEDERATION, data: requestData, success: `Federation ${data[fields.federationName]} deleted successfully` }
}

export const setApiKey = async (self, data) => {
    let request = { method: endpoint.SET_API_KEY, data: data }
    return await authSyncRequest(self, request)
}

export const registerFederation = async (self, data) => {
    let requestData = getKey(data)
    let request = { method: endpoint.REGISTER_FEDERATION, data: requestData }
    return await authSyncRequest(self, request)
}

export const deRegisterFederation = async (self, data) => {
    let requestData = getKey(data)
    let request = { method: endpoint.DEREGISTER_FEDERATION, data: requestData }
    return await authSyncRequest(self, request)
} 

export const showRegisterPartnerZone = (data) => {
    let requestData = getKey(data)
    requestData.federationname = requestData.name
    delete requestData.name
    return { method: endpoint.REGISTER_FEDERATOR_PARTNER_ZONES, keys: keys(), data: requestData, iconKeys: iconKeys() }
}

export const showDeregisterPartnerZone = (data) => {
    let requestData = getKey(data)
    requestData.federationname = requestData.name
    delete requestData.name
    return { method: endpoint.DEREGISTER_FEDERATOR_PARTNER_ZONES, keys: keys(), data: requestData, iconKeys: iconKeys() }
}

export const multiDataRequest = (keys, mcRequestList, specific) => {
    let federationList = [], federatorList = [], zonesList = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        let request = mcRequest.request;
        if (request.method === endpoint.SHOW_FEDERATION) {
            federationList = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_FEDERATOR) {
            federatorList = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_FEDERATOR_SELF_ZONE) {
            zonesList = mcRequest.response.data
        }
    }
    if (federatorList && federatorList.length > 0) {
        for (let i = 0; i < federatorList.length; i++) {
            let federator = federatorList[i]
            for (let j = 0; j < federationList.length; j++) {
                let federation = federationList[j]
                if (federator[fields.federationId] === federation.federationId) {
                    federator[fields.region] = federator[fields.region] ? federator[fields.region] : undefined
                    federator[fields.federationId] = federation[fields.federationId]
                    federator[fields.partnerOperatorName] = federation[fields.partnerOperatorName] ? federation[fields.partnerOperatorName] : undefined
                    federator[fields.countryCode] = federator[fields.countryCode] ? federator[fields.countryCode] : undefined
                    federator[fields.partnerCountryCode] = federation[fields.partnerCountryCode] ? federation[fields.partnerCountryCode] : undefined
                    federator[fields.operatorName] = federator[fields.operatorName]
                    federator[fields.mcc] = federator[fields.mcc]
                    federator[fields.mnc] = federator[fields.mnc]
                    federator[fields.federationName] = federation[fields.federationName] ? federation[fields.federationName] : undefined
                    federator[fields.partnerRoleShareZoneWithSelf] = federation[fields.partnerRoleShareZoneWithSelf] === perpetual.YES ? true : false
                    break
                }
            }
            let zone = []
            for (let j = 0; j < zonesList.length; j++) {
                let zones = zonesList[j]
                if (federator[fields.federationName] === zones[fields.federationName] && federator[fields.operatorName] === zones[fields.selfOperatorId]) {
                    zone.push(zones[fields.zoneId])
                    federator[fields.zoneId] = zone
                    federator[fields.zoneCount] = zone.length
                }
            }
        }
    }
    return federatorList;
}
