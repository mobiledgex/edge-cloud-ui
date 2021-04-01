import { fields } from "./format";

export const cloudletPoolMetricsListKeys = [
    { field: fields.region, label: 'Region', sortable: true, visible: false, groupBy: true  },
    { field: fields.poolName, label: 'Cloudlet', sortable: true, visible: true, groupBy: true, customData:true  },
    { field: fields.cloudlets, label: 'Cloudlets', sortable: true, visible: true }
]