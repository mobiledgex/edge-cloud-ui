import { UNIT_FLOOR, UNIT_GB, UNIT_MB } from '../../../pages/main/monitoring/helper/unitConvertor';
import { pick } from '../../../helper/constant/operators';
import { CK_ORG, cloudletKeys } from '../cloudlet/primary';
import { localFields } from '../../fields';
import { endpoint } from '../..';

export const customData = (id, data) => {
    switch (id) {
        case localFields.cloudletName:
            return `${data[localFields.cloudletName]} [${data[localFields.operatorName]}]`
    }
}

export const cloudletMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true }
]

export const cloudletFlavorMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    { label: 'Flavor', serverField: 'flavor', visible: true, groupBy: true }
]

export const cloudletMetricsListKeys = [
    { field: localFields.region, serverField: 'region', label: 'Region', sortable: true, visible: true, groupBy: true },
    { field: localFields.cloudletName, serverField: 'cloudlet', label: 'Cloudlet', sortable: true, visible: true, groupBy: true, customData: true },
    { field: localFields.operatorName, serverField: 'cloudletorg', label: 'Operator', sortable: true, visible: false, groupBy: true },
    { field: localFields.cloudletLocation, label: 'Location', visible: false },
    { field: localFields.resourceQuotas, label: 'Resource Quotas', visible: false },
    { field: 'cpu', label: 'CPU', resourceLabel: 'vCPUs', format: true, sortable: false, visible: true },
    { field: 'disk', label: 'Disk', resourceLabel: 'Disk', format: true, sortable: false, unit: UNIT_GB, visible: true },
    { field: 'memory', label: 'Memory', resourceLabel: 'RAM', format: true, sortable: false, unit: UNIT_MB, visible: true }
]

export const utilizationMetricType = [
    { field: 'cpu', label: 'CPU', serverField: 'utilization', subId: 'vCpuUsed', header: 'vCpu Infra Usage', position: 1, steppedLine: 'after' },
    { field: 'memory', label: 'Memory', serverField: 'utilization', subId: 'memUsed', header: 'Memory Infra Usage', position: 3, unit: UNIT_MB, steppedLine: 'after' },
    { field: 'disk', label: 'Disk', serverField: 'utilization', subId: 'diskUsed', header: 'Disk Infra Usage', position: 5, unit: UNIT_GB, steppedLine: 'after' },
]

export const resourceUsageMetricType = [
    { field: 'externalIpsUsed', serverField: 'externalIpsUsed', header: 'External IP Used', position: 4, unit: UNIT_FLOOR, steppedLine: 'after' },
    { field: 'floatingIpsUsed', serverField: 'floatingIpsUsed', header: 'Floating IP Used', position: 5, unit: UNIT_FLOOR, steppedLine: 'after' },
    { field: 'gpusUsed', serverField: 'gpusUsed', header: 'GPU Used', position: 6, unit: UNIT_FLOOR, steppedLine: 'after' },
    { field: 'instancesUsed', serverField: 'instancesUsed', header: 'Instances Used', position: 7, unit: UNIT_FLOOR, steppedLine: 'after' },
    { field: 'memory', serverField: 'ramUsed', header: 'RAM Used', position: 8, unit: UNIT_MB, steppedLine: 'after' },
    { field: 'cpu', serverField: 'vcpusUsed', header: 'vCPUs Used', position: 9, unit: UNIT_FLOOR, steppedLine: 'after' },
]

export const cloudletResourceKeys = () => ([
    { field: 'flavorusage', header: 'Flavor Usage', serverField: 'flavorusage', serverRequest: endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT, steppedLine: 'after' },
    { field: 'utilization', serverField: 'utilization', header: 'Memory Usage', keys: utilizationMetricType, serverRequest: endpoint.CLOUDLET_METRICS_ENDPOINT },
    { field: 'resourceusage', serverField: 'resourceusage', header: 'Resource Usage', keys: resourceUsageMetricType, serverRequest: endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT },
    { field: 'map', header: 'Map' },
    { field: 'event', header: 'Event' },
])

/**New */
const metricElements = [
    { field: localFields.networkSent, label: 'Network Sent', serverField: 'netSend', unit: UNIT_FLOOR },
    { field: localFields.networkReceived, label: 'Network Received', serverField: 'netRecv', unit: UNIT_FLOOR },
    { field: localFields.cpuUsed, label: 'vCPUs Used', serverField: 'vCpuUsed', serverFieldMax: 'vCpuMax', unit: UNIT_FLOOR },
    { field: localFields.memUsed, label: 'RAM Used', serverField: 'memUsed', serverFieldMax: 'memMax', unit: UNIT_FLOOR },
    { field: localFields.diskUsed, label: 'Disk Used', serverField: 'diskUsed', serverFieldMax: 'diskMax', unit: UNIT_FLOOR },
    { field: localFields.floatingIpsUsed, label: 'Floating IP Used', serverField: 'floatingIpsUsed', serverFieldMax: 'floatingIpsMax', unit: UNIT_FLOOR },
    { field: localFields.ipv4Used, label: 'IPv4 Used', serverField: 'ipv4Used', serverFieldMax: 'ipv4Max', unit: UNIT_FLOOR }
]
const metricUsageElements = [
    { field: localFields.externalIpsUsed, label: 'External IP', serverField: 'externalIpsUsed', unit: UNIT_FLOOR },
    { field: localFields.floatingIpsUsed, label: 'Floating IP', serverField: 'floatingIpsUsed', unit: UNIT_FLOOR },
    { field: localFields.gpusUsed, label: 'GPUs', serverField: 'gpusUsed', unit: UNIT_FLOOR },
    { field: localFields.instancesUsed, label: 'Instances', serverField: 'instancesUsed', unit: UNIT_FLOOR },
    { field: localFields.ramUsed, label: 'RAM', serverField: 'ramUsed', unit: UNIT_MB },
    { field: localFields.cpuUsed, label: 'CPU', serverField: 'vcpusUsed', unit: UNIT_FLOOR }
]
const metricUsageFlavorElements = [
    { field: localFields.count, label: 'Flavor Count', serverField: 'count' },
    { field: localFields.flavorName, label: 'Flavor Name', serverField: 'flavor' }
]   

export const cloudletMetricsElements = [
    // { serverRequest: endpoint.CLOUDLET_METRICS_ENDPOINT, keys: metricElements },
    { serverRequest: endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT, keys: metricUsageElements },
    { serverRequest: endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT, keys: metricUsageFlavorElements, selector:'flavorusage' },
]
/**New */

/**
 * 
 * @param {*} data request data
 * @param {*} list extracts specific cloudlet data
 * @returns cloudlet metric data
 */
export const cloudletMetrics = (self, data, list) => {
    let requestData = pick(data, [localFields.region, localFields.starttime, localFields.endtime, localFields.selector, localFields.numsamples])
    if (list) {
        requestData.cloudlets = list
    }
    else {
        requestData.cloudlet = {
            organization: data[localFields.organizationName] ? data[localFields.organizationName] : data[localFields.operatorName]
        }
    }
    return { method: endpoint.CLOUDLET_METRICS_ENDPOINT, data: requestData, keys: cloudletMetricsKeys }
}

export const cloudletUsageMetrics = (self, data, specific = false) => {
    let requestData = pick(data, [localFields.region, localFields.starttime, localFields.endtime, localFields.selector, localFields.numsamples])
    requestData.cloudlet = cloudletKeys(data, specific ? undefined : CK_ORG)
    let keys = data.selector === 'flavorusage' ? cloudletFlavorMetricsKeys : cloudletMetricsKeys
    return { method: endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT, data: requestData, keys }
}

export const cloudletFlavorUsageMetrics = (data, org) => {
    return { method: endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT, data: data, keys: cloudletFlavorMetricsKeys }
}

