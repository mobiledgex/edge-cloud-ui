
import * as formatter from '../../model/format'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'region', serverField: 'region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.zoneId, label: 'Zone id', serverField: 'zoneid', sortable: true, visible: true, filter: true, key: true },
    { field: fields.cloudlets, label: 'cloudlets', serverField: 'cloudlets', sortable: true, filter: true, key: true, dataType: perpetual.TYPE_ARRAY },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, label: 'Operator Name', serverField: 'operatorid', sortable: true, visible: true, filter: true, key: true }
])


export const getKey = (data, isCreate) => {
    let selfZone = {}
    selfZone.operatorid = data[fields.operatorName]
    data[fields.countryCode] ? selfZone.countryCode = data[fields.countryCode] : null
    data[fields.federationName] ? selfZone.federationName = data[fields.federationName] : null
    selfZone.zoneId = data[fields.zoneId]
    if (isCreate) {
        selfZone.geolocation = data[fields.cloudletLocation].toString()
        selfZone.region = data[fields.region]
        selfZone.cloudlets = data[fields.cloudletName]
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
export const showSelfFederatorZone = (self, data) => {
    return { method: endpoint.SHOW_FEDERATOR_SELF_ZONE, keys: keys() }

}
export const showSelfZone = (self, data) => {
    return { method: endpoint.SHOW_SELF_ZONES, data: data, keys: keys() }
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
