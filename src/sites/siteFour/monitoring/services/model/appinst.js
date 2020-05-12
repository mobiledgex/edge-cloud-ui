import * as AppInstAPI from "../../../../../services/model/appInstance";

/**
 * AppInstAPI : @Rahul's service model
 * @param {*} self 
 * @param {*} param 
 */
export const getAppinstanceList = async (self, params) => {
    if (params && params.regions) {
        return Promise.all(
            params.regions.map(async (_region) => {
                return await AppInstAPI.getAppInstList(self, { region: _region });
            })
        );
    }
};