import * as serviceMC from './serviceMC';


const getToken = ()=>
{
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    return store.userToken
}

const processData = (mcRequest)=>
{
    let dataList = [];
    if(mcRequest.response)
    {
        let response  = mcRequest.response;
        if(response.data)
        {
            let data = response.data
            if(data.length>0)
            {
                dataList = data
            }
        }
    }
    return dataList;
}

export const getOrganizationInfo = async (self) => {
    let requestData = { token: getToken(), method: serviceMC.getEP().SHOW_ORG };
    let mcRequest = await serviceMC.sendSyncRequest(self, requestData)
    return processData(mcRequest)
}

export const getCloudletInfo = async (self, data) => {
        let requestData = { token: getToken(), method: serviceMC.getEP().SHOW_CLOUDLET, data: data };
        let mcRequest = await serviceMC.sendSyncRequest(self, requestData)
        return processData(mcRequest)
}

