let data = [
    {
        "AppNames": "MEXPrometheusAppName | multiple | EU | undefined | 1.0 | TDG , MobiledgeX SDK Demo | autoclustermobiledgexsdkdemo | EU | undefined | 2.0 | TDG , MEXPrometheusAppName | morethanone | EU | undefined | 1.0 | TDG , server-pint-threaded | multiple | EU | 3 | 6.0 | TDG",
        "CloudletLocation": {
            "latitude": 48.1351253,
            "longitude": 11.5819806
        },
        "strCloudletLocation": "48.1351253_11.5819806",
        "Cloudlet": "automationMunichCloudlet",
        "isShow": false,
        "isShowCircle": false
    },
    {
        "AppNames": "MEXPrometheusAppName | multiple | EU | undefined | 1.0 | TDG , andydockercomposeinput | autoclusterandydockercomposeinput | EU | undefined | 1.0 | TDG , server-pint-threaded | multiple | EU | 3 | 6.0 | TDG , MEXPrometheusAppName | morethanone | EU | undefined | 1.0 | TDG , kyungjoon_genius_app | autoclusterandydockercomposeinput | EU | undefined | 1.0 | TDG , kyungjoon_genius_app | autoclusterandydockercomposeinput | EU | undefined | 2.0 | TDG",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "strCloudletLocation": "53.551085_9.993682",
        "Cloudlet": "automationHamburgCloudlet",
        "isShow": false,
        "isShowCircle": false
    },
    {
        "AppNames": "andydockercomposezip | andydocker | EU | undefined | 1.0 | TDG , MEXPrometheusAppName | autoclusterandydnsapp | EU | undefined | 1.0 | TDG , MobiledgeX SDK Demo | autoclustermobiledgexsdkdemo | EU | 2 | 2.0 | TDG , andytls | andytls | EU | undefined | 1 | TDG , MEXPrometheusAppName | andyk8sded | EU | undefined | 1.0 | TDG , MEXPrometheusAppName | andytls | EU | undefined | 1.0 | TDG , MEXPrometheusAppName | cluster1588717989-0650518 | EU | undefined | 1.0 | TDG",
        "CloudletLocation": {
            "latitude": 51.2277,
            "longitude": 6.7735
        },
        "strCloudletLocation": "51.2277_6.7735",
        "Cloudlet": "automationDusseldorfCloudlet",
        "isShow": false,
        "isShowCircle": false
    },
    {
        "AppNames": "MEXPrometheusAppName | mutiple | EU | undefined | 1.0 | TDG , MEXPrometheusAppName | morethanone | EU | undefined | 1.0 | TDG , vmnolb | DefaultVMCluster | EU | undefined | 1.0 | TDG",
        "CloudletLocation": {
            "latitude": 52.520007,
            "longitude": 13.404954
        },
        "strCloudletLocation": "52.520007_13.404954",
        "Cloudlet": "automationBerlinCloudlet",
        "isShow": false,
        "isShowCircle": false
    },
    {
        "AppNames": "server-pint-threaded | multiple | EU | 3 | 6.0 | TDG , MEXPrometheusAppName | morethanone | EU | undefined | 1.0 | TDG , MobiledgeX SDK Demo | autoclustermobiledgexsdkdemo | EU | undefined | 2.0 | TDG , MEXPrometheusAppName | multiple | EU | undefined | 1.0 | TDG",
        "CloudletLocation": {
            "latitude": 50.110922,
            "longitude": 8.682127
        },
        "strCloudletLocation": "50.110922_8.682127",
        "Cloudlet": "automationFrankfurtCloudlet",
        "isShow": false,
        "isShowCircle": false
    },
    {
        "AppNames": "app158871680299202dockerdedicated | cluster158871680299202dockerdedicated | EU | undefined | 1.0 | TDG , app158871680299202dockerdedicatedgpu | cluster158871680299202dockerdedicatedgpu | EU | undefined | 1.0 | TDG , app158871680299202dockershared | cluster158871680299202dockershared | EU | 3 | 1.0 | TDG",
        "CloudletLocation": {
            "latitude": 53.551085,
            "longitude": 9.993682
        },
        "strCloudletLocation": "53.551085_9.993682",
        "Cloudlet": "verificationCloudlet",
        "isShow": false,
        "isShowCircle": false
    },
    {
        "AppNames": "MEXPrometheusAppName | autoclusteriperf4 | EU | undefined | 1.0 | TDG",
        "CloudletLocation": {
            "latitude": 1,
            "longitude": 1,
            "timestamp": {}
        },
        "strCloudletLocation": "1_1",
        "Cloudlet": "andycloud",
        "isShow": false,
        "isShowCircle": false
    },
    {
        "AppNames": "MEXPrometheusAppName | autoclusterautomation | US | undefined | 1.0 | tmus , automation_api_app | autoclusterautomation | US | undefined | 1.0 | tmus",
        "CloudletLocation": {
            "latitude": 31,
            "longitude": -91
        },
        "strCloudletLocation": "31_-91",
        "Cloudlet": "tmocloud-1",
        "isShow": false,
        "isShowCircle": false
    }
]



const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);


let groubyCloudletObject = groupBy(data, 'strCloudletLocation')


let keys = Object.keys(groubyCloudletObject);

keys.map((item, index) => {
    console.log(`sldkfldskflkdsf===>`, item);

    let itemOne=groubyCloudletObject[item];

    console.log(`sldkfldskflkdsf2===${index}>`, itemOne)
})
