const axios = require('axios');


/*"Region": string,
    "OrganizationName": string,
    "AppName": string,
    "Version": string,
    "Operator": string,
    "Cloudlet": string,
    "ClusterInst": string,
    "CloudletLocation": {
    "latitude": number,
        "longitude": number,
},
"URI": string,
    "Liveness": number,
    "Mapped_port": any,
    "Flavor": string,
    "State": number,
    "Error": any,
    "Runtime": any,
    "Created": string,
    "Progress": string,
    "Edit": any,
    "Status": any,
    "Revision": number,*/
axios({
    method: 'post', //you can set what request you want to be
    url: 'https://mc-stage.mobiledgex.net:9900/api/v1/auth/metrics/app',
    data: {
        "region": "EU",
        "appinst": {
            "app_key": {
                "developer_key": {
                    "name": "testaaa"
                },
                "name": "jjjkkk",
                "version": "1.0"
            },
            "cluster_inst_key": {
                "cluster_key": {
                    "name": "kkkkkkk"
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
        "last": 3
    },
    headers: {
        Authorization: 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzcyNDkyMzAsImlhdCI6MTU3NzE2MjgzMCwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.mXNokQljXGEWiskwNVC7TRIV64FxkosPMpcmw7cs6aWx1XjxPJvoJ4D3NZKJjnl-WswPUHo2PD4QcAoKyy8J8g'
    }
}).then(res => {
    console.log('response===>', JSON.stringify(res.data.data));
}).catch(e => {
    console.log('sdlkfsldkflksdflksdlfk===>', e);
})
