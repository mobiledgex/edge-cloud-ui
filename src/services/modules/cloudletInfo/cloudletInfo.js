import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant';
import { fields } from '../../model/format';

export const keys = () => ([
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
    let isDeveloper = redux_org.isDeveloper(self) || data.type === perpetual.DEVELOPER
    let method = isDeveloper ? endpoint.SHOW_ORG_CLOUDLET_INFO : endpoint.SHOW_CLOUDLET_INFO
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
            else if (redux_org.isOperator(self) || data.type === perpetual.OPERATOR) {
                requestData.cloudletinfo = { key: { organization } }
            }
        }
    }
    return { method, data: requestData, keys: keys() }
}