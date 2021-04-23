import * as formatter from './format'
import { CLOUDLET_METRICS_ENDPOINT } from './endPointTypes'
import { CLOUDLET_METRICS_USAGE_ENDPOINT } from './endpoints';
import { UNIT_FLOOR, UNIT_GB, UNIT_KB, UNIT_MB } from '../../sites/main/monitoring/helper/unitConvertor';

let fields = formatter.fields;

export const customData = (id, data) => {
    switch (id) {
        case fields.cloudletName:
            return `${data[fields.cloudletName]} [${data[fields.operatorName]}]`
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
    // { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    // { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true },
    { label: 'Flavor', serverField: 'flavor', visible: true, groupBy: true }
]

export const cloudletMetricsListKeys = [
    { field: fields.region, label: 'Region', sortable: true, visible: false, groupBy: true  },
    { field: fields.cloudletName, label: 'Cloudlet', sortable: true, visible: true, groupBy: true, customData:true  },
    { field: fields.operatorName, label: 'Operator', sortable: true, visible: false, groupBy: true  },
    { field: fields.cloudletLocation, label: 'Location', visible: false  },
    { field: 'cpu', label: 'vCpu Infra Usage', sortable: true, visible: true },
    { field: 'disk', label: 'Disk Infra Usage', sortable: true, visible: true },
    { field: 'memory', label: 'Memory Infra Usage', sortable: true, visible: true },
]

export const utilizationMetricType = [
    { field: 'cpu', serverField: 'utilization', subId: 'vCpuUsed', header: 'vCpu Infra Usage', position: 4, steppedLine:'after' },
    { field: 'memory', serverField: 'utilization', subId: 'memUsed', header: 'Memory Infra Usage', position: 6, unit: UNIT_MB, steppedLine:'after' },
    { field: 'disk', serverField: 'utilization', subId: 'diskUsed', header: 'Disk Infra Usage', position: 8, unit: UNIT_GB, steppedLine:'after' },
]

export const resourceUsageMetricType = [
    { field: 'floatingIpsUsed', serverField: 'floatingIpsUsed', serverHead:'openstack-resource-usage', header: 'Floating IP Used', position: 4, unit:UNIT_FLOOR, steppedLine:'after' },
    { field: 'gpusUsed', serverField: 'gpusUsed', serverHead:'openstack-resource-usage', header: 'GPU Used', position: 5, unit:UNIT_FLOOR, steppedLine:'after' },
    { field: 'instancesUsed', serverField: 'instancesUsed', serverHead:'openstack-resource-usage', header: 'Instances Used', position: 6, unit:UNIT_FLOOR, steppedLine:'after' },
    { field: 'ramUsed', serverField: 'ramUsed', serverHead:'openstack-resource-usage', header: 'RAM Used', position: 7, unit:UNIT_MB, steppedLine:'after' },
    { field: 'vcpusUsed', serverField: 'vcpusUsed', serverHead:'openstack-resource-usage', header: 'vCPUs Used', position: 8, unit:UNIT_FLOOR, steppedLine:'after' },
]

export const cloudletMetricTypeKeys = ()=>([
    { field: 'utilization', serverField: 'utilization', header: 'Memory Usage', keys:utilizationMetricType, serverRequest: CLOUDLET_METRICS_ENDPOINT },
    { field: 'resourceusage', serverField: 'resourceusage', header: 'Resource Usage', keys:resourceUsageMetricType, serverRequest: CLOUDLET_METRICS_USAGE_ENDPOINT },
    { field: 'count', header: 'Flavor Usage'},
    { field: 'map', header: 'Map' },
    { field: 'event', header: 'Event'},
])

export const cloudletMetrics = (data, org) => {
    data.cloudlet = {
        organization: org
    }
    return { method: CLOUDLET_METRICS_ENDPOINT, data: data, keys: cloudletMetricsKeys }
}

export const cloudletUsageMetrics = (data, org) => {
    data.cloudlet = data.cloudlet ? data.cloudlet : {
        organization: org
    }
    data.platformtype = 'openstack'
    return { method: CLOUDLET_METRICS_USAGE_ENDPOINT, data: data, keys: cloudletMetricsKeys }
}

export const cloudletFlavorUsageMetrics = (data, org) => {
    return { method: CLOUDLET_METRICS_USAGE_ENDPOINT, data: data, keys: cloudletFlavorMetricsKeys }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, cloudletMetricsKeys)
}

