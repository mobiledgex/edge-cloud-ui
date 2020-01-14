

let jsonData=[
    {
        "instance": {
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "zzaaa",
            "Version": "1",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "qqqaaa",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "qqqaaa.frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 111,
                    "public_port": 111
                },
                {
                    "proto": 2,
                    "internal_port": 222,
                    "public_port": 222
                }
            ],
            "Flavor": "m4.medium",
            "State": 8,
            "Error": [
                "Update App Inst failed: error running app, Unable to find image 'docker.mobiledgex.net/mobiledgex/images/mobiledgexsdkdemo:latest' locally\ndocker: Error response from daemon: Get https://docker.mobiledgex.net/v2/mobiledgex/images/mobiledgexsdkdemo/manifests/latest: denied: access forbidden.\nSee 'docker run --help'., Process exited with status 125"
            ],
            "Runtime": {
                "container_ids": [
                    "zzaaa"
                ]
            },
            "Created": "seconds : 1572245382",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": 6
        },
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
                "2019-10-22T22:01:06.86893966Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T22:00:58.818345131Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                1.78,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T22:00:50.775092729Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                2.98,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T22:00:42.722703926Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T22:00:34.676944409Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ]
        ],
        "sumCpuUsage": 0.4327272727272727,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "test111qq",
            "Version": "1",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "qqqaaa",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "qqqaaa.frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 1115,
                    "public_port": 1115
                }
            ],
            "Flavor": "m4.medium",
            "State": 5,
            "Error": "-",
            "Runtime": {
                "container_ids": [
                    "test111qq"
                ]
            },
            "Created": "seconds : 1576223754",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": 11
        },
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
                "2019-11-14T15:13:26.988361728Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.08,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:13:18.903823664Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.06,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:13:10.820732793Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:13:02.732475659Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.25,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:54.639824258Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.06,
                "MobiledgeX",
                "TDG"
            ]
        ],
        "sumCpuUsage": 0.04727272727272727,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "bicTestApp1112-01",
            "Version": "1.0",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "qqqaaa",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "qqqaaa.frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 80,
                    "public_port": 80
                }
            ],
            "Flavor": "x1.medium",
            "State": 5,
            "Error": "-",
            "Runtime": {
                "container_ids": [
                    "bicTestApp1112-01"
                ]
            },
            "Created": "seconds : 1576457895",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": "-"
        },
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
                "2019-11-21T19:59:14.007908333Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:59:05.916993511Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:58:57.830410811Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.06,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:58:49.744671622Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:58:41.655864792Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ]
        ],
        "sumCpuUsage": 0.01636363636363636,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "EU",
            "OrganizationName": "testaaa",
            "AppName": "jjj kkk",
            "Version": "1.0",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "kkkkkkk",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 11111,
                    "public_port": 11111,
                    "fqdn_prefix": "jjjkkk-tcp."
                },
                {
                    "proto": 2,
                    "internal_port": 8888,
                    "public_port": 8888,
                    "fqdn_prefix": "jjjkkk-udp."
                }
            ],
            "Flavor": "m4.medium",
            "State": 8,
            "Error": [
                "Update App Inst failed: error running kubectl apply command unable to recognize \"jjjkkk23.yaml\": Get https://10.101.1.10:6443/api?timeout=32s: x509: certificate signed by unknown authority (possibly because of \"crypto/rsa: verification error\" while trying to verify candidate authority certificate \"kubernetes\")\nunable to recognize \"jjjkkk23.yaml\": Get https://10.101.1.10:6443/api?timeout=32s: x509: certificate signed by unknown authority (possibly because of \"crypto/rsa: verification error\" while trying to verify candidate authority certificate \"kubernetes\")\nunable to recognize \"jjjkkk23.yaml\": Get https://10.101.1.10:6443/api?timeout=32s: x509: certificate signed by unknown authority (possibly because of \"crypto/rsa: verification error\" while trying to verify candidate authority certificate \"kubernetes\"), Process exited with status 1"
            ],
            "Runtime": {
                "container_ids": [
                    "jjjkkk-deployment-b6f54656f-2xf4h"
                ]
            },
            "Created": "seconds : 1570741867",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": 21
        },
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
                "2019-10-19T23:02:19.50999999Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00026642227031069217,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:02:11.040999889Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00020066157288965554,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:02:02.740000009Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027244226402033583,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:01:54.329999923Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027244226402033583,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:01:45.974999904Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.0002362197452205174,
                "testaaa",
                "TDG"
            ]
        ],
        "sumCpuUsage": 0.00011347164695104882,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "MEXPrometheusAppName",
            "Version": "1.0",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "kkkkkkk",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "kkkkkkk.frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 9090,
                    "public_port": 9090
                }
            ],
            "Flavor": "x1.medium",
            "State": 8,
            "Error": [
                "Update App Inst failed: UpdateAppInst not supported for deployment: helm"
            ],
            "Runtime": {},
            "Created": "seconds : 1570417526",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": 1
        },
        "columns": "",
        "values": "",
        "sumCpuUsage": 0,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "MEXPrometheusAppName",
            "Version": "1.0",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "rah-cluster9",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "rah-cluster9.frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 9090,
                    "public_port": 9090
                }
            ],
            "Flavor": "x1.medium",
            "State": 5,
            "Error": "-",
            "Runtime": {},
            "Created": "seconds : 1576248859",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": 2
        },
        "columns": "",
        "values": "",
        "sumCpuUsage": 0,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "eeeessss",
            "Version": "1",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "qqqaaa",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "qqqaaa.frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 1111,
                    "public_port": 1111
                },
                {
                    "proto": 1,
                    "internal_port": 2229,
                    "public_port": 2229,
                    "end_port": 2339
                },
                {
                    "proto": 1,
                    "internal_port": 555,
                    "public_port": 555,
                    "end_port": 666
                }
            ],
            "Flavor": "m4.medium",
            "State": 5,
            "Error": "-",
            "Runtime": {
                "container_ids": [
                    "eeeessss"
                ]
            },
            "Created": "seconds : 1575996044",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": 4
        },
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
                "2019-11-14T15:13:26.988361728Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:13:18.903823664Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:13:10.820732793Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:13:02.732475659Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:54.639824258Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ]
        ],
        "sumCpuUsage": 0,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "US",
            "OrganizationName": "MobiledgeX",
            "AppName": "MEXPrometheusAppName",
            "Version": "1.0",
            "Operator": "TDG",
            "Cloudlet": "automationBerlinCloudletStage",
            "ClusterInst": "rah-cluster1",
            "CloudletLocation": {
                "latitude": 1,
                "longitude": 1,
                "timestamp": {}
            },
            "URI": "rah-cluster1.automationberlincloudletstage.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 9090,
                    "public_port": 9090
                }
            ],
            "Flavor": "x1.medium",
            "State": 5,
            "Error": "-",
            "Runtime": {},
            "Created": "seconds : 1576258309",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": 2
        },
        "columns": "",
        "values": "",
        "sumCpuUsage": 0,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "US",
            "OrganizationName": "MobiledgeX",
            "AppName": "MEXPrometheusAppName",
            "Version": "1.0",
            "Operator": "TDG",
            "Cloudlet": "automationBerlinCloudletStage",
            "ClusterInst": "rah-cluster2",
            "CloudletLocation": {
                "latitude": 1,
                "longitude": 1,
                "timestamp": {}
            },
            "URI": "rah-cluster2.automationberlincloudletstage.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 9090,
                    "public_port": 9090
                }
            ],
            "Flavor": "x1.medium",
            "State": 5,
            "Error": "-",
            "Runtime": {},
            "Created": "seconds : 1576258609",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": 2
        },
        "columns": "",
        "values": "",
        "sumCpuUsage": 0,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "US",
            "OrganizationName": "MobiledgeX",
            "AppName": "RTSPVideoStreaming",
            "Version": "1.0",
            "Operator": "tmus",
            "Cloudlet": "tmocloud-1",
            "ClusterInst": "autoclusterrtspvideostreaming",
            "CloudletLocation": {
                "latitude": 1,
                "longitude": 1
            },
            "URI": "autoclusterrtspvideostreaming.tmocloud-1.tmus.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 5001,
                    "public_port": 5001
                }
            ],
            "Flavor": "x1.large",
            "State": 5,
            "Error": "-",
            "Runtime": {},
            "Created": "seconds : 1576269882",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": "-"
        },
        "columns": "",
        "values": "",
        "sumCpuUsage": 0,
        "sumMemUsage": 0
    },
    {
        "instance": {
            "Region": "US",
            "OrganizationName": "Sierraware",
            "AppName": "SierraVM",
            "Version": "50.0.8",
            "Operator": "TDG",
            "Cloudlet": "mexplat-stage-hamburg-cloudlet",
            "ClusterInst": "appcluster",
            "CloudletLocation": {
                "latitude": 55,
                "longitude": 44,
                "timestamp": {}
            },
            "URI": "-",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 4433
                },
                {
                    "proto": 1,
                    "internal_port": 443
                }
            ],
            "Flavor": "x1.medium",
            "State": 5,
            "Error": "-",
            "Runtime": {},
            "Created": "seconds : 1558078516",
            "Progress": "",
            "Edit": [
                "Region",
                "DeveloperName",
                "AppName",
                "Version",
                "Operator",
                "Cloudlet",
                "ClusterInst",
                "CloudletLocation",
                "State",
                "Editable"
            ],
            "Status": {},
            "Revision": "-"
        },
        "columns": "",
        "values": "",
        "sumCpuUsage": 0,
        "sumMemUsage": 0
    }
]



export const filterUsageByType2222 = (usageList, pType, TypeName) => {
    let filteredUsageList = usageList.filter((item) => {
        if (item.instance[pType] === TypeName) {
            return item;
        }
    });
    return filteredUsageList
}

/*

let result= filterUsageByType(jsonData,'AppName' , 'RTSPVideoStreaming')

console.log('sdlkfsldkflksdflksdlfk===>', result);
*/
