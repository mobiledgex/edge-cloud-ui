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
    console.log('format data organization- ', datas)
    let result = datas;
    let values = [];
    if(result.data){
        result.data.map((data, i) => {
            let Index = i;
            let Type = data.Type || '-';
            let AdminUsername = data.AdminUsername || '-';
            let Username = data.Name || '-';
            let Role = data.Role || '-';
            let Email = data.email || '-';
            let Address = data.Address || '-';
            let Phone = data.phone || '-';
            let newRegistKey = ['AdminUsername', 'UserName','Type', 'Role','Email', 'Address', 'Phone'];

            values.push({AdminUsername:AdminUsername, Username:Username, Type:Type, Role:Role, Email:Email, Address:Address, Phone:Phone, Edit:newRegistKey})
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
const FormatComputeOrganization = (props) => (
    generateData(props)
)

export default FormatComputeOrganization;
