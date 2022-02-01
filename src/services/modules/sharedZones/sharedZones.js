import { endpoint, perpetual } from '../../../helper/constant'
import * as formatter from '../../model/format'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.federationName, label: 'Federation Name', serverField: 'federationname', visible: true, key: true, sortable: true },
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.zoneId, label: 'Zones', serverField: 'zoneid', visible: true }
])

export const iconKeys = () => ([
    { field: fields.register, label: 'Registered', icon: 'bookmark_added', clicked: false, count: 0, roles: [perpetual.ADMIN_MANAGER, perpetual.OPERATOR_MANAGER, perpetual.OPERATOR_VIEWER] },
])

export const showSelfFederatorZone = (self, data) => {
    return { method: endpoint.SHOW_FEDERATOR_SELF_ZONE, data: data, keys: keys(), iconKeys: iconKeys() }
}
