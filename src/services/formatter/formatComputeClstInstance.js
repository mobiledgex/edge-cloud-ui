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
let trimData = (datas) => {
    let newData = datas.splice(0,1);
    return datas ;
}
const week_kr = ["월","화","수","목","금","토","일"]
let week = moment().format('E');
let getWeek = week_kr[(week-1)];
const numberDes =(a,b)=> (
    b-a
)

let generateData = (datas) => {
    console.log('format data - ', datas)
    let result = datas;
    let values = [];
    if(result){
        result.map((data, i) => {
            let dataResult = data.result;

            let Index = i;
            let ClusterName=dataResult.key.cluster_key.name || '-';
            let CloudletName= dataResult.key.cloudlet_key.name || '-';
            let OperatorName=dataResult.key.cloudlet_key.operator_key.name || '-';
            //let AppName = dataResult.key.cluster_key.name || '-';
            let Flavor = dataResult.flavor.name || '-';
            let liveness = dataResult.liveness || '-';
            let state = dataResult.state || '-';


            let newRegistKey = [
                'ClusterName',
                'CloudletName',
                'OperatorName',
                'Flavor',
                'liveness',
                'state'
            ];

            values.push({
                ClusterName:ClusterName,
                CloudletName:CloudletName,
                OperatorName:OperatorName,
                Flavor:Flavor,
                liveness:liveness,
                state:state,
                Edit:newRegistKey
            })
        })
    } else {
        console.log('there is no result')
    }

    //ascending or descending

    //values.sort(numberDes);
    //values.reverse();

    return values

}
const retunDate = (str) => {
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    var hour = str.substring(8, 10);
    var minute = str.substring(10, 12);
    //var second = str.substring(12, 14);
    var date = new Date(year, month-1, day, hour, minute);
    return moment(date).format('hh:mm');
}
const FormatComputeClstInst = (props) => (
    generateData(props)
)

export default FormatComputeClstInst;
