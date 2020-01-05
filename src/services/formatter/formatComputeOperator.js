/*
{
            "result": {
                "fields": [],
                "key": {
                    "operator_key": {
                        "name": "TDG"
                    },
                    "name": "bonn-niantic"
                },
                "access_uri": "",
                "location": {
                    "latitude": 50.737,
                    "longitude": 7.098,
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
                "ip_support": "IpSupportDynamic",
                "static_ips": "",
                "num_dynamic_ips": 5
            }
        }
//

 */

export const formatData = (datas) => {
    let result = datas;
    let values = [];
    if (result) {
        result.map((data, i) => {
            let dataResult = data.result || '-';
            let Index = i;
            let OperatorName = dataResult.key.name || '-';
            let newRegistKey = ['OperatorName'];

            values.push({ OperatorName: OperatorName, Edit: newRegistKey })
        })
    } else {
        console.log('there is no result')
    }
    return values
}
