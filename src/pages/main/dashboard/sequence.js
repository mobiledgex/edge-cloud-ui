
import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLUSTER_INST } from "../../../helper/constant/endpoint";
import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION } from "../../../helper/constant/perpetual";
import * as serverFields from "../../../helper/formatter/serverFields";
import { fields } from "../../../services";

/**
 * alerts array order indicates priority with last index indicates high priority
 */
export const sequence = [
    { label: 'Region', active: false, field: fields.region },
    { label: 'Operator', active: false, field: fields.operatorName },
    { label: 'Cloudlet', active: false, field: fields.cloudletName, alerts: [{ field: fields.state, states: [{ values: [serverFields.READY] }, { type: 'transient', color: '#FFA000', values: [serverFields.CREATING] }] }] },
    { label: 'Cluster Developer', active: false, field: fields.clusterdeveloper },
    { label: 'Cluster', active: false, field: fields.clusterName, alerts: [{ field: fields.state, states: [{ values: [serverFields.READY] }] }] },
    // { label: 'App Developer', active: false, field: fields.appDeveloper },
    { label: 'App', active: false, field: fields.appName, alerts: [{ field: fields.healthCheck, states: [{ values: [serverFields.OK] }] }] },
]

export const dataForms = [
    {
        method: SHOW_APP_INST,
        field: fields.appName,
        fields: [fields.cloudletName, fields.operatorName, fields.clusterName, fields.clusterdeveloper, [fields.state, fields.healthCheck], fields.organizationName],
        alerts: [{ field: fields.state, values: [serverFields.READY] }],
        skip: [{ field: fields.appName, values: [MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION] }]
    },
    {
        method: SHOW_CLUSTER_INST,
        field: fields.clusterName, //field is grouped with array in fields
        fields: [fields.cloudletName, fields.organizationName, [fields.state], fields.operatorName],
        alerts: [{ field: fields.state, values: [serverFields.READY] }]
    },
    {
        method: SHOW_CLOUDLET,
        field: fields.cloudletName,
        fields: [[fields.state], fields.operatorName],
        alerts: [{ field: fields.state, values: [serverFields.READY] }, { type: 'Transient', field: fields.state, values: [serverFields.CREATING] }]
    }
]