
import * as constant from '../../constant';
import { SHOW_CLOUDLET_INFO, SHOW_ORG_CLOUDLET_INFO } from './endPointTypes'
import { redux_org } from '../../helper/reduxData'
import * as formatter from './format'

let fields = formatter.fields;

const keys = () => ([
    { field: fields.cloudletName, serverField: 'key#OS#name' },
    { field: fields.operatorName, serverField: 'key#OS#organization' },
    { field: fields.state, serverField: 'state' },
    { field: fields.notifyId, serverField: 'notify_id' },
    { field: fields.controller, serverField: 'controller' },
    { field: fields.status, serverField: 'status' },
    { field: fields.containerVersion, serverField: 'container_version' },
    { field: fields.osMaxRam, serverField: 'os_max_ram' },
    { field: fields.osMaxVCores, serverField: 'os_max_vcores' },
    { field: fields.osMaxVolGB, serverField: 'os_max_vol_gb' },
    { field: fields.flavors, serverField: 'flavors' },
    { field: fields.compatibilityVersion, serverField: 'compatibility_version' },
])

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        cloudletinfo: {
            key: {
                organization: data[fields.operatorName],
                name: data[fields.cloudletName]
            }
        }
    })
}

export const showCloudletInfoData = (self, data, specific) => {
    let requestData = {}
    let isDeveloper = redux_org.isDeveloper(self) || data.type === constant.DEVELOPER
    let method = isDeveloper ? SHOW_ORG_CLOUDLET_INFO : SHOW_CLOUDLET_INFO
    if (specific) {
        let cloudletinfo = { key: data.cloudletkey ? data.cloudletkey : data.cloudlet.key }
        requestData = {
            uuid: data.uuid,
            region: data.region,
            cloudletinfo
        }
    }
    else {
        requestData.region = data.region
        let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
        if (organization) {
            if (isDeveloper) {
                requestData.org = organization
            }
            else if (redux_org.isOperator(self) || data.type === constant.OPERATOR) {
                requestData.cloudletinfo = { key: { organization } }
            }
        }
    }
    return { method, data: requestData, keys: keys() }
}

const customData = (value) => {
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData)
}