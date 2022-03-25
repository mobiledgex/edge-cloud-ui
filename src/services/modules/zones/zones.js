
import { authSyncRequest } from '../../service';
import { perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'
import { TYPE_JSON } from '../../../helper/constant/perpetual';
import { endpoint } from '../..';
import { localFields } from '../../fields';

export const keys = () => ([
    { field: localFields.region, label: 'Region', serverField: 'region', sortable: true, visible: true, filter: true },
    { field: localFields.zoneId, label: 'Zone Id', serverField: 'zoneid', sortable: true, visible: true, filter: true },
    { field: localFields.operatorName, label: 'Operator Name', serverField: 'operatorid', sortable: true, visible: true, filter: true },
    { field: localFields.cloudlets, label: 'Cloudlets', serverField: 'cloudlets', dataType: perpetual.TYPE_STRING },
    { field: localFields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true },
    { field: localFields.cloudletLocation, label: 'Zone Location', serverField: 'geolocation', dataType:TYPE_JSON },
    { field: localFields.locality, label: 'Locality', serverField: 'locality' },
    { field: localFields.city, label: 'City', serverField: 'city' },
    { field: localFields.state, label: 'State', serverField: 'state' },
    { field: localFields.zoneCount, label: 'Shared With', visible:true, sortable: true, detailView: false },
    {
        field: localFields.zonesShared, label: 'Zones Shared',
        keys: [
            { field: localFields.partnerFederationName, label: 'Federation Name' },
            { field: localFields.registered, label: 'Registered' }
        ]
    },
    { field: localFields.revision, label: 'Revision', serverField: 'revision' }
])

export const iconKeys = () => ([
    { field:  localFields.zoneCount, label: 'Shared', icon: 'share', count: 0}
])

export const sharedkeys = () => ([
    { field: localFields.zoneId, label: 'Zone Id', serverField: 'zoneid', sortable: true, visible: true, filter: true },
    { field: localFields.operatorName, label: 'Operator Name', serverField: 'selfoperatorid', sortable: true, visible: true, filter: true },
    { field: localFields.partnerFederationName, label: 'Operator Name', serverField: 'federationname', sortable: true, visible: true, filter: true },
    { field: localFields.registered, label: 'Operator Name', serverField: 'Registered', sortable: true, visible: true },
    { field: localFields.revision, label: 'Revision', serverField: 'revision' }
])

export const getKey = (data, isCreate = false) => {
    let selfZone = {}
    data[localFields.operatorName] ? selfZone.operatorid = data[localFields.operatorName] : null
    data[localFields.countryCode] ? selfZone.countryCode = data[localFields.countryCode].toUpperCase() : null
    selfZone.federationId = data[localFields.federationId] ? data[localFields.federationId] : null
    selfZone.zoneId = data[localFields.zoneId]
    if (isCreate) {
        selfZone.geolocation = data[localFields.cloudletLocation].toString()
        selfZone.region = data[localFields.region]
        selfZone.cloudlets = [data[localFields.cloudletName]]
    }
    if (data[localFields.city]) {
        selfZone.city = data[localFields.city]
    }
    if (data[localFields.state]) {
        selfZone.locatorendpoint = data[localFields.state]
    }
    if (data[localFields.locality]) {
        selfZone.locality = data[localFields.locality]
    }
    return selfZone
}

export const showFederationZones = (self) => {
    let requestData = {}
    if (redux_org.isOperator(self)) {
        requestData['selfoperatorid'] = redux_org.nonAdminOrg(self)
    }
    return { method: endpoint.SHOW_FEDERATION_SELF_ZONE, data: requestData, keys: sharedkeys() }
}

export const showFederatorZones = (self, data = null) => {
    let requestData = {}
    if (redux_org.isOperator(self)) {
        requestData['operatorid'] = redux_org.nonAdminOrg(self)
    } else {
        requestData = data
    }
    return { method: endpoint.SHOW_FEDERATOR_SELF_ZONE, data: requestData, keys: keys() }
}

export const shareZones = (self, data, unshare = false) => {
    let requestData = {}
    requestData['zoneid'] = data[localFields.zoneId]
    requestData['selfoperatorid'] = data[localFields.operatorName]
    requestData['federationname'] = data[localFields.partnerFederationName]
    return { method: unshare ? endpoint.SELF_ZONES_UNSHARE : endpoint.SELF_ZONES_SHARE, data: requestData, success: `Zones ${unshare ? 'Un' : ''} Shared Successfully` }
}

export const createFederatorZone = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.CREATE_FEDERATOR_SELF_ZONE, data: requestData, keys: keys() }
    return await authSyncRequest(self, request)
}

export const deleteFederatorZone = (self, data) => {
    let requestData = getKey(data);
    return { method: endpoint.DELETE_FEDERATOR_SELF_ZONE, data: requestData, success: `Zone ${data[localFields.zoneId]} removed successfully` }
}

export const multiDataRequest = (keys, mcList) => {
    let zoneList = [], sharedZoneList = [];
    if (mcList && mcList.length > 0) {
        for (const mc of mcList) {
            const method = mc.request.method
            const data = mc.response.data
            if (method === endpoint.SHOW_FEDERATOR_SELF_ZONE) {
                zoneList = data
            }
            else if (method === endpoint.SHOW_FEDERATION_SELF_ZONE) {
                sharedZoneList = data
            }
        }

        if (zoneList.length > 0) {
            for (let zone of zoneList) {
                zone[localFields.zonesShared] = []
                if (sharedZoneList.length > 0) {
                    for (let sharedZone of sharedZoneList) {
                        if (sharedZone[localFields.zoneId] === zone[localFields.zoneId]) {
                            zone[localFields.zonesShared].push({ ...sharedZone, registered: sharedZone[localFields.registered] ? perpetual.YES : perpetual.NO })
                        }
                    }
                }
                zone[localFields.zoneCount] = zone[localFields.zonesShared].length
            }
        }
    }
    return zoneList;
}
