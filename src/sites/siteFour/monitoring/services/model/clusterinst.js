
import * as formatter from "../../../../../services/model/format";
import { getClusterInstList } from "../../../../../services/model/clusterInstance";
import * as serverData from "../../../../../services/model/serverData";
import { SHOW_CLUSTER_INST } from "../../../../../services/model/endPointTypes";
const regions = localStorage.regions ? localStorage.regions.split(",") : [];
const REGION_ALL = regions;

const dataFromServer = async (_regions, self, _method) => Promise.all(
    _regions.map(async _region => getClusterInstList(self, { method: _method, region: _region }))
);

/** *****************************************************
 * START GET LIST
 ** **************************************************** */
export const showClusterInsts = data => {
    if (!formatter.isAdmin()) {
        {
            data.clusterinst = {
                key: {
                    organization: formatter.getOrganization()
                }
            };
        }
    }
    return { method: SHOW_CLUSTER_INST, data };
};
// export const getClusterInst = async (self, param) => {
//     const result = await dataFromServer(REGION_ALL, self, param.method);
//     return result;
// };

export const getClusterInst = async (self, data) => await serverData.showDataFromServer(self, showClusterInsts(data));
