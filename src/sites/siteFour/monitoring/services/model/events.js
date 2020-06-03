/*
review @Rahul
*/
import * as serviceMC from "../../../../../services/model/serviceMC";
import * as ChartType from "../../formatter/chartType";

/** type of table */

/* "time","cloudlet","cloudletorg","event","status"*/
interface eventData {
    time: string;
    cloudlet: string;
    cloudletorg: string;
    event: string;
    status: number;
}

function createData(
    time: string,
    cloudlet: string,
    cloudletorg: string,
    event: string,
    status: number
): eventData {
    return { time, cloudlet, cloudletorg, event, status };
}

const parseData = (response, type) => {
    let resData = {};
    const resSeries = (response && response.response && response.response.data.data[0].Series) ? response.response.data.data[0].Series[0] : null;
    if (!resSeries) {
        console.log(" ERROR ::::::::::::::: Faile to request data")
        return resData;
    }
    /** events of the cloudlets */
    if (type === ChartType.TABLE) {
        resData = response
            ? createData(
                resSeries.values[0][0],
                resSeries.values[0][1],
                resSeries.values[0][2],
                resSeries.values[0][3],
                resSeries.values[0][4]
            )
            : null;
    }
    return resData;
};
export const getCloudletEvent = async (self, cloudlet, chartType) => {
    let response = await serviceMC.sendSyncRequest(self, cloudlet);
    return parseData(response, chartType);
};

function createDataCluster(
    time: string,
    cloudlet: string,
    cloudletorg: string,
    event: string,
    status: number
): eventData {
    return { time, cloudlet, cloudletorg, event, status };
}

const parseDataCluster = (response, type) => {
    let resData = {};
    const resSeries = (response && response.response && response.response.data.data[0].Series) ? response.response.data.data[0].Series[0] : null;
    const key = resSeries.columns;
    console.log("20200603 key", key)
    if (!resSeries) {
        console.log(" ERROR ::::::::::::::: Faile to request data")
        return resData;
    }
    /** events of the cloudlets */
    if (type === ChartType.TABLE) {
        resData = response
            ? {key: key, data: resSeries.values[0]}
            : null;
        console.log("20200603 resData", resData)
    }
    return resData;
};

export const getClusterEvent = async (self, cluster, chartType) => {
    let response = await serviceMC.sendSyncRequest(self, cluster);
    return parseData(response, chartType);
};

/*
{"data":[
    {
        "Series":[{
            "name":"clusterinst",
            "columns":["time","cluster","clusterorg","cloudlet","cloudletorg","flavor","vcpu","ram","disk","other","event","status"],
            "values":[
                ["2020-05-02T06:32:28.726552647Z","autoclustermobiledgexsdkdemo20","titanorganization","berlin-test","TDG","x1.medium",4,4096,4,"map[]","DELETED","DOWN"],
                ["2020-04-30T04:44:29.281458016Z","autoclustermobiledgexsdkdemo20","titanorganization","mexplat-stage-hamburg-cloudlet","TDG","x1.medium",4,4096,4,"map[]","CREATED","UP"],
                ["2020-04-29T20:49:55.461784847Z","autoclustermobiledgexsdkdemo20","titanorganization","mexplat-stage-hamburg-cloudlet","TDG","x1.medium",4,4096,4,"map[]","DELETED","DOWN"]
            ]
        }],
        "Messages":null
    }
]}
*/
