import _ from "lodash";
import * as serverData from "../../../../../services/model/serverData";
import * as serviceMC from "../../../../../services/model/serviceMC";
import { getClusterInstList } from "../../../../../services/model/clusterInstance";
import { fields } from "../../../../../services/model/format";
import * as ChartType from "../../formatter/chartType";


const regions = localStorage.regions ? localStorage.regions.split(",") : [];
const REGION_ALL = regions;

const dataFromServer = async (_regions, self, _method) => Promise.all(
    _regions.map(async _region => getClusterInstList(self, { method: _method, region: _region }))
);

/** *****************************************************
 * START GET LIST
 ** **************************************************** */
export const getClusterList = async (self, param) => {
    const result = await dataFromServer(REGION_ALL, self, param.method);
    return result;
}
