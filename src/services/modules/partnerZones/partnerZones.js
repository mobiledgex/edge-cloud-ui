import { endpoint, perpetual } from '../../../helper/constant'
import * as formatter from '../../model/format'

let fields = formatter.fields


export const keys = () => ([
    { field: fields.federationName, label: 'Federation Name', serverField: 'federationname', visible: true, key: true, sortable: true },
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.zoneId, label: 'Zones', serverField: 'zoneid', visible: true },
    { field: fields.countryCode, label: 'Country Code', serverField: 'countrycode', sortable: true, visible: true, filter: true, key: true },
    { field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets', dataType: perpetual.TYPE_ARRAY },
    { field: fields.register, label: 'Registered Zones', serverField: 'Registered', icon: 'gpu_green.svg', detailView: false }

])
export const iconKeys = () => ([
    { field: fields.register, label: 'Registered Federation', icon: 'gpu_green.svg', clicked: false, count: 0, roles: [perpetual.ADMIN_MANAGER, perpetual.OPERATOR_MANAGER, perpetual.OPERATOR_VIEWER] },
])
export const showPartnerFederatorZone = (self, data) => {
    return { method: endpoint.SHOW_FEDERATOR_PARTNER_ZONE, keys: keys(), iconKeys: iconKeys() }
}
