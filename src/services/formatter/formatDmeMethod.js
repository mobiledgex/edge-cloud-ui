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