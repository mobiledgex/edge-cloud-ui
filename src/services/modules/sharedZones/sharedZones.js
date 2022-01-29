import { endpoint, perpetual } from '../../../helper/constant'
import * as formatter from '../../model/format'
import { redux_org } from '../../../helper/reduxData';

let fields = formatter.fields


export const keys = () => ([
    { field: fields.federationName, label: 'Federation Name', serverField: 'federationname', visible: true, key: true, sortable: true },
    { field: fields.operatorName, serverField: 'selfoperatorid', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.zoneId, label: 'Zones', serverField: 'zoneid', visible: true },
    { field: fields.register, serverField: 'Registered', label: 'Registered Zones' },
])

export const iconKeys = () => ([
    { field: fields.register, label: 'Registered Zones', icon: 'gpu_green.svg', clicked: false, count: 0, roles: [perpetual.ADMIN_MANAGER, perpetual.OPERATOR_MANAGER, perpetual.OPERATOR_VIEWER] },
])

export const showSelfFederatorZone = (self, data) => {
    let requestData = {}

    let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
    if (organization) {
        if (redux_org.isOperator(self)) {
            requestData = { selfoperatorid: organization }
        }
    }
    return { method: endpoint.SHOW_FEDERATOR_SELF_ZONE, data: requestData, keys: keys(), iconKeys: iconKeys() }
}
