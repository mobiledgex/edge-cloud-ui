/**
* setdataPart
* Format drawing for plotly.js chart
*/
import * as DataType from "../formatter/dataType";
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

    return { x: seriesX, y: seriesY, names, appinsts };
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
const parseCloudletData = (response) => {
    //
}

const parseCountCluster = response => {
    let concatData = [];
    response.map(res => {
        concatData = concatData.concat(res);
    });
    return Util.groupBy(concatData, "cloudletName");
}

const parseFindCloudlet = response => {
    const cloudlet = {};
    cloudlet.cloudletLocation = { latitude: 1, longitude: 1 };
    return cloudlet;
}

export const dataFormatRateRegist = (response, id) => {
    return parseData(response[0], id);
};
export const dataFormatCountCloudlet = response => {
    return setdataPartSum(response);
};
export const dataFormatMetricCloudlet = response => {
    return parseCloudletData(response);
};
export const dataFormatCountCluster = response => {
    return parseCountCluster(response);
};
export const dataFormaFindCloudlet = response => {
    return parseFindCloudlet(response);
};
