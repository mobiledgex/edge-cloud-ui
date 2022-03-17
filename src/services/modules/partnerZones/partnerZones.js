import { endpoint } from '../..';
import { perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData';
import * as formatter from '../../fields'

let localFields = formatter.localFields

export const keys = () => {
    return [
        { field: localFields.zoneId, label: 'Zone', serverField: 'zoneid', sortable: true, visible: true, filter: true, key: true },
        { field: localFields.partnerFederationName, serverField: 'federationname', label: 'Federation Name', sortable: true, visible: true, filter: true, key: true },
        { field: localFields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
        { field: localFields.partnerOperatorName, serverField: 'operatorid', label: 'Partner Operator', visible: true, filter: true, key: true },
        { field: localFields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets', dataType: perpetual.TYPE_ARRAY, detailView: true },
        { field: localFields.cloudletLocation, label: 'Location', serverField: 'geolocation', dataType: perpetual.TYPE_JSON},
        { field: localFields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true },
        { field: localFields.locality, label: 'Locality', serverField: 'locality' },
        { field: localFields.city, label: 'City', serverField: 'city' },
        { field: localFields.state, label: 'State', serverField: 'state' },
        { field: localFields.registered, serverField: 'Registered', label: 'Registered', format:true }
    ]
}

export const iconKeys = () => ([
    { field: localFields.registered, label: 'Registered', icon: 'bookmark_added', count: 0 },
])

export const getKey = (data) => {
    let federation = {}
    federation['selfOperatorId'] = data[localFields.operatorName]
    federation['zones'] = Array.isArray(data[localFields.zoneId]) ?  data[localFields.zoneId] : [data[localFields.zoneId]]
    federation['federationname'] = data[localFields.partnerFederationName]
    return federation
}

export const registerPartnerZone = (data) => {
    let requestData = getKey(data)
    return { method: endpoint.REGISTER_FEDERATOR_PARTNER_ZONES, data: requestData }
}

export const deregisterPartnerZone = (data) => {
    let requestData = getKey(data)
    return { method: endpoint.DEREGISTER_FEDERATOR_PARTNER_ZONES, data: requestData }
}

export const showPartnerFederatorZone = (self, data, specific) => {
    let requestData = {}
    let organization = undefined
    if (specific) {
        requestData['federationname'] = data[localFields.partnerFederationName]
        organization = data[localFields.operatorName]
    }
    else if (redux_org.isOperator(self)) {
        organization = redux_org.nonAdminOrg(self)
    }
    requestData['selfoperatorid'] = organization
    return { method: endpoint.SHOW_FEDERATOR_PARTNER_ZONE, data: requestData, keys: keys(), iconKeys: iconKeys() }
}
