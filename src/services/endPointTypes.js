import * as FormatComputeCloudlet from "./formatter/formatComputeCloudlet";
import * as FormatComputeClstInst from "./formatter/formatComputeClstInstance";
import * as FormatComputeAppInst from "./formatter/formatComputeInstance";

export const SHOW_CLOUDLET = "ShowCloudlet";
export const SHOW_CLUSTER_INST = "ShowClusterInst";
export const SHOW_APP_INST = "ShowAppInst";

export function getPath(request) {
    switch (request.method) {
        case SHOW_CLOUDLET:
        case SHOW_CLUSTER_INST:
        case SHOW_APP_INST:
            return `/api/v1/auth/ctrl/${request.method}`;
        default:
            return null;
    }
}

export function formatData(request, response) {
    let data;
    switch (request.method) {
        case SHOW_CLOUDLET:
            data = FormatComputeCloudlet.formatData(response, request.data);
            break;
        case SHOW_CLUSTER_INST:
            data = FormatComputeClstInst.formatData(response, request.data);
            break;
        case SHOW_APP_INST:
            data = FormatComputeAppInst.formatData(response, request.data);
            break;
        default:
            data = undefined;
    }
    if (data) {
        response.data = data;
    }
    return { request, response };
}
