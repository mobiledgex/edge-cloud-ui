/**
* setdataPart
* Format drawing for plotly.js chart
*/
const setdataPart = (data, req, cloudlet, cloudletIdx, method, methodIdx) => {
    const setted = {};
    const seriesX = [];
    const seriesY = [];
    const time = 0;
    data.map((item, i) => {
        if (item[cloudletIdx] === cloudlet && item[methodIdx] === method) {
            seriesX.push(item[time]);
            seriesY.push(item[req]);
        }
    });

    return seriesY;
};

const createSeries = (resSeries, idx) => {
    const series = [];
    resSeries.map(value => {
        series.push(value[idx]);
    });
    return series;
};

const createObjects = (resSeries, idx) => {
    const method = [];
    resSeries.map(value => {
        method.push(value[idx]);
    });
    return [...new Set(method)]; /* to avoid duplicated */
};

export const dataFormatRateRegist = response => {
    const resData = [];
    let times = [];
    let names = [];
    let methods = [];
    let cloudlets = [];
    const resultParse = {};

    if (response && response.values && response.values.length > 0) {
        console.log("20200516 format rate of regist .. ", response.values.length, ":", response.values);
        response.values.map(value => {
            const timeIdx = value.resColumns.indexOf("time");
            const methodIdx = value.resColumns.indexOf("method");
            const cloudletIdx = value.resColumns.indexOf("cloudlet");
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
                    resultParse[method][j] = { [cloudlet]: setdataPart(value.resSeries, reqCount, cloudlet, cloudletIdx, method, methodIdx) };
                });
            });

            /*
            resutParse = {
                registClient : [{cloudletA : plotlyFormatData}],
                getAppInstList : [{cloudletB : plotlyFormatData}]
            }
            */

            resData.push(resultParse);
        });
    } else {
        console.log(" ERROR ::::::::::::::: Faile to request data");
        return resData;
    }

    return resData;
};
