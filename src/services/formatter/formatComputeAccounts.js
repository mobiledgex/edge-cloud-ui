/*
{ Name: 'bickhcho1',
       Email: 'whrjsgml111@naver.com',
       EmailVerified: true,
       Passhash: '',
       Salt: '',
       Iter: 0,
       FamilyName: '',
       GivenName: '',
       Picture: '',
       Nickname: '',
       CreatedAt: '2019-05-23T06:29:01.794715Z',
       UpdatedAt: '2019-05-23T06:30:42.082077Z',
       Locked: false }

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
    console.log('format data users- ', datas)
    let result = datas;
    let values = [];
    //20190409 transition string to json
    //let toArray = result.data.split('\n')

    let toJson = result.data;
    console.log('format data toJson- ', toJson)

    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {

            } else {
                let Index = i;
                let Username = dataResult.Name || '-';
                let Email = dataResult.Email || '-';
                let EmailVerified = dataResult.EmailVerified || '-';
                let Passhash = dataResult.Passhash || '-';
                let Salt = dataResult.Salt || '-';
                let Iter = dataResult.Iter || '-';
                let FamilyName = dataResult.FamilyName || '-';
                let GivenName = dataResult.GivenName || '-';
                let Picture = dataResult.Picture || '-';
                let Nickname = dataResult.Nickname || '-';
                let CreatedAt = dataResult.CreatedAt || '-';
                let UpdatedAt = dataResult.UpdatedAt || '-';
                let Locked = dataResult.Locked || '-';
                let newRegistKey = [ 'Username', 'Email'];

                values.push({
                    Username:Username,
                    Email:Email,
                    EmailVerified:EmailVerified,
                    Passhash:Passhash,
                    Salt:Salt,
                    Iter:Iter,
                    FamilyName:FamilyName,
                    GivenName:GivenName,
                    Picture:Picture,
                    Nickname:Nickname,
                    CreatedAt:CreatedAt,
                    UpdatedAt:UpdatedAt,
                    Locked:Locked,
                    Edit:newRegistKey
                })
            }

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
const FormatComputeAccounts = (props) => (
    generateData(props)
)

export default FormatComputeAccounts;
