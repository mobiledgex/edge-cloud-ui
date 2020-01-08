/*

{
    "result": {
        "fields": [],
        "key": {
            "name": "MobiledgeX SDK Demo"
        },
        "username": "bruce",
        "passhash": "8136f09c17354891c642b9b9f1722c34",
        "address": "000 Nowhere Street, Gainesville, FL 32604",
        "email": "empty@xxxx.com"
    }
}

this.dummyData = [
            {Index:'110', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'109', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'108', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'107', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'106', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'105', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'104', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'103', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'102', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'101', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''}
        ]
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

let generateData = (datas) => {
    let result = datas;
    let values = [];
    if(result){
        result.map((data, i) => {
            let Index = i;
            let DeveloperName = data.result.key.name || '-';
            let Username = data.result.username || '-';
            let Address = data.result.address || '-';
            let Email = data.result.email || '-';
            let newRegistKey = ['DeveloperName', 'Username', 'Address', 'Email'];
            values.push({DeveloperName:DeveloperName, Username:Username, Address:Address, Email:Email, Edit:newRegistKey})
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
const FormatComputeDev = (props) => (
    generateData(props)
)

export default FormatComputeDev;
