let groupedDatas={
    "hackathon-anand": [
        {
            "uuid": "ebe3c99c-eb87-4dd1-90db-9a3f4a101539",
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "Face Detection Demo",
            "Version": "1.0",
            "Operator": "mex",
            "Cloudlet": "hackathon-anand",
            "ClusterInst": "hackathon-anand-cluster",
            "CloudletLocation": {
                "latitude": 33.01,
                "longitude": -96.61
            },
            "URI": "hackathon-anand.mex.mobiledgex.net",
            "Liveness": 1,
            "Mapped_port": [
                {
                    "proto": 1,
                    "internal_port": 8008,
                    "public_port": 8008,
                    "fqdn_prefix": "facedetectiondemo-tcp."
                },
                {
                    "proto": 1,
                    "internal_port": 8011,
                    "public_port": 8011,
                    "fqdn_prefix": "facedetectiondemo-tcp."
                }
            ],
            "Flavor": "m4.large",
            "State": 5,
            "Error": "-",
            "Runtime": {
                "container_ids": [
                    "facedetectiondemo-deployment-77dbb88dd9-p2zks"
                ]
            },
            "Created": "seconds : 1580482137",
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
        {
            "uuid": "f25e2bde-2103-40f2-9cb9-e20245b1d393",
            "Region": "EU",
            "OrganizationName": "MobiledgeX",
            "AppName": "MobiledgeX SDK Demo",
            "Version": "1.0",
            "Operator": "mex",
            "Cloudlet": "hackathon-anand",
            "ClusterInst": "hackathon-anand-cluster",
            "CloudletLocation": {
                "latitude": 33.01,
                "longitude": -96.61
            },
            "URI": "hackathon-anand.mex.mobiledgex.net",
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
                    "mobiledgexsdkdemo-deployment-78d4d4d778-c4mdg"
                ]
            },
            "Created": "seconds : 1580482052",
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
        }
    ],
    "frankfurt-eu": [
        {
            "uuid": "a028d765-8009-411e-87c7-784b871d80ba",
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
        {
            "uuid": "958ca96f-9e25-49d9-8e85-d18a986e2fda",
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
        {
            "uuid": "2228364b-8f29-4924-8d11-bbcbdd4ee532",
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
        {
            "uuid": "fea9b0d0-98bb-440c-8c1e-1e383b0560f2",
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
        {
            "uuid": "2d043c4d-a156-4851-89a9-41a1826894fd",
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
        {
            "uuid": "73277b66-87d7-42d5-8120-830209436b2c",
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
        {
            "uuid": "b9533ad2-6ad2-4dcf-8d70-2ebcb746bca9",
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
        {
            "uuid": "d9c374d4-864e-405e-b91f-2983144a6260",
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
        }
    ],
    "alex-hackathon": [
        {
            "uuid": "e191cf31-9326-4cce-9b96-9f1b896ce502",
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
        }
    ]
}

let cloudletKeys = Object.keys(groupedDatas)

cloudletKeys.map(key=>{
    let listOne=groupedDatas[key];

    listOne.map((item, index)=>{

    })
    console.log('listOne.length===>', listOne.length);

})
