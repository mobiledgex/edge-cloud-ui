let jsonData = [
    {
        "instanceData": {
            "uuid": "cdd94a39-24e3-4a7d-9f67-0dddbdc9dec5",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": [
                        {
                            "name": "appinst-network",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-10-19T23:02:20.467999935Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-10-19T23:02:11.951999902Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-10-19T23:02:03.607000112Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-10-19T23:01:38.512000083Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-10-19T23:01:30.140000104Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ]
                            ]
                        },
                        {
                            "name": "appinst-mem",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-10-19T23:02:11.247999906Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    256212992,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:01:37.806999921Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    256212992,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:01:29.427999973Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    256212992,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:01:20.987999916Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    256212992,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:01:12.552000045Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    null,
                                    256212992,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-disk",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-10-19T23:02:11.496000051Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    35254272,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:02:03.191999912Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    35254272,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:01:46.391999959Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    35254272,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:01:38.010999917Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    35254272,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:01:29.677000045Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    35254272,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-cpu",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-10-19T23:02:19.50999999Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    0.00026642227031069217,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:02:11.040999889Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    0.00020066157288965554,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:02:02.740000009Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    0.00027244226402033583,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:01:54.329999923Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    0.00027244226402033583,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-19T23:01:45.974999904Z",
                                    null,
                                    null,
                                    "jjjkkk-deployment-b6f54656f-2xf4h",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    0.0002362197452205174,
                                    "testaaa",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-connections",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-10-28T07:17:15.623160945Z",
                                    102,
                                    0,
                                    "jjjkkk",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    102,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-28T07:17:07.600507946Z",
                                    102,
                                    0,
                                    "jjjkkk",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    102,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-28T07:16:59.5838314Z",
                                    102,
                                    0,
                                    "jjjkkk",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    102,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-28T07:16:51.515435332Z",
                                    102,
                                    0,
                                    "jjjkkk",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    102,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-28T07:16:46.075296125Z",
                                    102,
                                    0,
                                    "jjjkkk",
                                    "frankfurt-eu",
                                    "kkkkkkk",
                                    null,
                                    "testaaa",
                                    null,
                                    102,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        }
                    ],
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "8243bc56-f7db-4d21-a72b-8b322030975d",
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "MobiledgeX SDK Demo",
            "Version": "1.0",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "webuieuk8s",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 7777,
                    "public_port": 7777,
                    "fqdn_prefix": "mobiledgexsdkdemo-tcp."
                }
            ],
            "Flavor": "m4.large",
            "State": 5,
            "Error": "-",
            "Runtime": {
                "container_ids": [
                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb"
                ]
            },
            "Created": "seconds : 1578696962",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": [
                        {
                            "name": "appinst-network",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:03:54.737999916Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2020-01-11T04:03:38.279999971Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2020-01-11T04:03:30.00999999Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2020-01-11T04:03:13.558000087Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2020-01-11T04:03:05.368999958Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ]
                            ]
                        },
                        {
                            "name": "appinst-mem",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:03:54.007999897Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    6516736,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:45.740000009Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    6516736,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:37.625999927Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    6516736,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:29.345999956Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    6516736,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:21.165999889Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    6516736,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-disk",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:03:45.957999944Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    37847040,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:37.828999996Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    37847040,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:21.404999971Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    37847040,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:13.11800003Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    37847040,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:04.944999933Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    37847040,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-cpu",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:03:53.776000022Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    4.230003186738965e-7,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:45.542999982Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:29.121999979Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    0.00000774939715995479,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:20.970000028Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    0.000011573345426416328,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:12.686000108Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo-deployment-866c8784c-6dzwb",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    0.000008077789569719579,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-connections",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:03:59.91255997Z",
                                    2,
                                    0,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    2,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:54.255277697Z",
                                    2,
                                    0,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    2,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:48.59602397Z",
                                    2,
                                    0,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    2,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:42.973376184Z",
                                    2,
                                    0,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    2,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:37.350896243Z",
                                    2,
                                    0,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    2,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        }
                    ],
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "8a4f51e2-688c-423a-b69a-e123a835997e",
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "MobiledgeX SDK Demo",
            "Version": "docker",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "webuieudocker",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "webuieudocker.frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 7777,
                    "public_port": 7777
                }
            ],
            "Flavor": "x1.medium",
            "State": 5,
            "Error": "-",
            "Runtime": {
                "container_ids": [
                    "MobiledgeXSDKDemo"
                ]
            },
            "Created": "seconds : 1578697017",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": [
                        {
                            "name": "appinst-network",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:03:55.924586568Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2020-01-11T04:03:47.878446361Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2020-01-11T04:03:39.828111427Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2020-01-11T04:03:31.781721871Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2020-01-11T04:03:23.732141168Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ]
                            ]
                        },
                        {
                            "name": "appinst-mem",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:03:55.924586568Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    3665821,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:47.878446361Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    3665821,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:39.828111427Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    3665821,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:31.781721871Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    3665821,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:23.732141168Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    3665821,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-disk",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:03:55.924586568Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:47.878446361Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:39.828111427Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:31.781721871Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:23.732141168Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-cpu",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:03:55.924586568Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:47.878446361Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:39.828111427Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:31.781721871Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:23.732141168Z",
                                    null,
                                    null,
                                    "mobiledgexsdkdemo",
                                    "frankfurt-eu",
                                    "webuieudocker",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        }
                    ],
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "72a1b9d7-5bae-4a16-a7d0-6c434d09baf7",
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "automationVM",
            "Version": "1.0",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "xxx",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "mobiledgexautomationvm10.frankfurt-eu.tdg.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 2015,
                    "public_port": 2015
                }
            ],
            "Flavor": "x1.large",
            "State": 5,
            "Error": "-",
            "Runtime": {},
            "Created": "seconds : 1578697257",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": null,
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "ac465c98-833c-4ce7-9fea-e0bc34a1e28d",
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
            "Created": "seconds : 1578611317",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": [
                        {
                            "name": "appinst-network",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-21T19:59:14.007908333Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-21T19:59:05.916993511Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-21T19:58:57.830410811Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-21T19:58:49.744671622Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-21T19:58:41.655864792Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ]
                            ]
                        },
                        {
                            "name": "appinst-mem",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-21T19:59:14.007908333Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    258998272,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:59:05.916993511Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    258998272,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:58:57.830410811Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    258998272,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:58:49.744671622Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    258998272,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:58:41.655864792Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    258998272,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-disk",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-21T19:59:14.007908333Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:59:05.916993511Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:58:57.830410811Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:58:49.744671622Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:58:41.655864792Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-cpu",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-21T19:59:14.007908333Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.03,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:59:05.916993511Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.03,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:58:57.830410811Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.06,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:58:49.744671622Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.03,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-21T19:58:41.655864792Z",
                                    null,
                                    null,
                                    "bictestapp1112-01",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.03,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        }
                    ],
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "209ece8d-d5e7-4f35-8cbb-695562114666",
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
            "Created": "seconds : 1578512140",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": [
                        {
                            "name": "appinst-network",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-14T15:13:26.988361728Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-14T15:13:18.903823664Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-14T15:13:10.820732793Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-14T15:13:02.732475659Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-14T15:12:54.639824258Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ]
                            ]
                        },
                        {
                            "name": "appinst-mem",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-14T15:13:26.988361728Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    9847177,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:18.903823664Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    9847177,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:10.820732793Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    9847177,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:02.732475659Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    9847177,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:12:54.639824258Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    9847177,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-disk",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-14T15:13:26.988361728Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:18.903823664Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:10.820732793Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:02.732475659Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:12:54.639824258Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-cpu",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-14T15:13:26.988361728Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.08,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:18.903823664Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.06,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:10.820732793Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.07,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:02.732475659Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.25,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:12:54.639824258Z",
                                    null,
                                    null,
                                    "test111qq",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0.06,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        }
                    ],
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "3b217ba2-8c80-4a2e-a764-63261be51b2b",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": [
                        {
                            "name": "appinst-network",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-10-22T22:01:06.86893966Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-10-22T22:00:58.818345131Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-10-22T22:00:50.775092729Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-10-22T22:00:42.722703926Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-10-22T22:00:34.676944409Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ]
                            ]
                        },
                        {
                            "name": "appinst-mem",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-10-22T22:01:06.86893966Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    2608857,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:58.818345131Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    2653945,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:50.775092729Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    3526361,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:42.722703926Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    2608857,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:34.676944409Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    2608857,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-disk",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-10-22T22:01:06.86893966Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:58.818345131Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:50.775092729Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:42.722703926Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:34.676944409Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-cpu",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-10-22T22:01:06.86893966Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:58.818345131Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    1.78,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:50.775092729Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    2.98,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:42.722703926Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-10-22T22:00:34.676944409Z",
                                    null,
                                    null,
                                    "zzaaa",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        }
                    ],
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "8e8612e9-84dd-432e-9652-18c1878c42cb",
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
            "Created": "seconds : 1578512412",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": [
                        {
                            "name": "appinst-network",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-14T15:13:26.988361728Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-14T15:13:18.903823664Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-14T15:13:10.820732793Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-14T15:13:02.732475659Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ],
                                [
                                    "2019-11-14T15:12:54.639824258Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    0,
                                    0
                                ]
                            ]
                        },
                        {
                            "name": "appinst-mem",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-14T15:13:26.988361728Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    2866806,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:18.903823664Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    2866806,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:10.820732793Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    2866806,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:02.732475659Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    2866806,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:12:54.639824258Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    2866806,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-disk",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-14T15:13:26.988361728Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:18.903823664Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:10.820732793Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:02.732475659Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:12:54.639824258Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    null,
                                    "MobiledgeX",
                                    0,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-cpu",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2019-11-14T15:13:26.988361728Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:18.903823664Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:10.820732793Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:13:02.732475659Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2019-11-14T15:12:54.639824258Z",
                                    null,
                                    null,
                                    "eeeessss",
                                    "frankfurt-eu",
                                    "qqqaaa",
                                    0,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        }
                    ],
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "1eb715a4-80de-4b53-a7c8-bbf209bb24ba",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": null,
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "08c4181f-e9a9-4e8e-8eb4-d35df1c20be7",
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "MEXPrometheusAppName",
            "Version": "1.0",
            "Operator": "TDG",
            "Cloudlet": "frankfurt-eu",
            "ClusterInst": "webuieuk8s",
            "CloudletLocation": {
                "latitude": 50.110924,
                "longitude": 8.682127
            },
            "URI": "webuieuk8s.frankfurt-eu.tdg.mobiledgex.net",
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
            "Created": "seconds : 1578694594",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": [
                        {
                            "name": "appinst-network",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:04:03.365000009Z",
                                    null,
                                    null,
                                    "prometheus-mexprometheusappname-prome-prometheus-0",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    102805,
                                    5957
                                ],
                                [
                                    "2020-01-11T04:04:03.365000009Z",
                                    null,
                                    null,
                                    "mexprometheusappname-kube-state-metrics-7994f8847c-rs4qg",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    1405,
                                    43799
                                ],
                                [
                                    "2020-01-11T04:04:03.365000009Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prometheus-node-exporter-ghxhm",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    5335,
                                    52074
                                ],
                                [
                                    "2020-01-11T04:04:03.365000009Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prome-operator-bfbbf4699-9j7d6",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    70,
                                    327
                                ],
                                [
                                    "2020-01-11T04:03:54.737999916Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prometheus-node-exporter-ghxhm",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    6014,
                                    47242
                                ]
                            ]
                        },
                        {
                            "name": "appinst-mem",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:04:02.542999982Z",
                                    null,
                                    null,
                                    "prometheus-mexprometheusappname-prome-prometheus-0",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    520224768,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:04:02.542999982Z",
                                    null,
                                    null,
                                    "mexprometheusappname-kube-state-metrics-7994f8847c-rs4qg",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    10092544,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:04:02.542999982Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prometheus-node-exporter-ghxhm",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    13193216,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:04:02.542999982Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prome-operator-bfbbf4699-9j7d6",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    27504640,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:54.007999897Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prometheus-node-exporter-ghxhm",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    13180928,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-disk",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:04:02.831000089Z",
                                    null,
                                    null,
                                    "prometheus-mexprometheusappname-prome-prometheus-0",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    471040,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:04:02.831000089Z",
                                    null,
                                    null,
                                    "mexprometheusappname-kube-state-metrics-7994f8847c-rs4qg",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    94208,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:04:02.831000089Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prometheus-node-exporter-ghxhm",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    114688,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:04:02.831000089Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prome-operator-bfbbf4699-9j7d6",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    155648,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:45.957999944Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prometheus-node-exporter-ghxhm",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    null,
                                    "MobiledgeX",
                                    114688,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        },
                        {
                            "name": "appinst-cpu",
                            "columns": [
                                "time",
                                "accepts",
                                "active",
                                "app",
                                "cloudlet",
                                "cluster",
                                "cpu",
                                "dev",
                                "disk",
                                "handled",
                                "mem",
                                "operator",
                                "recvBytes",
                                "sendBytes"
                            ],
                            "values": [
                                [
                                    "2020-01-11T04:04:02.280999898Z",
                                    null,
                                    null,
                                    "prometheus-mexprometheusappname-prome-prometheus-0",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    0.03198375259975783,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:04:02.280999898Z",
                                    null,
                                    null,
                                    "mexprometheusappname-kube-state-metrics-7994f8847c-rs4qg",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    0.0005831414108886008,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:04:02.280999898Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prometheus-node-exporter-ghxhm",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    0.004228693221706105,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:04:02.280999898Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prome-operator-bfbbf4699-9j7d6",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    0.0009953088647619895,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ],
                                [
                                    "2020-01-11T04:03:53.776000022Z",
                                    null,
                                    null,
                                    "mexprometheusappname-prometheus-node-exporter-ghxhm",
                                    "frankfurt-eu",
                                    "webuieuk8s",
                                    0.0029329163899745173,
                                    "MobiledgeX",
                                    null,
                                    null,
                                    null,
                                    "TDG",
                                    null,
                                    null
                                ]
                            ]
                        }
                    ],
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "d221d375-9bd2-4617-83af-1d7df0e5a4c1",
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "MobiledgeX SDK Demo",
            "Version": "k8s",
            "Operator": "mex",
            "Cloudlet": "alex-hackathon",
            "ClusterInst": "alex-hackathon-cluster",
            "CloudletLocation": {
                "latitude": 33.01,
                "longitude": -96.61
            },
            "URI": "alex-hackathon.mex.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 7777,
                    "public_port": 7777,
                    "fqdn_prefix": "mobiledgexsdkdemo-tcp."
                }
            ],
            "Flavor": "x1.medium",
            "State": 5,
            "Error": "-",
            "Runtime": {
                "container_ids": [
                    "mobiledgexsdkdemo-deployment-78d4d4d778-8qhx2"
                ]
            },
            "Created": "seconds : 1578441092",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": null,
                    "Messages": null
                }
            ]
        }
    },
    {
        "instanceData": {
            "uuid": "ede546da-6848-465e-ae3d-f345c4299382",
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
        "appInstanceHealth": {
            "data": [
                {
                    "Series": null,
                    "Messages": null
                }
            ]
        }
    }
]


console.log('sdlkfsldkflksdflksdlfk===>', jsonData);

let usageListForAllInstance = jsonData;


let cpuUsageList = []
let memUsageList = [];
let diskUsageList = [];
let networkUsageList = [];
usageListForAllInstance.map((item, index) => {

    let appName = item.instanceData.AppName;
    let sumMemUsage = 0;
    let sumDiskUsage = 0;
    let sumRecvBytes = 0;
    let sumSendBytes = 0;
    let sumCpuUsage = 0;
    let series = item.appInstanceHealth.data["0"].Series;

    if (series !== null) {
        let cpuSeries = series["3"]

        //@todo###########################
        //@todo makeCpuSeriesList
        //@todo###########################
        cpuSeries.values.map(item => {
            let cpuUsage = item[6];//cpuUsage..index
            sumCpuUsage += cpuUsage;
        })

        cpuUsageList.push({
            instance: item.instanceData,
            columns: cpuSeries.columns,
            sumCpuUsage: sumCpuUsage,
            values: cpuSeries.values,
            appName:appName,

        })
        //@todo###########################
        //@todo MemSeriesList
        //@todo###########################
        let memSeries = series["1"]
        memSeries.values.map(item => {
            let usageOne = item[10];//memUsage..index
            sumMemUsage += usageOne;
        })

        memUsageList.push({
            instance: item.instanceData,
            columns: memSeries.columns,
            sumMemUsage: sumMemUsage,
            values: memSeries.values,
            appName:appName,
        })

        //@todo###########################
        //@todo DiskSeriesList [index2]
        //@todo###########################
        let diskSeries = series["2"]
        diskSeries.values.map(item => {
            let usageOne = item[8];//diskUsage..index
            sumDiskUsage += usageOne;
        })

        diskUsageList.push({
            instance: item.instanceData,
            columns: diskSeries.columns,
            sumDiskUsage: sumDiskUsage,
            values: diskSeries.values,
            appName:appName,
        })

        //@todo###############################
        //@todo NetworkUSageList [index0]
        //@todo##############################
        let networkSeries = series["0"]
        networkSeries.values.map(item => {
            let recvBytesOne = item[12];//memUsage
            sumRecvBytes += recvBytesOne;

            let sendBytesOne = item[13];//memUsage
            sumSendBytes += sendBytesOne;
        })

        networkUsageList.push({
            instance: item.instanceData,
            columns: networkSeries.columns,
            sumRecvBytes: sumRecvBytes,
            sumSendBytes: sumSendBytes,
            values: networkSeries.values,
            appName:appName,
        })
    } else {


        cpuUsageList.push({
            instance: item.instanceData,
            columns: "",
            sumCpuUsage: 0,
            values: "",
            appName:appName,

        })

        memUsageList.push({
            instance: item.instanceData,
            columns: "",
            sumMemUsage: 0,
            values: "",
            appName:appName,

        })


        diskUsageList.push({
            instance: item.instanceData,
            columns: "",
            sumDiskUsage: 0,
            values: "",
            appName:appName,
        })

        networkUsageList.push({
            instance: item.instanceData,
            columns: "",
            sumRecvBytes: 0,
            sumSendBytes: 0,
            values: "",
            appName:appName,
        })
    }

})


/*
[
      "time",
      "accepts",
      "active",
      "app",
      "cloudlet",
      "cluster",
      "cpu",
      "dev",
      "disk",
      "handled",
      "mem",
      "operator",
      "recvBytes",
      "sendBytes"
  ]

  [
      [
        "2019-10-19T23:02:19.50999999Z",
        null,
        null,
        "jjjkkk-deployment-b6f54656f-2xf4h",
        "frankfurt-eu",
        "kkkkkkk",
        0.00026642227031069217, //cpuUsage
        "testaaa",
        null,
        null,
        null,
        "TDG",
        null,
        null
      ]
  ]
*/
