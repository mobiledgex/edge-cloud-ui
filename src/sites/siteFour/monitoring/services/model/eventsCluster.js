import * as ChartType from "../../formatter/chartType";
import * as serviceMC from "../../../../../services/model/serviceMC";


interface eventData {
    time: string;
    cluster: string;
    clusterorg: string;
    cloudletorg: string;
    flavor: string;
    vcpu: number;
    ram: number;
    disk: number;
    event: string;
    status: number;
}

// function createData(
//     time: string,
//     cluster: string,
//     organization: string,
//     cloudlet: string,
//     operator: string,
//     flavor: string,
//     vCPU: number,
//     ram: number,
//     disk: number,
//     event: string,
//     status: number
// ): eventData {
//     return { time, cluster, organization, cloudlet, operator, flavor, vCPU, ram, disk, event, status };
// }

const createData = (series, columns) => {
    const newSeries = [];
    series.map(seri => {
        const itemObj = {};
        columns.map((column, i) => {
            itemObj[column] = seri[i];
        });
        newSeries.push(itemObj);
    });

    return newSeries;
};

const parseData = (response, type) => {
    let resData = {};
    const resSeries = (response && response.response && response.response.data.data[0].Series) ? response.response.data.data[0].Series[0] : null;
    if (!resSeries) {
        console.log(" ERROR ::::::::::::::: Faile to request data");
        return resData;
    }
    /** events of the  */
    if (type === ChartType.TABLE) {
        resData = response
            ? createData(
                resSeries.values, resSeries.columns
            )
            : null;
    }
    return resData;
};

export const getClusterEvent = async (self, cluster, chartType) => {
    const response = await serviceMC.sendSyncRequest(self, cluster);
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
