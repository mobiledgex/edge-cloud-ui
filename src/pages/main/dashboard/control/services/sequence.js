
import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLUSTER_INST } from "../../../../../services/endpoint";
import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION } from "../../../../../helper/constant/perpetual";
import * as serverFields from "../../../../../helper/formatter/serverFields";
import { localFields } from "../../../../../services/fields";

/**
 * alerts array order indicates priority with last index indicates high priority
 */

const cloudletAlerts = [{ field: localFields.state, states: [{ values: [serverFields.READY] }, { type: 'transient', color: '#FFA000', values: [serverFields.CREATING, serverFields.DELETING] }] }]
const clusterAlerts = [{ field: localFields.state, states: [{ values: [serverFields.READY] }, { type: 'transient', color: '#FFA000', values: [serverFields.CREATING, serverFields.DELETING] }] }]
const appInstAlerts = [{ field: localFields.healthCheck, states: [{ values: [serverFields.OK] }] }]

export const sequence = [
    { label: 'Region', active: false, field: localFields.region },
    { label: 'Operator', active: false, field: localFields.operatorName },
    { label: 'Cloudlet', active: false, field: localFields.cloudletName, alerts: cloudletAlerts },
    { label: 'Developer', active: false, field: localFields.clusterdeveloper },
    { label: 'Cluster', active: false, field: localFields.clusterName, alerts: clusterAlerts },
    // { label: 'App Developer', active: false, field: localFields.appDeveloper },
    { label: 'App', active: false, field: localFields.appName, alerts: appInstAlerts },
]

export const dataForms = [
    {
        method: SHOW_APP_INST,
        field: localFields.appName,
        fields: [localFields.cloudletName, localFields.operatorName, localFields.clusterName, localFields.clusterdeveloper, [localFields.state, localFields.healthCheck], localFields.organizationName],
        alerts: [{ field: localFields.state, values: [serverFields.READY] }],
        skip: [{ field: localFields.appName, values: [MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION] }]
    },
    {
        method: SHOW_CLUSTER_INST,
        field: localFields.clusterName, //field is grouped with array in fields
        fields: [localFields.cloudletName, localFields.organizationName, [localFields.state], localFields.operatorName],
        alerts: [{ field: localFields.state, values: [serverFields.READY] }]
    },
    {
        method: SHOW_CLOUDLET,
        field: localFields.cloudletName,
        fields: [[localFields.state], localFields.operatorName],
        alerts: [{ field: localFields.state, values: [serverFields.READY] }, { type: 'Transient', field: localFields.state, values: [serverFields.CREATING] }]
    }
]