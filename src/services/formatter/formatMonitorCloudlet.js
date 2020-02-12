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

import * as d3 from 'd3';
import * as moment from 'moment';

/*
{alarm:'3', dName:'Cluster-A', values:{cpu:35, mem:55, sys:33}}
 */
export const formatData = (datas) => {
    let values = [];
    if (datas.data) {
        let result = datas.data.data[0].Series[0];
        if (result) {
            let _name = '';
            let dataSeries = result.values;
            let dataColumns = result.columns;
            let infoData = [];
            let lastItem = null;
            if (dataSeries.length) {
                dataSeries.map((item, i) => {
                    //console.log('20190930 item -- ', item, ":",  dataColumns, ':name=', _name)
                    _name = dataColumns[i]
                    // time, cluster, cpu, disk, mem, recvBytes, sendBytes
                    if (lastItem !== item[0]) {
                        infoData = item;
                        let valueObj = {};
                        item.map((val, j) => {
                            valueObj[dataColumns[j]] = item[j];
                        });
                        values.push({
                            name: dataColumns[1],
                            values: {
                                time: moment(item[0]).utc().format(),
                                cmsn: valueObj
                            }
                        })
                    }
                    lastItem = item[0]

                })
            }
        }
    }
    return values
}