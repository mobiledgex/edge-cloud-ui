import * as dateUtil from '../../../utils/date_util'
import { endpoint } from '../../../helper/constant'
import { redux_org } from '../../../helper/reduxData'
import { primaryKeys as cloudletKeys } from '../cloudlet'
import { fields } from '../../model/format'

export const clusterEventKeys = [
    { label: 'Starttime', serverField: 'time', visible: true, detailedView: false, format: dateUtil.FORMAT_FULL_DATE_TIME },
    { label: 'Region', serverField: 'region', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Cluster', serverField: 'cluster', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: true, detailedView: false, groupBy: false },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, detailedView: false, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, detailedView: false, groupBy: true },
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

export const clusterEventLogs = (self, data) => {
    let requestData = {
        region: data[fields.region],
        starttime: data[fields.starttime],
        endtime: data[fields.endtime]
    }
    if (redux_org.isOperator(self)) {
        requestData.clusterinst = {
            cloudlet_key: cloudletKeys(data)
        }
    }
    else {
        requestData.clusterinst = {
            organization: data[fields.organizationName]
        }
    }
    return { method: endpoint.CLUSTER_EVENT_LOG_ENDPOINT, data: requestData, keys: clusterEventKeys }
}