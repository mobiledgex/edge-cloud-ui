const mapObject = (currentObject, serverField) => {
    if (currentObject && serverField) {
        let fields = serverField.split('#OS#');
        let length = fields.length;
        for (let i = 0; i < length - 1; i++) {
            currentObject = currentObject[fields[i]] ? currentObject[fields[i]] : {}
        }
        return currentObject[fields[length - 1]]
    }
}

export const generateUUID = (keys, data) => {
    let key = ''
    keys.map(item => {
        if (item.key) {
            key = key + data[item.field]
        }
    })
    return key
}

export const map = (value, currentObject, keys) => {
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (key && key.serverField) {
            if (key.keys) {
                let childArray = []
                let data = currentObject[key.serverField];
                if (data && data.length > 0) {
                    for (let j = 0; j < data.length; j++) {
                        let childValue = {}
                        map(childValue, data[j], key.keys)
                        childArray.push(childValue)
                    }
                }
                value[key.field] = childArray;
            }
            else {
                let updatedData = mapObject(currentObject, key.serverField);
                if (updatedData) {
                    if (typeof updatedData === 'boolean') {
                        value[key.field] = updatedData
                    }
                    else {
                        value[key.field] = updatedData ? updatedData : key.defaultValue
                    }
                }
            }
        }
    }
    return value
}