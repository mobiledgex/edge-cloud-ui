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