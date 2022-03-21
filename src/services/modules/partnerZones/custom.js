import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.registered] = value[localFields.registered] ? value[localFields.registered] : false
    let location = value[localFields.cloudletLocation]
    if (location) {
        location = location.split(',')
        value[localFields.cloudletLocation] = {
            latitude: location[0],
            longitude: location[1]
        }
    }
    return value
}