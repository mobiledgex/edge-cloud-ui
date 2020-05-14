/* eslint-disable import/prefer-default-export */
/*
$ http --verify=false --auth-type=jwt --auth=$SUPERPASS POST https://console-stage.mobiledgex.net:443/api/v1/auth/metrics/client <<< '{"region":"EU","appinst":{"app_key":{"organization":"TDG","name":"MobiledgeX SDK Demo","version":"2.0"}},"method":"FindCloudlet","selector":"api","last":1}'
HTTP/1.1 200 OK
//////////
{
  "region": "local",
  "appinst": {
    "app_key": {
      "organization": "AcmeAppCo",
      "name": "someapplication1",
      "version": "1.0"
    }
  },
  "method": "FindCloudlet",
  "selector": "api",
  "last": 1
}
*/

import moment from "moment";
import * as serverData from "../../../../../services/model/serverData";

let scope = null;

const parseData = (response, type) => {
    const resData = [];
    const columns = [];
    const methods = [];
    const cloudlets = [];
    const resData_util = {};
    const resData_ip = {};
    if (response && response.response && response.response.data.data) {
        response.response.data.data.map((data, i) => {
            if (data.Series && data.Series.length > 0) {
                const resSeries = (data.Series) ? data.Series[0].values : null;
                const resColumns = (data.Series) ? data.Series[0].columns : null;
                const cloudletIdx = resColumns.indexOf("cloudlet");
                const methodIdx = resColumns.indexOf("method");
                /** metrics of the cloudlets */
                resSeries.map((res, l) => {
                    cloudlets.push(res[cloudletIdx]);
                    methods.push(res[methodIdx]);
                });

                const resultParse = {
                    methods,
                    cloudlets,
                    resColumns,
                    resSeries,
                };

                resData.push(resultParse);
            } else {
                console.log("ERROR ::: ", data);
            }
        });
    } else {
        console.log(" ERROR ::::::::::::::: Faile to request data");
        return resData;
    }

    return { [type]: resData };
};
/*
1. Get yesterday date with current timing

moment().subtract(1, 'days').toString()
2. Get yesterday date with start of the day

moment().subtract(1, 'days').startOf('day').toString()
3. Get yesterday date with end of the day

moment().subtract(1, 'days').endOf('day').toString()
*/
const metricFromServer = async (self, data) => {
    const selectedTimeRange = "today"; // TODO: selected time form toolbar
    const yesterdayWithCurrent = moment().subtract(1, "days").toString();
    const yesterdayOfStartDay = moment().subtract(1, "days").startOf("day").toString();
    const yesterdayOfEndDay = moment().subtract(1, "days").endOf("day").toString();

    const makeUTC = time => moment(time).utc();
    const rangeTime = range => {
        let time = new Date();

        if (range === "start") {
            time = makeUTC(yesterdayWithCurrent);
        } else {
            time = makeUTC(moment());
        }
        return time;
    };
    const requestData = {
        token: data.token,
        method: data.method,
        data: {
            region: data.pRegion,
            appinst: {
                app_key: {
                    organization: data.selectOrg,
                    name: data.appinstSelectedOne,
                    version: data.version,
                },
            },
            selector: "api",
            starttime: rangeTime("start"),
            endtime: rangeTime("end")
        },
    };


    const response = await serverData.sendRequest(self, requestData);
    console.log("20200513 metricFromServer --- ", response);
    return parseData(response, `${data.pRegion}/${data.selectOrg}/${data.appinstSelectedOne}`);
};


export const getClientMetrics = async (self, params) => {
    if (!scope) scope = self;
    console.log("20200513 getClientMetrics --- ", params);
    const result = await metricFromServer(self, params);
    return result;
};
