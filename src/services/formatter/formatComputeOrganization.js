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
    let result = datas;
    let values = [];
    if(result.data){
        if(result.data.error){
            console.log("result error")
        }else {
            result.data.map((data, i) => {
                let Index = i;
                let Type = data.Type || '-';
                let AdminUsername = data.AdminUsername || '-';
                let Organization = data.Name || '-';
                let Address = data.Address || '-';
                let Phone = data.Phone || '-';
                let newRegistKey = ['Organization', 'Type', 'Phone', 'Address'];
    
                values.push({Organization:Organization, Type:Type, Phone:Phone, Address:Address, Edit:newRegistKey})
            })
        }
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
const FormatComputeOrganization = (props) => (
    generateData(props)
)

export default FormatComputeOrganization;
