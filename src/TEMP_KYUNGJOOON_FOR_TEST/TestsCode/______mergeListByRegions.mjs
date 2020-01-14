let cpuUsageList = {
    "data": [
        {
            "Series": [
                {
                    "name": "appinst-cpu",
                    "columns": [
                        "time",
                        "app",
                        "cloudlet",
                        "cluster",
                        "cpu",
                        "dev",
                        "operator"
                    ],
                    "values": [
                        [
                            "2020-01-02T17:56:54.753999948Z",
                            "weave-net-s6rck",
                            "automationMunichCloudletStage",
                            "autoclusterfacedetectiondemo",
                            0.3,
                            "MobiledgeX",
                            "TDG"
                        ]
                    ]
                },
                {
                    "name": "appinst-cpu",
                    "columns": [
                        "time",
                        "app",
                        "cloudlet",
                        "cluster",
                        "cpu",
                        "dev",
                        "operator"
                    ],
                    "values": [
                        [
                            "2020-01-02T17:56:54.753999948Z",
                            "weave-net-s6rck2",
                            "automationMunichCloudletStage",
                            "autoclusterfacedetectiondemo",
                            0.7,
                            "MobiledgeX",
                            "TDG"
                        ]
                    ]
                },
                {
                    "name": "appinst-cpu",
                    "columns": [
                        "time",
                        "app",
                        "cloudlet",
                        "cluster",
                        "cpu",
                        "dev",
                        "operator"
                    ],
                    "values": [
                        [
                            "2020-01-02T17:56:54.753999948Z",
                            "weave-net-s6rck3",
                            "automationMunichCloudletStage",
                            "autoclusterfacedetectiondemo",
                            0.12,
                            "MobiledgeX",
                            "TDG"
                        ]
                    ]
                }
            ],
            "Messages": null
        }
    ]
}

let memUsageList = {
    "data": [
        {
            "Series": [
                {
                    "name": "appinst-cpu",
                    "columns": [
                        "time",
                        "app",
                        "cloudlet",
                        "cluster",
                        "cpu",
                        "dev",
                        "operator"
                    ],
                    "values": [
                        [
                            "2020-01-10T22:23:09.477345006Z",
                            "facedetection",
                            "frankfurt-eu",
                            "qqqaaa",
                            0.03,
                            "MobiledgeX",
                            "TDG"
                        ]
                    ]
                }
            ],
            "Messages": null
        }
    ]
}


import axios from 'axios'
//console.log(JSON.stringify(memUsageListPerOneInstance.data[0].Series, null, "  "));

let seriesList = cpuUsageList.data[0].Series;
let seriesList2 = memUsageList.data[0].Series;

let mergedList = seriesList.concat(seriesList2);

mergedList.map(item => {

    //console.log('sdlkfsldkflksdflksdlfk===>', item);

    console.log('appName===>', item.values[0][1]);
    console.log('cpuUsage===>', item.values[0][4]);
    console.log('dev===>', item.values[0][5]);

})


console.log(JSON.stringify(response.data, null, "  "));
