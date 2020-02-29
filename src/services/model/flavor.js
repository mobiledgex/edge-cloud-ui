
import { fields, formatData } from './format'

const keys = [
    { field: fields.flavorName, serverField: 'key#OS#name' },
    { field: fields.ram, serverField: 'ram' },
    { field: fields.vCPUs, serverField: 'vcpus' },
    { field: fields.disk, serverField: 'disk' },
    { field: fields.gpu, serverField: 'opt_res_map' },
]

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        flavor: {
            key: {
                name: data[fields.flavorName]
            }
        }
    })
}

export const getData = (response, body) => {
    return formatData(response, body, keys)
}
