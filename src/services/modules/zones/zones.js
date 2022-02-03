
import * as formatter from '../../model/format'
import { authSyncRequest } from '../../service';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'Region', serverField: 'region', sortable: true, visible: true, filter: true },
    { field: fields.zoneId, label: 'Zone Id', serverField: 'zoneid', sortable: true, visible: true, filter: true },
    { field: fields.operatorName, label: 'Operator Name', serverField: 'operatorid', sortable: true, visible: true, filter: true },
    { field: fields.cloudlets, label: 'Cloudlets', serverField: 'cloudlets', dataType: perpetual.TYPE_STRING },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true },
    { field: fields.location, label: 'Zone Location', serverField: 'geolocation' },
    { field: fields.locality, label: 'Locality', serverField: 'locality' },
    { field: fields.city, label: 'City', serverField: 'city' },
    { field: fields.state, label: 'State', serverField: 'state' },
    {
        field: fields.zonesShared, label: 'Zones Shared',
        keys: [
            { field: fields.federationName, label: 'Federation Name' },
            { field: fields.registered, label: 'Registered' }
        ]
    },
    { field: fields.revision, label: 'Revision', serverField: 'revision' }
])

export const sharedkeys = () => ([
    { field: fields.zoneId, label: 'Zone Id', serverField: 'zoneid', sortable: true, visible: true, filter: true },
    { field: fields.operatorName, label: 'Operator Name', serverField: 'selfoperatorid', sortable: true, visible: true, filter: true },
    { field: fields.federationName, label: 'Operator Name', serverField: 'federationname', sortable: true, visible: true, filter: true },
    { field: fields.registered, label: 'Operator Name', serverField: 'Registered', sortable: true, visible: true },
    { field: fields.revision, label: 'Revision', serverField: 'revision' }
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

export const showFederationZones = (self, data, specific) => {
    let requestData = {}
    if (specific) {
        requestData = data
    }
    else {
        let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
        if (organization) {
            if (redux_org.isOperator(self)) {
                requestData['selfoperatorid'] = organization
            }
        }
    }
    return { method: endpoint.SHOW_FEDERATION_SELF_ZONE, data: requestData, keys: sharedkeys() }
}

export const showFederatorZones = (self, data, specific) => {
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
    return { method: endpoint.SHOW_FEDERATOR_SELF_ZONES, data: requestData, keys: keys() }
}

export const shareZones = (self, data, unshare = false) => {
    let requestData = {}
    requestData['zoneid'] = data[fields.zoneId]
    requestData['selfoperatorid'] = data[fields.operatorName]
    requestData['federationname'] = data[fields.federationName]
    return { method: unshare ? endpoint.SELF_ZONES_UNSHARE : endpoint.SELF_ZONES_SHARE, data: requestData, success: 'Zones Shared Successfully' }
}

export const createFederatorZone = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.CREATE_FEDERATOR_SELF_ZONE, data: requestData, keys: keys() }
    return await authSyncRequest(self, request)
}

export const deleteFederatorZone = (self, data) => {
    let requestData = getKey(data);
    return { method: endpoint.DELETE_FEDERATOR_SELF_ZONE, data: requestData, success: `Zone ${data[fields.zoneId]} removed successfully` }
}

export const multiDataRequest = (keys, mcList) => {
    let zoneList = [], sharedZoneList = [];
    if (mcList && mcList.length > 0) {
        for (const mc of mcList) {
            const method = mc.request.method
            const data = mc.response.data
            if (method === endpoint.SHOW_FEDERATOR_SELF_ZONES) {
                zoneList = data
            }
            else if (method === endpoint.SHOW_FEDERATION_SELF_ZONE) {
                sharedZoneList = data
            }
        }

        if (zoneList.length > 0) {
            for (let zone of zoneList) {
                zone[fields.zonesShared] = []
                if (sharedZoneList.length > 0) {
                    for (let sharedZone of sharedZoneList) {
                        if (sharedZone[fields.zoneId] === zone[fields.zoneId]) {
                            zone[fields.zonesShared].push({...sharedZone, registered : sharedZone[fields.registered] ? perpetual.YES : perpetual.NO})
                        }
                    }
                }
            }
        }
    }
    return zoneList;
}
