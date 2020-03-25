export const toJson = (data) => {
    let toJson = []
    if (data) {
        if (typeof data === 'object') {
            toJson = data.length>0 ? data : [data]
        } else {
            let toArray = data.split('\n')
            toArray.pop();
            toJson = toArray.map((str) => (JSON.parse(str)))
        }
    }
    return toJson
}