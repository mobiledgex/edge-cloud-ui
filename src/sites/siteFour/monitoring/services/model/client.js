/* eslint-disable import/prefer-default-export */
/*
$ http --verify=false --auth-type=jwt --auth=$SUPERPASS POST https://127.0.0.1:9900/api/v1/auth/metrics/client <<<
'{"region":"local","appinst":{"app_key":{"organization":"AcmeAppCo","name":"someapplication1","version":"1.0"}},"method":"FindCloudlet","selector":"api","last":1}'
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
import * as serverData from "../../../../../services/model/serverData";

let scope = null;
const parseData = (response, type) => {
    const resData = [];
    const times = [];
    const methods = [];
    const resData_util = {};
    const resData_ip = {};
    const resultParse = [];
    if (response && response.response && response.response.data.data) {
        response.response.data.data.map((data, i) => {
            const resSeries_utilize = (data.Series) ? data.Series[0] : null;
            const resSeries_ipuse = (data.Series) ? data.Series[1] : null;
            const columns_utilize = (data.Series) ? data.Series[0].columns : null;
            const columns_ipus = (data.Series) ? data.Series[1].columns : null;

            if (data.Series && data.Series.length > 0) {
                /** metrics of the cloudlets */

                times.push(resSeries_utilize ? createTime(resSeries_utilize.values) : null);
                methods.push(resSeries_utilize ? createMethods(type, resSeries_utilize.values) : null);

                const resultParse = {
                    methods,
                    times,
                    resData_util: [
                        resSeries_utilize.values,
                    ],
                    resData_ip: [
                        resSeries_ipuse.values,
                    ],
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

    return resData;
};
const metricFromServer = async (self, data) => {
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
            method: "FindCloudlet",
            selector: "api",
            last: 1,
        },
    };
    console.log("20200513 metricFromServer --- ", requestData);
    const response = await serverData.sendRequest(self, requestData);
    return parseData(response, `${data.selectOrg}/${data.cloudletSelectedOne}/${data.appinstSelectedOne}`);
};


export const getClientMetrics = async (self, params) => {
    if (!scope) scope = self;
    console.log("20200513 getClientMetrics --- ", params);
    const result = await metricFromServer(self, params);
    return result;

};
