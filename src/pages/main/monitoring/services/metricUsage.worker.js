/* eslint-disable */
import { CON_TAGS, CON_TOTAL, CON_VALUES } from "../../../../helper/constant/perpetual"
import { fields } from "../../../../services/model/format"
import { center } from "../../../../utils/math_utils"
import { fetchColorWithElimination } from "../../../../utils/color_utils"
import { generateColor, severityHexColors } from "../../../../utils/heatmap_utils"
import { _avg, _min, _max } from "../../../../helper/constant/operators"

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
            let value = isObject ? values[column.field] : values[column.index]
            if (column.sum) {
                total[column.field] = total[column.field] + value
            }
            else if (column.concat) {
                total[column.field] = [...total[column.field], value]
            }
        })
    }
    else {
        total = {}
        columns.forEach(column => {
            let value = isObject ? values[column.field] : values[column.index]
            if (column.sum) {
                total[column.field] = value
            }
            else if (column.concat) {
                total[column.field] = [value]
            }
        })
    }
    return total
}

const nGrouper = (parent, key, value, columns, selections, levellength, level) => {
    parent[key] = parent[key] ? parent[key] : {}
    parent[key][CON_VALUES] = parent[key][CON_VALUES] ? parent[key][CON_VALUES] : level < levellength ? {} : []
    if (!parent[key][CON_TAGS]) {
        let tags = {}
        value.forEach((item, i) => {
            const column = columns[i]
            if (column && column.groupBy === level) {
                if (column.field === fields.locationtile) {
                    formatTile(tags, item)
                }
                else {
                    tags[column.field] = item
                }
            }
        })
        if (level === 2) {
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
            const location = selection[fields.cloudletLocation]
            tags[fields.cloudletLocation] = location
        }

        parent[key][CON_TAGS] = tags
    }
    if (level < levellength) {
        let nextKey = generateKey(columns, value, level + 1)
        parent[key][CON_VALUES][nextKey] = nGrouper(parent[key][CON_VALUES], nextKey, value, columns, selections, levellength, level + 1)[nextKey]
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
    let slider = []
    dataList.forEach(item => {
        let key = generateKey(columns, item, level)
        parent = nGrouper(parent, key, item, columns, selections, levellength, level)
    })

    let colors = fetchColorWithElimination(selections.length, severityHexColors)
    let usedColors = {}
    let starttime = undefined
    Object.keys(parent).forEach((key, j) => {
        const appInstObject = parent[key][CON_VALUES]
        const time = parent[key][CON_TAGS].time.toLowerCase()
        if (starttime === undefined) {
            starttime = time
        }
        const total = parent[key][CON_TOTAL]
        const avg = _avg(total['avg'])
        const min = _min(total['min'])
        const max = _max(total['max'])
        slider.push({ value: j, label: time, avg, color_avg: generateColor(avg), min, color_min: generateColor(min), max, color_max: generateColor(max) })
        let appInstKeys = Object.keys(appInstObject)
        appInstKeys.forEach((appInstKey, i) => {
            let color = colors[i]
            if(usedColors[appInstKey])
            {
                color = usedColors[appInstKey]
            }
            else
            {
                usedColors[appInstKey] = colors[i]
                colors.splice(i, 1)
            }
            appInstObject[appInstKey][CON_TAGS].color = color
        })
    })
    
    // for (let i = 1; i < 100; i++) {
    //     slider.push({ value: i, label: '2021-05-13t01:00:00z', color_avg: generateColor(i), color_min: generateColor(3),color_max: generateColor(i)  })
    // }
    return { data: parent, slider, starttime }
}

const mergeData = (data)=>{
    let {columns, values, tags} = data
    const tagKeys = Object.keys(tags)
    const tagValues = tagKeys.map(key=>{
        if(key === 'datanetworktype')
        {
            return tags[key].replace('NETWORK_TYPE_', '')
        }
        return tags[key]
    })
    columns = [...columns, ...tagKeys]
    values = values.map(value => {
        value = [...value, ...tagValues]
        return value
    })
    return { columns, values }
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
                let mergedData = {values:[]}
                for (const data of series) {
                    const {columns, values} = mergeData(data)
                    mergedData.columns = columns
                    mergedData.values = [...mergedData.values, ...values]
                }
                const columns = formatColumns(mergedData.columns, keys)
                formatted = grouper(mergedData.values, columns, selections, 3)
            }
        }
    }
    self.postMessage({ ...formatted })
}
export const format = (worker) => {
    formatMetricUsage(worker)
}

self.addEventListener("message", (event) => {
    format(event.data)
});