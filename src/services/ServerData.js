import * as serviceMC from './serviceMC';


const getToken = ()=>
{
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    return store.userToken
}

export const getCloudletInfo = (self, regions) => {
    return Promise.all(regions.map(async (item, i) => {
        let requestData = { token: getToken(), method: serviceMC.getEP().SHOW_CLOUDLET, data: { region: item } };
        let data = await serviceMC.sendSyncRequest(self, requestData)
        return data
    }))  
}

export const getOrganizationInfo = (self) => {
    let requestData = { token: getToken(), method: serviceMC.getEP().SHOW_ORG };
    let data = await serviceMC.sendSyncRequest(self, requestData)
    return Promise.all(data)
}