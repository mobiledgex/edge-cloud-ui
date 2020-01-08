/*
{
    "status": "success",
    "data": {
        "resultType": "vector",
        "result": [
            {
                "metric": {
                    "instance": "berlin.tdg.mobiledgex.net:9100"
                },
                "value": [
                    1547276528.172,
                    "0.249999999990294"
                ]
            },
            {
                "metric": {
                    "instance": "bonn.tdg.mobiledgex.net:9100"
                },
                "value": [
                    1547276528.172,
                    "0.3374999999747814"
                ]
            },
            {
                "metric": {
                    "instance": "dashboard.mobiledgex.net:9100"
                },
                "value": [
                    1547276528.172,
                    "7.466666666635618"
                ]
            },
            {
                "metric": {
                    "instance": "hamburg.tdg.mobiledgex.net:9100"
                },
                "value": [
                    1547276528.172,
                    "0.27165308406679856"
                ]
            },
            {
                "metric": {
                    "instance": "munich-test.tdg.mobiledgex.net:9100"
                },
                "value": [
                    1547276528.172,
                    "0.26250000005043717"
                ]
            }
        ]
    }
}


*/
import * as moment from 'moment';
let trimData = (datas) => {
    let newData = datas.splice(0,1);
    return datas ;
}
const week_kr = ["월","화","수","목","금","토","일"]
let week = moment().format('E');
let getWeek = week_kr[(week-1)];
let generateData = (datas) => {
    let result = datas.data.result;
    let values = [];
    if(result){
        result.map((data) => {
            moment.locale('es-us')
            //let time = moment(data.value[0] * 1000).format('MM-DD-YYYY HH:mm:ss');
            let time = moment(data.value[0] * 1000).format('YYYY-MM-DD HH:mm:ss');
            let score = data.value[1];
            let instance = data.metric.instance;
            //console.log('time -- '+time, 'score --'+score, 'instance -- '+instance)
            values.push({time:time, score:parseFloat(score).toFixed(3), inst:instance})
        })
    } else {
        console.log('there is no result')
    }

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
const FormatNetworkIO = (props) => (
    generateData(props)
)

export default FormatNetworkIO;
