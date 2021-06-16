import { toJson } from "../../utils/json_util";
import uuid from 'uuid'
import { generateUUID, map } from "./shared";

export const formatShowData = (request, response, customData, isUnique) => {
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
                        map(value, data, keys)
                        if (requestData && value.region === undefined) { value.region = requestData.region }
                        value.uuid = (isUnique) ? generateUUID(keys, value) : uuid()
                        let newValue = customData ? customData(request, value) : value
                        if (newValue) {
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