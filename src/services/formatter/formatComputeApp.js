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
    console.log('format data apps - ', datas)
    let result = datas;
    let values = [];
    //20190409 transition string to json
    let toArray = datas.data.split('\n')
    let toJson = toArray.map((str)=>(JSON.parse(str)))
    console.log("tojson!!",toJson)
    if(toJson){
        toJson.map((dataResult, i) => {
            if(dataResult.message) {

            } else {
                let Index = i;
                let DeveloperName = dataResult.key.developer_key.name || '-';
                let AppName = dataResult.key.name || '-';
                let Version = dataResult.key.version || '-';
                let ImagePath = dataResult.image_path || '-';
                let DeploymentType = dataResult.deployment || '-';
                let ImageType = dataResult.image_type || '-';
                let DefaultFlavor = dataResult.default_flavor.name || '-';
                let Ports = dataResult.access_ports || '-';
                let newRegistKey = [
                    'DeveloperName',
                    'AppName',
                    'Version',
                    'ImagePath',
                    'DeploymentType',
                    'ImageType',
                    'DefaultFlavor',
                    'Ports'
                ];

                values.push({
                    DeveloperName:DeveloperName,
                    AppName:AppName,
                    Version:Version,
                    ImagePath:ImagePath,
                    DeploymentType:DeploymentType,
                    ImageType:ImageType,
                    DefaultFlavor:DefaultFlavor,
                    Ports:Ports,
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
const formatComputeApp = (props) => (
    generateData(props)
)

export default formatComputeApp;
