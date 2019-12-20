import React from 'react';
//import 'semantic-ui-css/semantic.min.css'
import '../css/introjs.css';
import '../css/introjs-dark.css';
import '../css/index.css';
import ndjsonStream from "can-ndjson-stream";
import axios from "axios-jsonp-pro";
import FormatMonitorApp from "../services/formatter/formatMonitorApp";

export const getIPAddress = () => {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        console.log('ifce=', iface)
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            console.log('add = ', alias.address)
            if (alias.family === 'IPv4' && !alias.internal || alias.address === '127.0.0.1')
                return alias.address;
        }
    }

    return '0.0.0.0';
}


export const requestShowAppInst = async () => {
    let streamData = await fetch('/api/v1/auth/ctrl/ShowAppInst', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY4MDk5MzIsImlhdCI6MTU3NjcyMzUzMiwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.JPKz83yI45GdSIacNanYyX_7zmmE7HvaQvISTLVpWr-IofHwGY8tTQGChyizMpaMcOtKWg2J989p16Rm_2Mr1w",
        },
        body: JSON.stringify({
            "region": 'US',
        })
    }).then((response) => ndjsonStream(response.body)).then((streamData) => {
        return streamData
    });
    const reader = streamData.getReader();
    let read;
    let _results = [];
    reader.read().then(read = (result) => {
        //todo:스트림이 완료 된 경우...
        if (result.done) {

            return _results;
            return;
        }
        console.log("streaming data====>", result.value.data);
        let streamedDataOne = result.value.data;
        _results.push(streamedDataOne)
        //todo:다음 Stream 데이터를 읽어온다..
        reader.read().then(read);
    });

}


export const makeFormApp = (inst, valid, store) => (
    {
        "token": store,
        "params": {
            "region": inst.Region,
            "appinst": {
                "app_key": {
                    "developer_key": {"name": inst.OrganizationName},
                    "name": this.getAppName(inst.AppName),
                    "version": inst.Version
                },
                "cluster_inst_key": {
                    "cluster_key": {"name": inst.ClusterInst},
                    "cloudlet_key": {
                        "name": inst.Cloudlet,
                        "operator_key": {"name": inst.Operator}
                    }
                }
            },
            "selector": valid,
            "last": 1200
        }
    }
)


export const getAppInstanceHealth = async (pInstanceOneInfo: string = "") => {

   /* let serviceBody_appInstInfo = {
        "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY5MTYwODMsImlhdCI6MTU3NjgyOTY4MywidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.p3B_KtgZQsNWN8wKzuX2A1l6-xCqyiaFuPmnJFxm0hAKTBzcxx45kjvMLtGlyTKvzXT2u-ZlMEFo6u4CBzpCmQ",
        "params": {
            "region": "EU",
            "appinst": {
                "app_key": {
                    "developer_key": {
                        "name": "MobiledgeX"
                    },
                    "name": "bictestapp1112-01",
                    "version": "1.0"
                },
                "cluster_inst_key": {
                    "cluster_key": {
                        "name": "qqqaaa"
                    },
                    "cloudlet_key": {
                        "name": "frankfurt-eu",
                        "operator_key": {
                            "name": "TDG"
                        }
                    }
                }
            },
            "selector": "cpu",
            "last": 1200
        }
    }*/


    let serverUri = 'https://' + window.location.hostname + ':3030';
    return await axios.post(serverUri + '/timeAppinst', {
        service: 'timeAppinst',
        serviceBody: pInstanceOneInfo,
        serviceId: Math.round(Math.random() * 10000)
    }).then((response) => {
        console.log('getAppInstanceHealth====>', response);
        //alert(JSON.stringify(response.data))

        return response.data;
    }).catch(e => {
        alert(e)
    })
}

export const makeFormForAppInstance = (instanceDataOne, valid = "cpu", token) => {

    return (
        {
            "token": token,
            "params": {
                "region": instanceDataOne.Region,
                "appinst": {
                    "app_key": {
                        "developer_key": {"name": instanceDataOne.OrganizationName},
                        "name": instanceDataOne.AppName.toLowerCase().replace(/\s+/g, ''),
                        "version": instanceDataOne.Version
                    },
                    "cluster_inst_key": {
                        "cluster_key": {"name": instanceDataOne.ClusterInst},
                        "cloudlet_key": {
                            "name": instanceDataOne.Cloudlet,
                            "operator_key": {"name": instanceDataOne.Operator}
                        }
                    }
                },
                "selector": valid,
                //"last": 25
                "last": 10,
            }
        }
    )
}

