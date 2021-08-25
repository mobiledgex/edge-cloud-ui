

export const formatCloudletPropsData = (request, response) => {
    let values = [];
    if (response && response.status === 200) {
        try {
            if (response.data && response.data.properties) {
                let dataObject = response.data.properties
                let keys = Object.keys(dataObject)
                for (const key of keys) {
                    let data = dataObject[key]
                    if (!Boolean(data.internal)) {
                        values.push({ ...data, key })
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