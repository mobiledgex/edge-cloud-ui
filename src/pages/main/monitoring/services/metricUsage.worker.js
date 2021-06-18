/* eslint-disable */

import { fields } from "../../../../services/model/format"

const VALUES = 'values'
const TAGS = 'tags'

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

const nGrouper = (parent, key, value, columns, selections, levellength, level) => {
    parent[key] = parent[key] ? parent[key] : {}
    parent[key][VALUES] = parent[key][VALUES] ? parent[key][VALUES] : level < levellength ? {} : []
    if (!parent[key][TAGS]) {
        let tags = {}
        value.forEach((item, i) => {
            const column = columns[i]
            if (column && column.groupBy === level) {
                tags[column.field] = item
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
        parent[key][TAGS] = tags
    }
    if (level < levellength) {
        let nextKey = generateKey(columns, value, level + 1)
        parent[key][VALUES][nextKey] = nGrouper(parent[key][VALUES], nextKey, value, columns, selections, levellength, level + 1)[nextKey]
    }
    else {
        let values = {}
        value.forEach((item, i) => {
            const column = columns[i]
            if (column && column.groupBy === undefined) {
                values[column.field] = item
            }
        })
        parent[key][VALUES].push(values)
    }
    return parent
}

const grouper = (dataList, columns, selections, levellength, level = 1) => {
    let parent = {}
    dataList.forEach(item => {
        let key = generateKey(columns, item, level)
        parent = nGrouper(parent, key, item, columns, selections, levellength, level)

    })
    return parent
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
    self.postMessage({ data: formatted })
}
export const format = (worker) => {
    formatMetricUsage(worker)
}

self.addEventListener("message", (event) => {
    format(event.data)
});