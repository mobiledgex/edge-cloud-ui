import { UNIT_FLOOR, UNIT_GB, UNIT_MB } from '../../../pages/main/monitoring/helper/unitConvertor';
import { endpoint, perpetual } from '../../../helper/constant';
import { fields } from '../../model/format';
import { TYPE_JSON } from '../../../helper/constant/perpetual';

export const customData = (id, data) => {
    switch (id) {
        case fields.cloudletName:
            return `${data[fields.cloudletName]} [${data[fields.operatorName]}]`
    }
}

export const cloudletActions = [
    { id: perpetual.ACTION_LATENCY_METRICS, label: 'Show Latency Metrics' },
]

export const cloudletMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: false },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true }
]

export const cloudletFlavorMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    // { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    // { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true },
    { label: 'Flavor', serverField: 'flavor', visible: true, groupBy: true }
]

export const cloudletMetricsListKeys = [
    { field: fields.region, label: 'Region', sortable: true, visible: false, groupBy: false },
    { field: fields.cloudletName, serverField: 'cloudlet', label: 'Cloudlet', sortable: true, visible: true, groupBy: true, customData: true },
    { field: fields.operatorName, serverField: 'cloudletorg', label: 'Operator', sortable: true, visible: false, groupBy: true },
    { field: fields.cloudletLocation, label: 'Location', visible: false },
    { field: fields.resourceQuotas, label: 'Resource Quotas', visible: false },
    { field: 'cpu', label: 'CPU', resourceLabel: 'vCPUs', format: true, sortable: false, visible: true },
    { field: 'disk', label: 'Disk', resourceLabel: 'Disk', format: true, sortable: false, visible: false },
    { field: 'memory', label: 'Memory', resourceLabel: 'RAM', format: true, sortable: false, visible: false }
]

export const utilizationMetricType = [
    { field: 'cpu', serverField: 'utilization', subId: 'vCpuUsed', header: 'vCpu Infra Usage', position: 1, steppedLine: 'after' },
    { field: 'memory', serverField: 'utilization', subId: 'memUsed', header: 'Memory Infra Usage', position: 3, unit: UNIT_MB, steppedLine: 'after' },
    { field: 'disk', serverField: 'utilization', subId: 'diskUsed', header: 'Disk Infra Usage', position: 5, unit: UNIT_GB, steppedLine: 'after' },
]

export const resourceUsageMetricType = [
    { field: 'externalIpsUsed', serverField: 'externalIpsUsed', header: 'External IP Used', position: 4, unit: UNIT_FLOOR, steppedLine: 'after' },
    { field: 'floatingIpsUsed', serverField: 'floatingIpsUsed', header: 'Floating IP Used', position: 5, unit: UNIT_FLOOR, steppedLine: 'after' },
    { field: 'gpusUsed', serverField: 'gpusUsed', header: 'GPU Used', position: 6, unit: UNIT_FLOOR, steppedLine: 'after' },
    { field: 'instancesUsed', serverField: 'instancesUsed', header: 'Instances Used', position: 7, unit: UNIT_FLOOR, steppedLine: 'after' },
    { field: 'memory', serverField: 'ramUsed', header: 'RAM Used', position: 8, unit: UNIT_MB, steppedLine: 'after' },
    { field: 'cpu', serverField: 'vcpusUsed', header: 'vCPUs Used', position: 9, unit: UNIT_FLOOR, steppedLine: 'after' },
]

export const cloudletMetricTypeKeys = () => ([
    { field: 'utilization', serverField: 'utilization', header: 'Memory Usage', keys: utilizationMetricType, serverRequest: endpoint.CLOUDLET_METRICS_ENDPOINT },
    { field: 'resourceusage', serverField: 'resourceusage', header: 'Resource Usage', keys: resourceUsageMetricType, serverRequest: endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT },
    { field: 'count', header: 'Flavor Usage' },
    { field: 'map', header: 'Map' },
    { field: 'event', header: 'Event' },
])

/**
 * 
 * @param {*} data request data
 * @param {*} list extracts specific cloudlet data
 * @param {*} org cloudlet organization
 * @returns cloudlet metric data
 */
export const cloudletMetrics = (data, list, org) => {
    if (list) {
        data.cloudlets = list
    }
    else {
        data.cloudlet = {
            organization: org
        }
    }
    return { method: endpoint.CLOUDLET_METRICS_ENDPOINT, data: data, keys: cloudletMetricsKeys }
}

export const cloudletUsageMetrics = (data, org) => {
    data.cloudlet = data.cloudlet ? data.cloudlet : {
        organization: org
    }
    return { method: endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT, data: data, keys: cloudletMetricsKeys }
}

export const cloudletFlavorUsageMetrics = (data, org) => {
    return { method: endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT, data: data, keys: cloudletFlavorMetricsKeys }
}

