import {HARDWARE_TYPE} from "../../../../../../shared/Constants";

let cpuUsageList = [
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
            ],
            [
                "2019-10-22T22:00:26.631827585Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T22:00:18.590196095Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                1.78,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T22:00:10.544451322Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T22:00:02.49134744Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:59:54.443861075Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:59:46.398576436Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                3.37,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:59:38.351105589Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:59:30.308859937Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:59:22.26556885Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:59:14.218191043Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                3.55,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:59:06.175810072Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:58:58.131338901Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:58:50.087891222Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:58:42.043501117Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:58:33.992613505Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:58:25.948660426Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:58:17.899381139Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:58:09.855525071Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                1.83,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:58:01.80904564Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-10-22T21:57:53.764462851Z",
                "zzaaa",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ]
        ],
        "sumCpuUsage": 1.3900000000000001
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
            ],
            [
                "2019-11-14T15:12:46.556214943Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:38.472689984Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.06,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:30.382807782Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:22.296040612Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:14.210709582Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.08,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:06.125688743Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:58.039153795Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.06,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:49.947890067Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:41.863391188Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.06,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:33.773929123Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:25.686873039Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:17.595585679Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.23,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:09.507485913Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.08,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:01.423183436Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:53.342476616Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.06,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:45.25655647Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:37.171632611Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:29.088647951Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:21.007273283Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:12.920757107Z",
                "test111qq",
                "frankfurt-eu",
                "qqqaaa",
                0.07,
                "MobiledgeX",
                "TDG"
            ]
        ],
        "sumCpuUsage": 0.18727272727272737
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
            ],
            [
                "2019-11-21T19:58:33.568096895Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:58:25.476561027Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:58:17.389865541Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:58:09.302196898Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:58:01.212271516Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:57:53.12425043Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:57:45.028501332Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:57:36.941537977Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:57:28.856637144Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:57:20.76538149Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:57:12.677222873Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.06,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:57:04.591980527Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:56:56.502286792Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:56:48.413905949Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:56:40.323231676Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:56:32.232463803Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.04,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:56:24.142401331Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:56:16.049448567Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:56:07.958131554Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.04,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-21T19:55:59.869839971Z",
                "bictestapp1112-01",
                "frankfurt-eu",
                "qqqaaa",
                0.03,
                "MobiledgeX",
                "TDG"
            ]
        ],
        "sumCpuUsage": 0.0754545454545455
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
            ],
            [
                "2019-10-19T23:01:37.599999904Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027427519201248386,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:01:29.176000118Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027404594601343273,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:01:20.779999971Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027293623580204054,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:01:12.234999895Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.000270089715213362,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:00:55.388000011Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00022580533103792573,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:00:38.506000041Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.0002734782680364685,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:00:30.240000009Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.0002722807489092095,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:00:21.967999935Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.000275744618441585,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T23:00:13.487999916Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.0002701932976295006,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:59:56.743999958Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027145279657199195,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:59:39.86800003Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.0002710087374074535,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:59:31.585000038Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027175898088606864,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:59:23.227999925Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027175898088606864,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:59:14.859999895Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.0002734745708070091,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:59:06.450000047Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027557742804258173,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:58:58.073999881Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027315237420261814,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:58:49.720999956Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.0002736002362907569,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:58:32.65199995Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.0002265400491754784,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:58:24.247999906Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.00027170192172474027,
                "testaaa",
                "TDG"
            ],
            [
                "2019-10-19T22:58:15.552000045Z",
                "jjjkkk-deployment-b6f54656f-2xf4h",
                "frankfurt-eu",
                "kkkkkkk",
                0.0002289796228764942,
                "testaaa",
                "TDG"
            ]
        ],
        "sumCpuUsage": 0.0005969130153117097
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
        "sumCpuUsage": 0
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
        "sumCpuUsage": 0
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
            ],
            [
                "2019-11-14T15:12:46.556214943Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:38.472689984Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:30.382807782Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:22.296040612Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:14.210709582Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:12:06.125688743Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:58.039153795Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:49.947890067Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:41.863391188Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:33.773929123Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:25.686873039Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:17.595585679Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:09.507485913Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:11:01.423183436Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:53.342476616Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:45.25655647Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:37.171632611Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:29.088647951Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:21.007273283Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ],
            [
                "2019-11-14T15:10:12.920757107Z",
                "eeeessss",
                "frankfurt-eu",
                "qqqaaa",
                0,
                "MobiledgeX",
                "TDG"
            ]
        ],
        "sumCpuUsage": 0
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
        "sumCpuUsage": 0
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
        "sumCpuUsage": 0
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
        "sumCpuUsage": 0
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
        "sumCpuUsage": 0
    }
]

let newHardwareUsageList = [];

let paramHWType = 'cpu'

for (let index = 0; index < cpuUsageList.length; index++) {
    if (cpuUsageList[index].appInstanceHealth.data[0].Series != null) {

        let columns = cpuUsageList[index].appInstanceHealth.data[0].Series[0].columns;
        let values = cpuUsageList[index].appInstanceHealth.data[0].Series[0].values;

        let sumCpuUsage = 0;
        let sumMemUsage = 0;
        let sumDiskUsage = 0;
        let sumRecvBytes = 0;
        let sumSendBytes = 0;
        for (let jIndex = 0; jIndex < values.length; jIndex++) {
            //console.log('itemeLength===>',  values[i][4]);

            let date = values[jIndex][0]
            date = date.toString().split("T")[0]
            console.log('date====>', covertToComparableDate(date));

            if (paramHWType === HARDWARE_TYPE.CPU) {
                sumCpuUsage = sumCpuUsage + values[jIndex][4];
            } else if (paramHWType === HARDWARE_TYPE.MEM) {
                sumMemUsage = sumMemUsage + values[jIndex][5];
            } else if (paramHWType === HARDWARE_TYPE.NETWORK) {
                sumRecvBytes = sumRecvBytes + values[jIndex][6];
                sumSendBytes = sumSendBytes + values[jIndex][7];
            } else if (paramHWType === HARDWARE_TYPE.DISK) {
                sumDiskUsage = sumDiskUsage + values[jIndex][5];
            }

        }

        //todo: CPU/MEM 사용량 평균값을 계산한다.....
        sumCpuUsage = sumCpuUsage / cpuUsageList.length;
        sumMemUsage = Math.ceil(sumMemUsage / cpuUsageList.length);

        console.log('sumMemUsage===>', sumMemUsage);


        let body = {}
        if (paramHWType === 'cpu') {
            body = {
                instance: cpuUsageList[index].instanceData,
                columns: columns,
                values: values,
                sumCpuUsage: sumCpuUsage,
            }

        } else if (paramHWType === 'mem') {
            body = {
                instance: cpuUsageList[index].instanceData,
                columns: columns,
                values: values,
                sumMemUsage: sumMemUsage,
            }

        } else if (paramHWType === 'disk') {
            body = {
                instance: cpuUsageList[index].instanceData,
                columns: columns,
                values: values,
                sumDiskUsage: sumDiskUsage,
            }
        } else {//network
            body = {
                instance: cpuUsageList[index].instanceData,
                columns: columns,
                values: values,
                sumRecvBytes: sumRecvBytes,
                sumSendBytes: sumSendBytes,
            }

        }

        newHardwareUsageList.push(body);

    } else {

        let body = {}
        if (paramHWType === 'cpu') {
            body = {
                instance: cpuUsageList[index].instanceData,
                columns: '',
                values: '',
                sumCpuUsage: 0,
            }

        } else if (paramHWType === 'mem') {
            body = {
                instance: cpuUsageList[index].instanceData,
                columns: '',
                values: '',
                sumMemUsage: 0,
            }

        } else if (paramHWType === 'disk') {
            body = {
                instance: cpuUsageList[index].instanceData,
                columns: '',
                values: '',
                sumDiskUsage: 0,
            }
        } else {//network
            body = {
                instance: cpuUsageList[index].instanceData,
                columns: '',
                values: '',
                sumRecvBytes: 0,
                sumSendBytes: 0,
            }

        }
        newHardwareUsageList.push(body);
    }

}
//@todo :##################################
//@todo : Sort usage in reverse order.
//@todo :##################################
if (paramHWType === HARDWARE_TYPE.CPU) {
    newHardwareUsageList.sort((a, b) => {
        return b.sumCpuUsage - a.sumCpuUsage;
    });
} else if (paramHWType === HARDWARE_TYPE.MEM) {
    newHardwareUsageList.sort((a, b) => {
        return b.sumMemUsage - a.sumMemUsage;
    });
} else if (paramHWType === HARDWARE_TYPE.NETWORK) {
    newHardwareUsageList.sort((a, b) => {
        return b.sumRecvBytes - a.sumRecvBytes;
    });
} else if (paramHWType === HARDWARE_TYPE.DISK) {
    newHardwareUsageList.sort((a, b) => {
        return b.sumDiskUsage - a.sumDiskUsage;
    });
}
return newHardwareUsageList;

function covertToComparableDate(date) {

    let arrayDate = date.toString().split("-");

    let compareableFullDate = arrayDate[0] + arrayDate[1] + arrayDate[2]

    return compareableFullDate

}
