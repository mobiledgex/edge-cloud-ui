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

const formatDigit = (dNum, value) => (
    d3.format(dNum)(value)
)
/*
{alarm:'3', dName:'Cluster-A', values:{cpu:35, mem:55, sys:33}}
 */
export const formatData = (datas) => {
    let values = [];
    if (datas.data) {
        let result = datas.data.data[0].Series[0];
        if (result) {
            let _name = result.name;
            let dataSeries = result.values;
            let dataColumns = result.columns;
            let infoData = [];
            let lastItem = null;
            if (dataSeries.length) {
                dataSeries.map((item) => {

                    // time, cluster, cpu, disk, mem, recvBytes, sendBytes
                    if (lastItem !== item[0]) {
                        infoData = item;
                        values.push({
                            name: _name,
                            alarm: infoData[2],
                            dName: infoData[1],
                            values: {
                                time: moment(item[0]).utc().format(),
                                cluster: infoData[2],
                                cmsn:
                                    (_name.indexOf('cpu') > -1) ? formatDigit('.2f', infoData[3]) :
                                        (_name.indexOf('mem') > -1) ? formatDigit('.2f', infoData[4]) :
                                            (_name.indexOf('disk') > -1) ? formatDigit('.2f', infoData[4]) :
                                                (_name.indexOf('network') > -1) ? [infoData[5], infoData[6]] :
                                                    (_name.indexOf('tcp') > -1) ? [infoData[5], infoData[6]] :
                                                        (_name.indexOf('udp') > -1) ? [infoData[5], infoData[7], infoData[6]] : [infoData[6], infoData[7]]
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