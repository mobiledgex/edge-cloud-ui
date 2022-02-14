import { fields } from "../../../services";

export const sequence = [
    { label: 'Region', active: false, field: fields.region },
    { label: 'Operator', active: false, field: fields.operatorName },
    { label: 'Cloudlet', active: false, field: fields.cloudletName },
    { label: 'Cluster Developer', active: false, field: fields.clusterdeveloper },
    { label: 'Cluster', active: false, field: fields.clusterName },
    { label: 'App Developer', active: false, field: fields.appDeveloper },
    { label: 'App', active: false, field: fields.appName },
]