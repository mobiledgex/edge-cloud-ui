import { service } from "../../../services";

export const fetchDataFromServer = (self, requestTypeList, filter) => {
    let requestList = [];
    for (const requestType of requestTypeList) {
        let request = requestType(self, Object.assign({}, filter))
        if (request) {
            requestList.push(request);
        }
    }
    return service.multiAuthSyncRequest(self, requestList)
}