
import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLUSTER_INST } from "../../../helper/constant/endpoint";
import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION } from "../../../helper/constant/perpetual";
import * as serverFields from "../../../helper/formatter/serverFields";
import { fields } from "../../../services";

export const sequence = [
    { label: 'Region', active: false, field: fields.region },
    { label: 'Operator', active: false, field: fields.operatorName },
    { label: 'Cloudlet', active: false, field: fields.cloudletName },
    { label: 'Cluster Developer', active: false, field: fields.clusterdeveloper },
    { label: 'Cluster', active: false, field: fields.clusterName },
    // { label: 'App Developer', active: false, field: fields.appDeveloper },
    { label: 'App', active: false, field: fields.appName },
]

export const dataForms = [
    {
        method: SHOW_APP_INST,
        field: fields.appName,
        fields: [fields.cloudletName, fields.operatorName, fields.clusterName, fields.clusterdeveloper, fields.appName, fields.organizationName, fields.state, fields.healthCheck],
        total: [{ field: fields.state, values: [serverFields.READY] }],
        skip: [{ field: fields.appName, values: [MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION] }]
    },
    {
        method: SHOW_CLUSTER_INST,
        field: fields.clusterName,
        fields: [fields.clusterName, fields.organizationName, fields.cloudletName, fields.operatorName, fields.state],
        total: [{ field: fields.state, values: [serverFields.READY] }]
    },
    {
        method: SHOW_CLOUDLET,
        field: fields.cloudletName,
        fields: [fields.cloudletName, fields.operatorName, fields.state],
        total: [{ field: fields.state, values: [serverFields.READY] }, { type: 'Transient', field: fields.state, values: [serverFields.CREATING] }]
    }
]

// import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION, OPERATOR } from "../../../helper/constant/perpetual";
// import * as serverFields from "../../../helper/formatter/serverFields";
// import { fields } from "../../../services";

// /**
//  * method: method name -> use to filter data from mc response
//  * active: indicate active option on sequence funnel
//  * field: data field key
//  * fieldAlt: if field doesn't match data field key
//  * filters:
//  * total:
//  * format:response data requires formatting
//  * skip: skip data from response
//  */
// export const sequence = [
//     {
//         label: 'Operator',
//         active: false,
//         field: fields.operatorName,
//         fixed: true,
//         filters: { 'cloudletName': [fields.operatorName] },
//         method: OPERATOR
//     },
//     {
//         label: 'Cloudlet',
//         active: false,
//         field: fields.cloudletName,
//         filters: { 'operatorName': [[fields.operatorName, 'Name']], 'appName': [fields.cloudletName, fields.operatorName], 'clusterName': [fields.cloudletName, fields.operatorName] },
//         method: SHOW_CLOUDLET,
//         total: [{ field: fields.state, values: [serverFields.READY] }, { type: 'Transient', field: fields.state, values: [serverFields.CREATING] }]
//     },
//     {
//         label: 'Cluster',
//         format: true,
//         active: false,
//         field: fields.clusterName,
//         filters: { 'appName': [fields.clusterName], 'cloudletName': [fields.cloudletName, fields.operatorName] },
//         method: SHOW_CLUSTER_INST,
//         total: [{ field: fields.state, values: [serverFields.READY] }]
//     },
//     {
//         label: 'App',
//         format: true,
//         active: false,
//         field: fields.appName,
//         method: SHOW_APP_INST,
//         skip: [{ field: fields.appName, values: [MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION] }],
//         filters: { 'cloudletName': [fields.cloudletName, fields.operatorName], 'clusterName': [fields.clusterName] },
//         total: [{ field: fields.healthCheck, values: [serverFields.OK] }]
//     },
// ]