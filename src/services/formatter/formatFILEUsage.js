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

export const formatData = (datas) => {
    let result = datas.data.result;
    let values = [];
    if(result){
        result.map((data) => {
            moment.locale('es-us')
            //let time = moment(data.value[0] * 1000).format('MM-DD-YYYY HH:mm:ss');
            let time = moment(data.value[0] * 1000).format('YYYY-MM-DD HH:mm:ss');
            let score = data.value[1];
            let instance = data.metric.instance;
            values.push({time:time, score:parseFloat(score).toFixed(3), inst:instance})
        })
    } else {
        console.log('there is no result')
    }

    return values

}
