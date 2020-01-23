/*
{
            "result": {
                "fields": [],
                "key": {
                    "app_key": {
                        "developer_key": {
                            "name": "1000 Realities"
                        },
                        "name": "ThousandRealitiesApp",
                        "version": "1.0"
                    },
                    "cloudlet_key": {
                        "operator_key": {
                            "name": "TMO"
                        },
                        "name": "krakowthousandrealities"
                    },
                    "id": "123"
                },
                "cloudlet_loc": {
                    "latitude": 60.0647,
                    "longitude": 19.945,
                    "horizontal_accuracy": 0,
                    "vertical_accuracy": 0,
                    "altitude": 0,
                    "course": 0,
                    "speed": 0,
                    "timestamp": {
                        "seconds": "0",
                        "nanos": 0
                    }
                },
                "uri": "krakowthousandrealities.tmo.mobiledgex.net",
                "cluster_inst_key": {
                    "cluster_key": {
                        "name": "thousandrealitiescluster"
                    },
                    "cloudlet_key": {
                        "operator_key": {
                            "name": "TMO"
                        },
                        "name": "krakowthousandrealities"
                    }
                },
                "liveness": "LivenessStatic",
                "mapped_ports": [
                    {
                        "proto": "LProtoUDP",
                        "internal_port": 8888,
                        "public_port": 8888,
                        "public_path": "",
                        "FQDN_prefix": "thousandrealitiesapp-udp."
                    },
                    {
                        "proto": "LProtoTCP",
                        "internal_port": 8889,
                        "public_port": 8889,
                        "public_path": "",
                        "FQDN_prefix": "thousandrealitiesapp-tcp."
                    },
                    {
                        "proto": "LProtoTCP",
                        "internal_port": 8890,
                        "public_port": 8890,
                        "public_path": "",
                        "FQDN_prefix": "thousandrealitiesapp-tcp."
                    }
                ],
                "flavor": {
                    "name": "x1.small"
                },
                "ip_access": "IpAccessShared",
                "state": "Ready",
                "errors": [],
                "crm_override": "NoOverride",
                "allocated_ip": ""
            }
        }
//

 */


import * as moment from 'moment';

/*
columns =
0: "time"
1: "app"
2: "cloudlet"
3: "cluster"
4: "cpu"
5: "dev"
6: "operator"
 */
export const formatData = (datas) => {
    let values = [];
    try {
        if (datas.data && datas.data.length>0) {
            if (datas.data.data.length > 0) {
                if (datas.data.data[0].Series.length > 0) {
                    let result = datas.data.data[0].Series[0];
                    if (result) {
                        let _name = result.name;
                        let dataSeries = result.values;
                        let dataColumns = result.columns;
                        let infoData = [];
                        let lastItem = null;
                        if (dataSeries.length) {
                            //remove duplicated data

                            dataSeries.map((item) => {
                                // time, cluster, cpu, disk, mem, recvBytes, sendBytes
                                if (lastItem !== item[0]) {
                                    infoData = item;
                                    values.push({
                                        name: _name,
                                        alarm: infoData[2],
                                        dName: infoData[1],
                                        values: {
                                            time: moment(item[0]).utc().local().format(),
                                            cluster: infoData[3],
                                            cmsn: (_name.indexOf('cpu') > -1) ? infoData[4] : (_name.indexOf('mem') > -1) ? infoData[5] : (_name.indexOf('connections') > -1) ? infoData : [infoData[6], infoData[7]]
                                        }
                                    })
                                }

                                lastItem = item[0];
                            })
                        }
                    } else {
                        console.log('there is no result')
                    }
                    values = values.reverse();
                }
            }
        }
    }
    catch (error) {
    }
    return values
}