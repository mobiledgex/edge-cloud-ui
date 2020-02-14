import axios from "axios";

async function getList(region) {

    return await axios({
        url: 'https://console-stage.mobiledgex.net:443/api/v1/auth/metrics/app',
        method: 'post',
        data: {
            "region": region,
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
        return response.data;
    }).catch(e => {
        throw new Error(e)
    })
}

async function getAllData() {
    let usageList = await Promise.all([
        getList('EU'),
        getList('US'),
    ])


    let seriesList = usageList[0].data[0].Series;
    let seriesList2 = usageList[1].data[0].Series;
    let mergedList = seriesList.concat(seriesList2);
    mergedList.map(item => {
        console.log('appName===>', item.values[0][1]);
        console.log('cpuUsage===>', item.values[0][4]);
        console.log('dev===>', item.values[0][5]);

    })
}


getAllData()


function console_dir ( json){
    console.log(JSON.stringify(json, null, "  "));
}



