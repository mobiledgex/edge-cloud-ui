import { service } from "../services";

export const fetchDataFromServer = (self, requestTypeList, filter, callback) => {
    let requestList = [];
    for (const requestType of requestTypeList) {
        let request = requestType(self, Object.assign({}, filter))
        if (request) {
            requestList.push(request);
        }
    }
    service.multiAuthRequest(self, requestList, callback)
}