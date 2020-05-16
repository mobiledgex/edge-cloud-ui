/**
* setdataPart
* Format drawing for plotly.js chart
*/
const setdataPart = (data, name, columns) => {
    const setted = {};
    const seriesX = [];
    const seriesY = [];
    data.map((item, i) => {
        seriesX.push(item[0]);
        seriesY.push(item[columns.indexOf(name)]);
    });
    const array = {
        x: seriesX,
        y: seriesY,
        max: [],
        mode: "lines",
        name: "Solid",
        line: {
            dash: "solid",
            width: 1
        }
    };
    return setted[data[0][1] + "_" + data[0][2]] = array;
};

const createTime = (resSeries, idx) => {
    const times = [];
    resSeries.map(value => {
        times.push(value[idx]);
    });
    return times;
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
    let methods = [];
    let cloudlets = [];
    const resultParse = {};

    if (response && response.values && response.values.length > 0) {
        console.log("20200516 format rate of regist .. ", response.values.length, ":", response.values);
        response.values.map(value => {
            const timeIdx = value.indexOf("time");
            const methodIdx = value.indexOf("method");
            const cloudletIdx = value.indexOf("cloudlet");
            const orgIdx = value.indexOf("org");
            times = createTime(value.resSeries, timeIdx);
            methods = createObjects(value.resSeries, methodIdx);
            cloudlets = createObjects(value.resSeries, cloudletIdx);

            methods.map((method, i) => {
                cloudlets.map((cloudlet, j) => {
                    resultParse[method][j] = { [cloudlet]: setdataPart(value, cloudlet, times) };
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
