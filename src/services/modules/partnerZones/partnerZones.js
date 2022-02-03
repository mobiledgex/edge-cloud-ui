import { endpoint, perpetual } from '../../../helper/constant'
import * as formatter from '../../model/format'

let fields = formatter.fields


export const keys = () => ([
    { field: fields.federationName, label: 'Federation Name', serverField: 'federationname', visible: true, key: true, sortable: true },
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.zoneId, label: 'Zones', serverField: 'zoneid', visible: true },
    { field: fields.partnerOperatorName, label: 'Partner Operator', serverField: 'operatorid', sortable: true, visible: true, filter: true, key: true },
    { field: fields.cloudletLocation, label: 'Location', serverField: 'geolocation', dataType: perpetual.TYPE_JSON},
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true },
    { field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets', dataType: perpetual.TYPE_ARRAY, detailView: true },
    { field: fields.city, serverField: 'city', label: 'City'},
    { field: fields.state, serverField: 'state', label: 'State'},
    { field: fields.locality, serverField: 'locality', label: 'Locality'},
    { field: fields.register, serverField: 'Registered', label: 'Registered', format:true },

])
export const iconKeys = () => ([
    { field: fields.register, label: 'Registered', icon: 'bookmark_added', clicked: false, count: 0, roles: [perpetual.ADMIN_MANAGER, perpetual.OPERATOR_MANAGER, perpetual.OPERATOR_VIEWER] },
])

export const getKey = (data) => {
    let federation = {}
    federation['selfOperatorId'] = data[fields.operatorName]
    federation['zones'] = Array.isArray(data[fields.zoneId]) ?  data[fields.zoneId] : [data[fields.zoneId]]
    federation['federationname'] = data[fields.federationName]
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

export const showPartnerFederatorZone = (self, data) => {
    return { method: endpoint.SHOW_FEDERATOR_PARTNER_ZONE, data: data, keys: keys(), iconKeys: iconKeys() }
}
