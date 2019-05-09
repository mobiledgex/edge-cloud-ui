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
    console.log('format data Flavor - ', datas)
    let values = [];
    let toArray = null;
    let toJson = [];
    if(datas.data) {
        if(typeof datas.data === 'object') {
            toJson.push((datas.data)?datas.data:{});
        } else {
            toArray = datas.data.split('\n')
            toArray.pop();
            toJson = toArray.map((str)=>(JSON.parse(str)))
        }
    }else {
        toJson = null;
    }
    
    console.log('format data toJson - ', toJson,body.region)
    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {

            } else {
                let Index = i;
                let Region = body.region || '-';
                let FlavorName = dataResult.data.key.name || '-';
                let RAM = dataResult.data.ram || '-';
                let VCPUS = dataResult.data.vcpus || '-';
                let DISK = dataResult.data.disk || '-';
                let newRegistKey = ['Region', 'FlavorName', 'RAM', 'VCPUS', 'DISK'];

                values.push({Region:Region, FlavorName:FlavorName, RAM:RAM, VCPUS:VCPUS, DISK:DISK, Edit:newRegistKey})
            }

        })
    } else {
        let newRegistKey = ['Region', 'FlavorName', 'RAM', 'VCPUS', 'DISK'];
        //values.push({Edit:newRegistKey})
        values.push({Region:'', FlavorName:'', RAM:'', VCPUS:'', DISK:'', Edit:newRegistKey})
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
const FormatComputeFlavor = (props,body) => (
    generateData(props,body)
)

export default FormatComputeFlavor;
