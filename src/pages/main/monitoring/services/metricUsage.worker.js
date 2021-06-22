/* eslint-disable */
import { CON_TAGS, CON_TOTAL, CON_VALUES } from "../../../../helper/constant/perpetual"
import { fields } from "../../../../services/model/format"
import { center } from "../../../../utils/math_utils"

const formatColumns = (columns, keys) => {
    let newColumns = []
    keys.forEach(key => {
        const index = columns.indexOf(key.serverField)
        if (key.serverField) {
            newColumns[index] = { ...key, index }
        }
    })
    return newColumns
}

const generateKey = (columns, value, level) => {
    let key = ''
    columns.forEach((item, i) => {
        if (item.groupBy === level) {
            if (key.length > 0) {
                key = key + '_'
            }
            key = key + value[i]
        }
    })
    return key.toLowerCase()
}

const formatTile = (tags, item) => {
    const tiles = item.split('_')
    let geo1 = undefined
    let geo2 = undefined
    tiles.forEach((tile, i) => {
        if (i === 2) {
            tags['length'] = tile
        }
        else {
            const cords = tile.split(',')
            if (geo1 === undefined) {
                geo1 = [cords[1], cords[0]]
            }
            else if (geo2 === undefined) {
                geo2 = [cords[1], cords[0]]
            }
        }
    })
    tags[fields.location] = center(...geo1, ...geo2)
}

const sumLatency = (columns, total, values, isObject) => {
    if (total) {
        columns.forEach(column => {
            if (column.sum) {
                total[column.field] = total[column.field] + (isObject ? values[column.field] : values[column.index])
            }
        })
    }
    else {
        total = {}
        columns.forEach(column => {
            if (column.sum) {
                total[column.field] = isObject ? values[column.field] : values[column.index]
            }
        })
    }
   
    return total
}

const nGrouper = (connector, parent, key, value, columns, selections, levellength, level) => {
    parent[key] = parent[key] ? parent[key] : {}
    parent[key][CON_VALUES] = parent[key][CON_VALUES] ? parent[key][CON_VALUES] : level < levellength ? {} : []
    if (!parent[key][CON_TAGS]) {
        let tags = {}
        value.forEach((item, i) => {
            const column = columns[i]
            if (column && column.groupBy === level) {
                if (column.field === fields.locationtile) {
                    formatTile(tags, item)
                    const location = tags[fields.location]
                    connector.push([location.lat, location.lng])
                }
                else {
                    tags[column.field] = item
                }
            }
        })
        if (level === 1) {
            let selection = undefined
            for (const item of selections) {
                let valid = true
                for (const column of columns) {
                    if (column && column.groupBy === level) {
                        valid = tags[column.field] === item[column.field]
                        if (!valid) {
                            break;
                        }
                    }
                }
                if (valid) {
                    selection = item
                    break;
                }
            }
            tags[fields.cloudletLocation] = selection[fields.cloudletLocation]
        }

        parent[key][CON_TAGS] = tags
    }
    if (level < levellength) {
        let nextKey = generateKey(columns, value, level + 1)
        parent[key][CON_VALUES][nextKey] = nGrouper(connector, parent[key][CON_VALUES], nextKey, value, columns, selections, levellength, level + 1)[nextKey]
        parent[key][CON_TOTAL] = sumLatency(columns, parent[key][CON_TOTAL], value)
    }
    else {
        let values = {}
        value.forEach((item, i) => {
            const column = columns[i]
            if (column && column.groupBy === undefined) {
                values[column.field] = item
            }
        })
        parent[key][CON_VALUES].push(values)
        parent[key]['total'] = sumLatency(columns, parent[key][CON_TOTAL], value)
    }
    return parent
}

const grouper = (dataList, columns, selections, levellength, level = 1) => {
    let parent = {}
    let connectors = {}
    dataList.forEach(item => {
        let connector = []
        let key = generateKey(columns, item, level)
        parent = nGrouper(connector, parent, key, item, columns, selections, levellength, level)
        if (connectors[key] === undefined) {
            let cloudletLocation = parent[key][CON_TAGS][fields.cloudletLocation]
            connectors[key] = [[cloudletLocation[fields.latitude], cloudletLocation[fields.longitude]]]
        }
        connectors[key].push(...connector)
    })

    let appLatency = undefined
    Object.keys(parent).forEach(key=>{
        appLatency = sumLatency(columns, appLatency, parent[key][CON_TOTAL], true)
    })
    return { data:parent, connectors, appLatency }
}

const formatMetricUsage = (worker) => {
    const { request, response, selections } = worker
    let formatted
    if (response && response.data && response.data.data) {
        const dataList = response.data.data;
        if (dataList && dataList.length > 0) {
            const series = dataList[0].Series
            const messages = dataList[0].messages
            if (series && series.length > 0) {
                const keys = request.keys
                const requestData = request.data
                for (const data of series) {
                    const values = data.values
                    const columns = formatColumns(data.columns, keys)
                    formatted = grouper(values, columns, selections, 3)
                    break;
                }
            }
        }
    }
    self.postMessage({ ...formatted})
}
export const format = (worker) => {
    formatMetricUsage(worker)
}

self.addEventListener("message", (event) => {
    format(event.data)
});