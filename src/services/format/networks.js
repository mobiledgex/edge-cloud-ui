import { toJson } from "../../utils/json_util";
import uuid from 'uuid'
import { generateUUID, map } from "./shared";
import { fields } from "..";

export const formatNetworkData = (request, response, customData, isUnique, self = null) => {
    let values = [];
    if (response && response.status === 200) {
        try {
            if (response.data) {
                let dataArray = toJson(response.data);
                if (dataArray && dataArray.length > 0) {
                    const requestData = request.data
                    const keys = request.keys
                    for (let dataObject of dataArray) {
                        let data = dataObject.data ? dataObject.data : dataObject;
                        let value = {}
                        value[fields.operatorName] = data['key']['cloudlet_key']['organization']
                        value[fields.cloudletName] = data['key']['cloudlet_key']['name']
                        value[fields.networkName] = data['key']['name']
                        if (keys) {
                            map(value, data, keys)
                        }
                        if (requestData && value.region === undefined) { value.region = requestData.region }
                        value.uuid = keys ? (isUnique) ? generateUUID(keys, value) : uuid() : undefined
                        values.push(value)
                    }
                }
            }
        }
        catch (e) {
            console.log('Response Error', e)
        }
    }
    return values
}