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

let generateData = (datas,body) => {
    let values = [];
    let toArray = null;
    let toJson = [];
    if(datas.data) {
        if(typeof datas.data === 'object') {
            if(datas.data == null) {
                toJson = null;
            } else {
                toJson.push((datas.data)?datas.data:{});
            }
        } else {
            toArray = datas.data.split('\n')
            toArray.pop();
            toJson = toArray.map((str)=>(JSON.parse(str)))
        }
    }else {
        toJson = null;
    }
    /*
    pool_key: {name: "cloudletPool_bictest_1223-01"}
    cloudlet_key:
        operator_key:
        name: "TDG"
    name: "automationBerlinCloudletStage"
     */
    let newRegistKey = ['Region', 'PoolName', 'OperatorName'];
    if(toJson && toJson.length){
        toJson.map((dataResult, i) => {
            if(dataResult.error || dataResult.message || !dataResult.data) {
                values.push({
                    Index:i,
                    Operator:'',
                    PoolName:'',
                    Clouldet:''
                })
            } else {
                let Index = i;
                let Operator = dataResult.data.cloudlet_key.operator_key.name || '-';
                let PoolName = dataResult.data.pool_key.name || '-';
                let Cloudlet = dataResult.data.cloudlet_key.name || '-';

                values.push({Operator:Operator,  PoolName:PoolName, Cloudlet:Cloudlet})
            }

        })
    } else {
        values.push({Operator:'',PoolName:'', Cloudlet:''})
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
const FormatComputeClouldletPool = (props,body) => (
    generateData(props,body)
)

export default FormatComputeClouldletPool;
