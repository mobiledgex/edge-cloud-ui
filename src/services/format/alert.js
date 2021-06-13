import { map } from "./shared";
import uuid from 'uuid'

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
                value.uuid = uuid()
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