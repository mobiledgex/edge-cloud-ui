import { toJson } from "../../utils/json_util";
import uuid from 'uuid'
import { generateUUID, map } from "./shared";

export const formatShowData = (request, response, customData, isUnique, self = null) => {
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
                        if (keys) {
                            map(value, data, keys)
                        }
                        else {
                            value = data
                        }
                        if (requestData && value.region === undefined) { value.region = requestData.region }
                        value.uuid = keys ? (isUnique) ? generateUUID(keys, value) : uuid() : undefined
                        let newValue = customData ? customData(request, value, self) : value
                        if (newValue) {
                            if (keys.length === 1) {
                                newValue = newValue[keys[0].field]
                            }
                            values.push(newValue)
                        }
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