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
var colors = ['#22cccc', '#6699ff','#aa77ff', '#ff8e06' ];
var fontColor = 'rgba(255,255,255,.5)' ;

let generateData = (datas) => {

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
const FormatDmeMethod = (props) => (
    generateData(props)
)

export default FormatDmeMethod;
