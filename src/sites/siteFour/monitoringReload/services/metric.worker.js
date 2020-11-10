/* eslint-disable */
import axios from 'axios';
import { maxBy, meanBy, minBy } from 'lodash';
import * as formatter from '../../../../services/model/format'
import randomColor from 'randomcolor'
import { unit } from '../../../../utils/math_util'

self.addEventListener("message", processWorker);

const fields = formatter.fields
const SHOW_APP_INST = "ShowAppInst";
const SHOW_CLOUDLET = "ShowCloudlet";
const SHOW_ORG_CLOUDLET = "orgcloudlet";
const SHOW_CLUSTER_INST = "ShowClusterInst";
const CLOUDLET_METRICS_ENDPOINT = 'metrics/cloudlet';
const APP_INST_METRICS_ENDPOINT = 'metrics/app';
const CLUSTER_METRICS_ENDPOINT = 'metrics/cluster';


function getPath(request) {
    switch (request.method) {
        case CLOUDLET_METRICS_ENDPOINT:
        case APP_INST_METRICS_ENDPOINT:
        case CLUSTER_METRICS_ENDPOINT:
            return `/api/v1/auth/${request.method}`
        case SHOW_CLOUDLET:
        case SHOW_APP_INST:
        case SHOW_CLUSTER_INST:
            return `/api/v1/auth/ctrl/${request.method}`;
        case SHOW_ORG_CLOUDLET:
            return `/api/v1/auth/orgcloudlet/show`;
        default:
            return null;
    }
}

function customData(value) {
    return value
}

function formatData(request, response) {
    let data = undefined;
    switch (request.method) {
        case APP_INST_METRICS_ENDPOINT:
        case CLUSTER_METRICS_ENDPOINT:
        case CLOUDLET_METRICS_ENDPOINT:
            data = formatter.formatEventData(response, request.data, request.keys)
            break;
        case SHOW_APP_INST:
        case SHOW_CLUSTER_INST:
        case SHOW_ORG_CLOUDLET:
        case SHOW_CLOUDLET:
            data = formatter.formatData(response, request.data, request.keys, customData, true)
            break;

    }
    return data
}

function fetchData(requestList) {
    let promise = []
    requestList.map((request) => {
        promise.push(axios.post(getPath(request), request.data,
            {
                headers: { 'Authorization': `Bearer ${request.token}` }
            }))
    })
    axios.all(promise)
        .then(function (responseList) {
            let formattedResponseList = [];
            responseList.map((response, i) => {
                let request = requestList[i]
                formattedResponseList.push({ request, data: formatData(request, response) });
            })
            self.postMessage(formattedResponseList)
        })
}

const metricKeyGenerator = (parentId, region, metric) => {
    return `${parentId}-${metric.serverField}${metric.subId ? `-${metric.subId}` : ''}-${region}`
}

export const fetchLocation = (parentId, avgValues, metricData, showList) => {
    for (let i = 0; i < showList.length; i++) {
        let show = showList[i]
        let valid = false
        if (parentId === 'appinst') {
            valid = metricData.includes(show[fields.region]) &&
                metricData.includes(show[fields.appName].toLowerCase()) &&
                metricData.includes(show[fields.organizationName]) &&
                metricData.includes(show[fields.clusterName]) &&
                metricData.includes(show[fields.clusterdeveloper]) &&
                metricData.includes(show[fields.cloudletName]) &&
                metricData.includes(show[fields.operatorName])
        }
        else {
            valid = metricData.includes(show[fields.region]) &&
                metricData.includes(show[fields.cloudletName]) &&
                metricData.includes(show[fields.operatorName])
        }
        if (valid) {
            avgValues['location'] = show[fields.cloudletLocation]
            avgValues['showData'] = show
        }
    }
    return avgValues
}

const avgCalculator = (avgData, parentId, data, region, metric, showList) => {
    Object.keys(data.values).map(key => {
        let value = data.values[key][0]

        let avg = meanBy(data.values[key], v => (v[metric.position]))
        let max = maxBy(data.values[key], v => (v[metric.position]))[metric.position]
        let min = minBy(data.values[key], v => (v[metric.position]))[metric.position]

        let avgValues = avgData[parentId][region][key]

        if (avgValues === undefined) {
            avgValues = {}
            data.columns.map((column, i) => {
                avgValues[column.serverField] = value[i]
            })
            avgValues['color'] = randomColor({
                count: 1,
            })[0]

            // if (getUserRole().includes(DEVELOPER)) {
            //     if (key.includes('envoy')) {
            //         avgValues['disabled'] = true
            //     }
            // }
            avgValues['selected'] = false
            avgValues = fetchLocation(parentId, avgValues, value, showList)
        }

        let avgUnit = metric.unit ? unit(metric.unit, avg) : avg
        let maxUnit = metric.unit ? unit(metric.unit, avg) : max
        let minUnit = metric.unit ? unit(metric.unit, avg) : min
        avgValues[metric.field] = [avgUnit, minUnit, maxUnit]
        avgData[parentId][region][key] = avgValues
    })
}

function processRequest(data) {
    let metricDataList = data.metric
    let showList = data.show
    let parentId = data.parentId
    let region = data.region
    let metricTypeKeys = data.metricTypeKeys

    let chartData = {}
    chartData[parentId] = chartData[parentId] ? chartData[parentId] : {}
    chartData[parentId][region] = chartData[parentId][region] ? chartData[parentId][region] : {}

    let avgData = {}
    avgData[parentId] = avgData[parentId] ? avgData[parentId] : {}
    avgData[parentId][region] = avgData[parentId][region] ? avgData[parentId][region] : {}

    if (metricDataList && metricDataList.length > 0) {
        metricDataList.map(metricData => {
            let key = Object.keys(metricData)[0]
            metricTypeKeys.map(metric => {
                let objectId = `${parentId}-${metric.serverField}`
                if (key === objectId) {
                    if (metricData[objectId]) {
                        let newData = {}
                        newData.region = region
                        newData.metric = metric
                        newData.values = metricData[objectId].values
                        newData.columns = metricData[objectId].columns
                        let metricKey = metricKeyGenerator(parentId, region, metric)
                        chartData[parentId][region][metricKey] = newData
                        avgCalculator(avgData, parentId, newData, region, metric, showList)
                    }
                }
            })
        })
    }
    self.postMessage({ chartData, avgData })
}

function processWorker(event) {
    let data = event.data
    switch (data.type) {
        case 'server':
            fetchData(data.request)
            break;
        case 'process':
            processRequest(data)
            break;
    }

}