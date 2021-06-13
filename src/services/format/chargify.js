import { map } from "./shared";

export const formatChargifyData = (request, response, customData) => {
    let values = [];
    try {
        if (response.data) {
            let invoices = response.data
            if (invoices) {
                const keys = request.keys
                for (let data of invoices) {
                    let value = {}
                    map(value, data, keys)
                    let newValue = customData ? customData(request, value) : value
                    if (newValue) {
                        values.push(newValue)
                    }
                }
            }
            else {
                let data = response.data
                let value = {}
                map(value, data, keys)
                let newValue = customData ? customData(request, value) : value
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