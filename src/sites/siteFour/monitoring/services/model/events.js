import * as serviceMC from "../../../../../services/model/serviceMC";
import * as ChartType from "../../formatter/chartType";

/** type of table */
interface Data {
    name: string;
    code: string;
    population: number;
    size: number;
    density: number;
}
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
    const resSeries = response.response.data.data[0].Series[0];
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
