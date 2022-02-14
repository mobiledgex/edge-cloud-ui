import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLUSTER_INST } from "../../../helper/constant/endpoint";
import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION, OPERATOR } from "../../../helper/constant/perpetual";
import * as serverFields from "../../../helper/formatter/serverFields";
import { fields } from "../../../services";

/**
 * method: method name -> use to filter data from mc response
 * active: indicate active option on sequence funnel
 * field: data field key
 * fieldAlt: if field doesn't match data field key
 * filters:
 * total:
 * format:response data requires formatting
 * skip: skip data from response
 */
export const sequence = [
    {
        label: 'Cloudlet',
        format: true, active: false,
        field: fields.cloudletName,
        filters: { 'operatorName': [[fields.operatorName, 'Name']], 'appName': [fields.cloudletName, fields.operatorName], 'clusterName': [fields.cloudletName, fields.operatorName] },
        method: SHOW_CLOUDLET,
        total: [{ field: fields.state, values: [serverFields.READY] }, { type: 'Transient', field: fields.state, values: [serverFields.CREATING] }]
    },
    {
        label: 'Cluster',
        format: true,
        active: false,
        field: fields.clusterName,
        filters: { 'appName': [fields.clusterName], 'cloudletName': [fields.cloudletName, fields.operatorName] },
        method: SHOW_CLUSTER_INST,
        total: [{ field: fields.state, values: [serverFields.READY] }]
    },
    {
        label: 'App',
        format: true,
        active: false,
        field: fields.appName,
        method: SHOW_APP_INST,
        skip: [{ field: fields.appName, values: [MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION] }],
        filters: { 'cloudletName': [fields.cloudletName, fields.operatorName], 'clusterName': [fields.clusterName] },
        total: [{ field: fields.healthCheck, values: [serverFields.OK] }]
    },
]