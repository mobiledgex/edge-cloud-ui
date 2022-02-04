import { operatorRoles } from '../../../constant';
import { endpoint, perpetual } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData';
import * as formatter from '../../model/format'

let fields = formatter.fields

export const keys = () => {
    return [
        { field: fields.zoneId, label: 'Zone', serverField: 'zoneid', sortable: true, visible: true, filter: true, key: true },
        { field: fields.partnerFederationName, serverField: 'federationname', label: 'Federation Name', sortable: true, visible: true, filter: true, key: true },
        { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
        { field: fields.partnerOperatorName, serverField: 'operatorid', label: 'Partner Operator', visible: true, filter: true, key: true },
        { field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets', dataType: perpetual.TYPE_ARRAY, detailView: true },
        { field: fields.cloudletLocation, label: 'Location', serverField: 'geolocation', dataType: perpetual.TYPE_JSON},
        { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true },
        { field: fields.locality, label: 'Locality', serverField: 'locality' },
        { field: fields.city, label: 'City', serverField: 'city' },
        { field: fields.state, label: 'State', serverField: 'state' },
        { field: fields.registered, serverField: 'Registered', label: 'Registered', format:true }
    ]
}

export const iconKeys = () => ([
    { field: fields.registered, label: 'Registered', icon: 'bookmark_added', count: 0, roles: operatorRoles },
])

export const getKey = (data) => {
    let federation = {}
    federation['selfOperatorId'] = data[fields.operatorName]
    federation['zones'] = Array.isArray(data[fields.zoneId]) ?  data[fields.zoneId] : [data[fields.zoneId]]
    federation['federationname'] = data[fields.partnerFederationName]
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
    if (specific) {
        requestData['federationname'] = data[fields.partnerFederationName]
        requestData['selfoperatorid'] = data[fields.operatorName]
    }
    else {
        let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
        if (organization) {
            if (redux_org.isOperator(self)) {
                requestData.selfoperatorid = organization
            }
        }
    }
    return { method: endpoint.SHOW_FEDERATOR_PARTNER_ZONE, data: requestData, keys: keys(), iconKeys: iconKeys() }
}
