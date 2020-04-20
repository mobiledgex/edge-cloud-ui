const axios = require('axios');

axios({
    url: 'https://console-stage.mobiledgex.net:443/api/v1/auth/metrics/app',
    method: 'post',
    data: {
        "region": "US",
        "appinst": {
            "app_key": {
                "developer_key": {
                    "name": "MobiledgeX"
                }
            }
        },
        "selector": "cpu",
        "last": 1
    },
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Nzg3MDU5MTcsImlhdCI6MTU3ODYxOTUxNywidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.tzWT3VrZe6Ql_AuKiw93pg618kho7m-x8dyk0Bk7m75-4wD54Vl1BVOykFQ-MsvSSPBLNzEoF7q-66m4Wfn0KA'

    },
    timeout: 15 * 1000
}).then(async response => {
    console.log(JSON.stringify(response.data, null, "  "));
}).catch(e => {
    throw new Error(e)
})
