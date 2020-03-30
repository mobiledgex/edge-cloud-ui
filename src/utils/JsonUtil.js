export const toJson = (data) => {
    let toJson = []
    if (data) {
        if (typeof data === 'object') {
            if(data)
            {
                toJson = Array.isArray(data) ? data : [data]
            }
        } else {
            let toArray = data.split('\n')
            toArray.pop();
            toJson = toArray.map((str) => (JSON.parse(str)))
        }
    }
    return toJson
}

export const newLineToJsonObject = (data) => {
    try {
        let formatedData = {}
        if (data && data.includes('\n')) {
            let dataArray = data.split('\n');
            for (let i = 0; i < dataArray.length; i++) {
                let dataObject = dataArray[i].split(':')
                if (dataObject.length == 2) {
                    formatedData[dataObject[0].trim()] = dataObject[1].trim()
                }
            }
            return formatedData
        }
        return data
    }
    catch (e) {
        console.log('MexError', e)
    }
}