import * as moment from 'moment';
export const formatData = (datas) => {
    let result = datas.data.result;
    let values = [];
    if(result){
        result.map((data) => {
            moment.locale('es-us')
            let time = moment(data.value[0] * 1000).format('MM-DD-YYYY HH:mm:ss');
            let score = Number(data.value[1]);
            let instance = data.metric.instance;
            values.push({time:time, score:parseFloat(score).toFixed(2), inst:instance})
        })
    } else {
        console.log('there is no result')
    }
    return values
}