import { endpoint } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'
import { cloudletKeys } from '../cloudlet'
import { localFields } from '../../fields'

export const clusterEventKeys = [
    { field: localFields.time, label: 'Starttime', serverField: 'time', visible: true, detailedView: false, format: true },
    { label: 'Region', serverField: 'region', visible: true, detailedView: false, groupBy: true, filter: true },
    { field: localFields.clusterName, label: 'Cluster', serverField: 'cluster', visible: true, detailedView: false, groupBy: true, filter: true},
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: false, detailedView: false, groupBy: false },
    { field: localFields.cloudletName, label: 'Cloudlet', serverField: 'cloudlet', visible: true, detailedView: false, groupBy: true, format: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: false, detailedView: false, groupBy: true },
    { label: 'Reserved By', serverField: 'reservedBy', visible: false, detailedView: false, groupBy: false },
    { label: 'Flavor', serverField: 'flavor', visible: false, detailedView: true },
    { label: 'vCPU', serverField: 'vcpu', visible: false, detailedView: true },
    { label: 'RAM', serverField: 'ram', visible: false, detailedView: true },
    { label: 'Disk', serverField: 'disk', visible: false, detailedView: true },
    { label: 'Node Count', serverField: 'nodecount', visible: false, detailedView: true },
    { label: 'Other', serverField: 'other', visible: false, detailedView: false },
    { label: 'Action', serverField: 'event', visible: true, detailedView: true },
    { label: 'Status', serverField: 'status', visible: true, detailedView: true }
]

export const clusterEventLogs = (self, data, isOperator=false) => {
    let requestData = {
        region: data[localFields.region],
        starttime: data[localFields.starttime],
        endtime: data[localFields.endtime]
    }
    if (isOperator) {
        requestData.clusterinst = {
            cloudlet_key: cloudletKeys(data)
        }
    }
    else {
        requestData.clusterinst = {
            organization: data[localFields.organizationName]
        }
    }
    return { method: endpoint.CLUSTER_EVENT_LOG_ENDPOINT, data: requestData, keys: clusterEventKeys }
}