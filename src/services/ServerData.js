import * as serviceMC from './serviceMC';

export const getCloudletInfo = (self, regions) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    return Promise.all(regions.map(async (item, i) => {
        let requestData = { token: store.userToken, method: serviceMC.getEP().SHOW_CLOUDLET, data: { region: item } };
        let data = await serviceMC.sendSyncRequest(self, requestData)
        return data
    }))  
}