import { redux_org } from '../../../helper/reduxData'
import { perpetual } from '../../../helper/constant';
import { localFields } from '../../fields';
import { endpoint } from '../..';

export const keys = () => ([
    { field: localFields.cloudletName, serverField: 'key#OS#name' },
    { field: localFields.operatorName, serverField: 'key#OS#organization' },
    { field: localFields.state, serverField: 'state' },
    { field: localFields.notifyId, serverField: 'notify_id' },
    { field: localFields.controller, serverField: 'controller' },
    { field: localFields.status, serverField: 'status' },
    { field: localFields.containerVersion, serverField: 'container_version' },
    { field: localFields.osMaxRam, serverField: 'os_max_ram' },
    { field: localFields.osMaxVCores, serverField: 'os_max_vcores' },
    { field: localFields.osMaxVolGB, serverField: 'os_max_vol_gb' },
    { field: localFields.flavors, serverField: 'flavors' },
    { field: localFields.compatibilityVersion, serverField: 'compatibility_version' },
])

export const getKey = (data) => {
    return ({
        region: data[localFields.region],
        cloudletinfo: {
            key: {
                organization: data[localFields.operatorName],
                name: data[localFields.cloudletName]
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