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

/*

0: "time"
1: "100ms"
2: "10ms"
3: "25ms"
4: "50ms"
5: "5ms"
6: "app"
7: "cloudlet"
8: "dev"
9: "errs"
10: "id"
11: "inf"
12: "method"
13: "oper"
14: "reqs"
15: "ver"

 */
export const formatData = (datas) => {

    let result = datas;
    let values = [];

    if(result && result[0].series){
        result.map((data, i) => {
            data.series.map((serie)=>{
                serie.values.map((value)=>{
                    let item = {time:'',app:'', cloudlet:'', dev:'', method:'', oper:'', reqs:''}
                    item.time = value[0]
                    item.app = value[6]
                    item.cloudlet = value[7]
                    item.dev = value[8]
                    item.method = value[12]
                    item.oper = value[13]
                    item.reqs = value[14]
                    values.push(item)
                })
            })
        })
    } else {
        console.log('there is no result')
    }
    return values
}