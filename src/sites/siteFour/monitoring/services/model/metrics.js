/*
review @Rahul
*/
import _ from "lodash";
import { getClusterInstList } from "../../../../../services/model/clusterInstance";


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
