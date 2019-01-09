/*
전산센터      : JAUP00200000
교통서비스센터    : JAUP00600000
본관          : JAUP00100000
신공항        : JAUP00300000
북인천        : JAUP00400000
청라          : JAUP00500000

Battery3Temp
RoomTemp
Battery4Temp
BatteryVolt
Battery1Temp
RoomHumi
Battery2Temp

critical1 : 28
major1 : 27
curr : -1
compareMethod : "gt"
minor1 : 26


*/
import moment from 'moment';

let offices =
    {'JAUP00200000':'전산센터',
    'JAUP00100000':'본관',
    'JAUP00300000':'인천공항',
    'JAUP00400000':'북인천',
    'JAUP00500000':'청라',
    'JAUP00600000':'교통서비스센터'}

let officeId = ['JAUP00200000', 'JAUP00100000', 'JAUP00300000', 'JAUP00400000', 'JAUP00500000', 'JAUP00600000'];
let officeName = ['전산센터', '본관', '인천공항', '북인천', '청라', '교통서비스센터'];
let columns = [
    {"RoomTemp" : "온도"},
    {"RoomHumi" : "습도"}
]
let nullTemp = {compareMethod:'get', critical1:0, curr:-1, major1:0, minor1:0};
let nullHumi = {compareMethod:'outer', critical1:0, curr: -1, critical1:0, major1:0, major2:0, minor1:0, minor2:0};
let getRows = (data) => {
    let getValues = (vl) => (
        vl['curr']
    )
    let rows = [];
    let keys = Object.keys(data);
    officeId.map((item) => {
        rows.push({[item] : { temp:(data[item])?data[item][Object.keys(columns[0])]:nullTemp, humi:(data[item])?data[item][Object.keys(columns[1])]:nullHumi}});
    });


    return rows;

}
let generateData = (datas) => {
    let keys = Object.keys(datas);
    return (
        {
            "headers":offices,
            "columns": columns,
            "rows":getRows(datas)
        }
    )


}


const FormatUPSBattery = (props) => (
    generateData(props)
)

export default FormatUPSBattery;
