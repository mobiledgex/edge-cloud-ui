import { generateDataset, generateDataset2 } from './chart';
import moment from 'moment'
import momentTimezone from "moment-timezone";
import { darkColors } from '../../../../utils/color_utils';

const FLAVOR_USAGE_TIME = 0
const FLAVOR_USAGE_CLOUDLET = 2
const FLAVOR_USAGE_OPERATOR = 3
const FLAVOR_USAGE_COUNT = 4
const FLAVOR_USAGE_FLAVOR = 5

const utcTime = (format, date) => {
    return moment(date).utc().format(format)
}

const flavorChartData = (region, legend, metric, selection, dataList, timezone) => {
    let result = {}
    dataList.forEach(value => {
        let key = `${region}_${value[FLAVOR_USAGE_CLOUDLET]}_${value[FLAVOR_USAGE_OPERATOR]}`.toLowerCase()
        if (selection.count === 0 || selection[key]) {
            let time = utcTime('YYYY-MM-DD HH:mm:ss', value[FLAVOR_USAGE_TIME], timezone)
            if (result[time]) {
                result[time]['y'] = value[FLAVOR_USAGE_COUNT] + result[time]['y']
            }
            else {
                result[time] = { x: moment.tz(value[FLAVOR_USAGE_TIME], timezone).valueOf(), y: value[FLAVOR_USAGE_COUNT] }
            }
        }
    })
    let timeList = []
    Object.keys(result).forEach(item => {
        if (result[item]) {
            timeList.push(result[item])
        }
    })
    if(timeList.length > 0)
    {
        return generateDataset2(legend, legend.tags, metric, timezone, timeList, ['flavorName'])
    }
}

export const processFlavorSelection = (worker) => {
    const { region, resource, selection, legends, values, timezone } = worker
    let datasets = {}
    let keys = Object.keys(legends)
    keys.forEach((key, i) => {
        let data = flavorChartData(region, legends[key], resource, selection, values[key], timezone)
        if (data) {
            datasets[key] = data
        }
    })
    return datasets
}

export const processFlavorData = (worker) => {
    const { data, legends, selection, timezone, metric, region } = worker
    if (data.values) {
        const { values } = data
        let flavorLegends = {}
        let columns = data.columns.filter(item => item !== undefined)
        let keys = Object.keys(values)
        let datasets = {}
        if (keys && keys.length > 0) {
            let colors = darkColors(keys.length)
            keys.forEach((key, i) => {
                let tags = {flavorName: values[key][0][FLAVOR_USAGE_FLAVOR]}
                flavorLegends[key] = { color: colors[i], sorted:true, tags }
                columns.map((column, j) => {
                    flavorLegends[key][column.serverField] = values[key][0][j]
                })
                datasets[key] = flavorChartData(region, flavorLegends[key], metric, selection, values[key], timezone)
            })
        }
        return {resourceType: metric, region, datasets, values, legends:flavorLegends}
    }
}