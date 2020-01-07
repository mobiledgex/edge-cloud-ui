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

export const formatData = (datas) => {
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
    return values
}