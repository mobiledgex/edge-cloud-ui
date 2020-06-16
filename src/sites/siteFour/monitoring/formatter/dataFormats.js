/**
* setdataPart
* Format drawing for plotly.js chart
*/
import isEqual from "lodash/isEqual";
import * as DataType from "./dataType";
import * as Util from "../../../../utils";

const setdataPart = (data, req, cloudlet, cloudletIdx, appinstPath, method, methodIdx) => {
    const seriesX = [];
    const seriesY = [];
    const names = [];
    const appinsts = [];
    const time = 0;
    data.map((item, i) => {
        if (item[cloudletIdx] === cloudlet && item[methodIdx] === method) {
            seriesX.push(item[time]);
            seriesY.push(item[req]);
            names.push(item[cloudletIdx]);
            appinsts.push(appinstPath);
        }
    });

    return {
        x: seriesX, y: seriesY, names, appinsts
    };
};
const setdataPartSum = (data, req, cloudlet, cloudletIdx, method, methodIdx) => {
    const seriesX = [];
    const seriesY = [];
    const names = [];
    const time = 0;
    if (data && data.length > 0) {
        data.map((item, i) => {
            if (item[cloudletIdx] === cloudlet && item[methodIdx] === method) {
                seriesX.push(item[time]);
                seriesY.push(item[req]);
                names.push(item[cloudletIdx]);
            }
        });
    }

    return { x: [Math.max(...seriesX)], y: [Math.max(...seriesY)], names };
};

const createSeries = (resSeries, idx) => {
    const series = [];
    resSeries.map(value => {
        series.push(value[idx]);
    });
    return series;
};

const createTimes = (data, req, cloudlet, cloudletIdx, method, methodIdx) => {
    const seriesX = [];
    data.map((item, i) => {
        if (item[cloudletIdx] === cloudlet && item[methodIdx] === method) {
            seriesX.push(item[0]);
        }
    });
    return seriesX;
};

const createObjects = (resSeries, idx) => {
    const method = [];
    resSeries.map(value => {
        method.push(value[idx]);
    });
    return [...new Set(method)]; /* to avoid duplicated */
};

/*
    resutParse = {
        registClient : [{cloudletA : plotlyFormatData}],
        getAppInstList : [{cloudletB : plotlyFormatData}]
    }
*/
export const parseData = (response, id) => {
    const resData = [];
    let times = [];
    let names = [];
    let methods = [];
    let cloudlets = [];
    const resultParse = {};
    const getCloudlet = (id === DataType.FIND_CLOUDLET) ? "foundCloudlet" : "cloudlet";
    let appinstPath = "";

    if (response && response.values && response.values.length > 0) {
        appinstPath = response.path[0];
        response.values.map(value => {
            const timeIdx = value.resColumns.indexOf("time");
            const methodIdx = value.resColumns.indexOf("method");
            const cloudletIdx = value.resColumns.indexOf(getCloudlet);
            const orgIdx = value.resColumns.indexOf("apporg");
            const reqCount = value.resColumns.indexOf("reqs");
            times = createSeries(value.resSeries, timeIdx);
            names = createSeries(value.resSeries, cloudletIdx);
            methods = createObjects(value.resSeries, methodIdx);
            cloudlets = createObjects(value.resSeries, cloudletIdx);
            resultParse.times = times;
            resultParse.names = names;
            resultParse.methods = methods;
            resultParse.cloudlets = cloudlets;
            methods.map((method, i) => {
                resultParse[method] = [];
                cloudlets.map((cloudlet, j) => {
                    resultParse[method][j] = { [cloudlet]: setdataPart(value.resSeries, reqCount, cloudlet, cloudletIdx, appinstPath, method, methodIdx) };
                });
            });

            resData.push(resultParse);
        });
    } else {
        console.log(" ERROR ::::::::::::::: Faile to request data");
        return resData;
    }

    return resData;
};
const parseCloudletData = response => {
    //
};

const parseCountCluster = response => {
    let concatData = [];
    response.map(res => {
        concatData = concatData.concat(res);
    });
    return Util.groupBy(concatData, "cloudletName");
};

const parseFindCloudlet = response => {
    const cloudlet = {};
    cloudlet.cloudletLocation = { latitude: 1, longitude: 1 };
    return cloudlet;
};

const hideKeys = ["dev", "foundOperator", "id", "inf", "oper", "ver"];
const parseClientList = response => {
    const clientList = [];
    const formatObj = {};
    const keys = response[0] ? response[0].values[0].resColumns : [];
    const values = response[0] ? response[0].values[0].resSeries : [];
    values.map((resData, i) => {
        const newData = {};
        resData.map((res, j) => {
            if (hideKeys.indexOf(keys[j]) === -1) newData[keys[j]] = res;
        });
        clientList.push(newData);
    });
    return clientList;
};


const parseCounterCluster = response => {
    const formatedData = dataFormatCountCluster(response);
    const containerData = [];
    const keys = Object.keys(formatedData);
    keys.map(key => {
        containerData.push({
            data: formatedData[key], count: formatedData[key].length, region: formatedData[key][0].region, cloudlet: key, clusters: formatedData[key]
        });
    });

    return containerData;
};


const parseHealthCloudlet = response => {
    let containerData = {};

    if (response && response.length > 0) {
        let selectedCloudlet = response[0]; // <----- 필터된 클라우드와 비교해서 데이터 select 하도록 해야함.
        const formatedData = selectedCloudlet[0].resData_util[0];
        const vCpuData = { max: formatedData.vCpuUsed.max[0], current: formatedData.vCpuUsed.y[0] }
        const memData = { max: formatedData.memUsed.max[0], current: formatedData.memUsed.y[0] }
        const diskData = { max: formatedData.diskUsed.max[0], current: formatedData.diskUsed.y[0] }

        containerData = { vCpu: vCpuData, mem: memData, disk: diskData }
    }


    return containerData;
};

// running cluster
const setdataPartCluster = (data, req, cloudlet, cloudletIdx, appinstPath, method, methodIdx) => {
    const seriesX = [];
    const seriesY = [];
    const names = [];
    const appinsts = [];
    const time = 0;
    data.map((item, i) => {
        if (item[cloudletIdx] === cloudlet && item[methodIdx] === method) {
            seriesX.push(item[time]);
            seriesY.push(item[req]);
            names.push(item[cloudletIdx]);
            appinsts.push(appinstPath);
        }
    });

    return {
        x: seriesX, y: seriesY, names, appinsts
    };
};
const parseRunningCluster = response => {
    const liveness = [];
    let concatData = [];
    if (response.length > 0) {
        response.map(res => {
            concatData = concatData.concat(res);
        });
    }
    // TODO : 각 클러스터에 따른 master의 개수와 node의 개수

    return { clusters: [{ custerinst: "clusterA", live: 2, ipaccess: 3, cloudlet: "cloudletA" }, { clusterinst: "clusterB", live: 1, ipaccess: 2, cloudlet: "cloudletA" }, { clusterinst: "clusterC", live: 1, ipaccess: 1, cloudlet: "cloudletA" }] };
};


export const dataFormatRateRegist = (response, id) => parseData(response[0], id);
export const dataFormatCountCloudlet = response => setdataPartSum(response);
export const dataFormatMetricCloudlet = response => parseCloudletData(response);
export const dataFormatCountCluster = response => parseCountCluster(response);
export const dataFormaFindCloudlet = response => parseFindCloudlet(response);
export const dataFormatClientList = response => parseClientList(response);
export const dataFormatCounterCluster = response => parseCounterCluster(response);
export const dataFormatHealthCloudlet = response => parseHealthCloudlet(response);
export const dataFormatRunningCluster = response => parseRunningCluster(response);
