import { uniqueId } from "../../helper/constant/shared";
import { map } from "./shared";

export const formatAlertData = (request, response, customData) => {
    let values = [];
    try {
        if (response && response.status === 200 && response.data) {
            let jsonData = response.data
            const keys = request.keys
            for (let i = 0; i < jsonData.length; i++) {
                let data = jsonData[i].data ? jsonData[i].data : jsonData[i];
                let value = {}
                map(value, data, keys)
                value.uuid = uniqueId()
                let newValue = value && customData ? customData(request, value) : value
                if (newValue) {
                    values.push(newValue)
                }
            }
        }
    }
    catch (e) {
        console.log('Response Error', e)
    }
    return values
}