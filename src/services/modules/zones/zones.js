
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
    selfZone.countryCode = data[fields.countryCode]
    selfZone.zoneId = data[fields.zoneId]
    if (isCreate) {
        selfZone.geolocation = data[fields.zoneLocation].toString()
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

export const showSelfZone = (self, data) => {
    let requestData = {}
    let organization = data.org ? data.org : redux_org.orgName(self)
    if (organization) {
        if (redux_org.isOperator(self) || data.type === perpetual.OPERATOR) {
            requestData.operatorid = organization
        }
    }
    return { method: endpoint.SHOW_SELF_ZONES, data: requestData, keys: keys() }
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

