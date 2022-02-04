import { fields } from "../.."

export const customize = (request, value) => {
    value[fields.registered] = value[fields.registered] ? value[fields.registered] : false
    let location = value[fields.cloudletLocation]
    if (location) {
        location = location.split(',')
        value[fields.cloudletLocation] = {
            latitude: location[0],
            longitude: location[1]
        }
    }
    return value
}