
import * as formatter from '../../model/format'
import { authSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'Region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.zoneId, label: 'Zone id', serverField: 'zoneid', sortable: true, visible: true, filter: true, key: true },
    { field: fields.cloudlets, label: 'cloudlets', serverField: 'cloudlets', sortable: true, filter: true, key: true, dataType: perpetual.TYPE_ARRAY },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true },
    { field: fields.federationName, label: 'Federation Name', serverField: 'federationname', detailView: false },
    { field: fields.operatorName, label: 'Operator Name', serverField: 'operatorid', sortable: true, visible: true, filter: true, key: true },
    { field: fields.selfOperatorId, label: 'Operator Name', serverField: 'selfoperatorid' },
    { field: fields.sharedOperator, label: 'Zones Shared With ', detailView: true, dataType: perpetual.TYPE_ARRAY },
])

export const getKey = (data, isCreate) => {
    let selfZone = {}
    data[fields.operatorName] ? selfZone.operatorid = data[fields.operatorName] : null
    data[fields.countryCode] ? selfZone.countryCode = data[fields.countryCode].toUpperCase() : null
    data[fields.federationName] ? selfZone.federationName = data[fields.federationName] : null
    selfZone.zoneId = data[fields.zoneId]
    if (isCreate) {
        selfZone.geolocation = data[fields.cloudletLocation].toString()
        selfZone.region = data[fields.region]
        selfZone.cloudlets = [data[fields.cloudletName]]
    }
    if (data[fields.city]) {
        selfZone.city = data[fields.city]
    }
    if (data[fields.state]) {
        selfZone.locatorendpoint = data[fields.state]
    }
    if (data[fields.locality]) {
        selfZone.locality = data[fields.locality]
    }
    return selfZone
}

export const showSelfFederatorZone = (self, data, specific) => {
    let requestData = {}
    if (specific) {
        requestData = data
    }
    else {
        let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
        if (organization) {
            if (redux_org.isOperator(self)) {
                requestData.selfoperatorid = organization
            }
        }
    }
    return { method: endpoint.SHOW_FEDERATOR_SELF_ZONE, data: requestData, keys: keys() }
}



export const showSelfZone = (self, data, specific) => {
    let requestData = {}
    if (specific) {
        requestData = data
    }
    else {
        let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
        if (organization) {
            if (redux_org.isOperator(self)) {
                requestData = { operatorid: organization, region: data.region }
            }
        } else {
            requestData = { region: data.region }
        }
    }
    return { method: endpoint.SHOW_SELF_ZONES, data: requestData, keys: keys() }
}

export const shareSelfZones = (data) => {
    let requestData = getKey(data)
    requestData.selfoperatorid = requestData.operatorid
    delete requestData.operatorid
    return { method: endpoint.SELF_ZONES_SHARE, data: requestData, success: 'Zones Shared Successfully' }
}

export const unShareSelfZones = (data) => {
    let requestData = getKey(data)
    requestData.selfoperatorid = requestData.operatorid
    delete requestData.operatorid
    return { method: endpoint.SELF_ZONES_UNSHARE, data: requestData, success: 'Zones UnShared Successfully' }
}

export const createSelfZone = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.CREATE_FEDERATOR_SELF_ZONE, data: requestData, keys: keys() }
    return await authSyncRequest(self, request)
}

export const deleteSelfZone = (self, data) => {
    let requestData = getKey(data);
    return { method: endpoint.DELETE_FEDERATOR_SELF_ZONE, data: requestData, success: `Zone ${data[fields.zoneId]} removed successfully` }
}

export const multiDataRequest = (keys, mcRequestList, specific) => {
    let selfZoneList, federatorZoneList, federationList = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        let request = mcRequest.request;
        if (request.method === endpoint.SHOW_SELF_ZONES) {
            selfZoneList = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_FEDERATOR_SELF_ZONE) {
            federatorZoneList = mcRequest.response.data
        }
        else if (request.method === endpoint.SHOW_FEDERATION) {
            federationList = mcRequest.response.data
        }
    }
    if (selfZoneList && selfZoneList.length > 0) {
        for (let i = 0; i < selfZoneList.length; i++) {
            let selfZone = selfZoneList[i]
            for (let j = 0; j < federatorZoneList.length; j++) {
                let federatorZone = federatorZoneList[j]
                selfZone[fields.federationName] = federatorZone[fields.federationName]
                if (selfZone[fields.operatorName] === federatorZone[fields.selfOperatorId] && selfZone[fields.zoneId] === federatorZone[fields.zoneId]) {
                    let sharedoperator = []
                    for (let k = 0; k < federationList.length; k++) {
                        let federation = federationList[k]
                        if (selfZone[fields.operatorName] === federation[fields.operatorName] && selfZone[fields.federationName] === federation[fields.federationName]) {
                            sharedoperator.push(federation[fields.partnerOperatorName])
                            selfZone[fields.sharedOperator] = sharedoperator
                        }
                    }
                    selfZone[fields.zonesRegistered] = federatorZone[fields.register]
                    break
                }
            }
        }
    }
    return selfZoneList;
}
