import * as AppInstAPI from "../../../../../services/model/appInstance";
/**
 * AppInstAPI : @Rahul's service model
 * @param {*} self
 * @param {*} param
 */
const concatResponse = [];
const newResponse = [];
let resCount = 100;
// const getMethodClient = (self, params) => {
//     let execrequest = getArgs({
//         region: "EU",
//         appinst: {
//             app_key: {
//                 organization: "VenkyDev",
//                 name: "GithubDeploy",
//                 version: "1.0"
//             }
//         },
//         method: "FindCloudlet",
//         selector: "api",
//         last: 1
//     });

//     let requestData = {
//         token: token,
//         method: serviceMC.getEP().METHOD_CLIENT,
//         data: execrequest
//     };

//     return requestData;
// };


/** *****************************************
 * LIST OF INSTANCE
 ** ***************************************** */
const parseData = (response, type) => ({
    [type]: response
});
export const getAppinstanceList = async (self, params) => {
    if (params && params.regions) {
        resCount = params.regions.length;
        return Promise.all(
            params.regions.map(async _region => parseData(await AppInstAPI.getAppInstList(self, { region: _region }), "AppinstList"))
        );
    }
};


/** *****************************************
 * METRICS
 * // return await serviceMC.sendSyncRequest(
        //     self,
        //     getMethodClient(defaultValue.self, defaultValue)
        // );
 ******************************************* */

const metricFromServer = async (self, data) => {
    const requestData = {
        token: data.token,
        method: data.method,
        data: {
            region: data.pRegion,
            cloudlet: {
                organization: data.selectOrg,
                name: data.cloudletSelectedOne
            },
            last: data.last,
            selector: "*"
        }
    };
    const response = await serverData.sendRequest(self, requestData);
    return parseData(response, data.selectOrg + "/" + data.cloudletSelectedOne);
};
export const getAppinstMetrics = async (self, params) => await metricFromServer(self, params);
