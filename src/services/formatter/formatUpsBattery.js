/*
HEADOFFICE_SUB
NORTHINCHEON_MAIN
INCHEONAIRPORT_MAIN
NORTHINCHEON_SUB
HEADOFFICE_MAIN
INCHEONAIRPORT_SUB

FreeBattery
Temperature
InputVoltage
OutputStatus
BatteryStatus
OutputLoad

==FreeBattery==
critical1 : 60
major1 : 80
curr : 99
compareMethod : "le"





*/
import moment from 'moment';

let areas = {
    'JAWI00100000':'신도시IC교',
    'JAWI00200000':'영종대교',
    'JAWI00300000':'귤현3교',
    'JAWI00400000':'방화대교',
    '0002WIS00S':'[송도]STA 7+0',
    '0003WIS00A':'[공항]STA 10+6'
}
let offices = ["HEADOFFICE_MAIN", "HEADOFFICE_SUB", "INCHEONAIRPORT_MAIN", "INCHEONAIRPORT_SUB", "NORTHINCHEON_MAIN", "NORTHINCHEON_SUB"];
let offices_kr = ["본사","인천공항","북인천"];
let colName = ["OutputStatus", "BatteryStatus" , "FreeBattery" , "Temperature" , "InputVoltage", "OutputLoad"];
let columns = [
    {"OutputStatus" : "출력 상태"},
    {"BatteryStatus" : "배터리 상태"},
    {"FreeBattery" : "배터리 잔류량(%)"},
    {"Temperature" : "온도(℃)"},
    {"InputVoltage" : "입력 전압(V)"},
    {"OutputLoad" : "출력 부하(%)"}
]
let getRows = (data) => {
    let getValues = (vl) => (
        vl['curr']
    )
    let rows = [];

    for(let i=0; i < colName.length; i++) {
        var name = colName[i];
        var colsArray = [];
        for(let j=0; j < offices.length; j++) {
            var office = data[offices[j]];
            colsArray.push(office[name])
        }
        rows.push({[name]: colsArray})
    }


    return rows;

}
let generateData = (datas) => {
    let keys = Object.keys(datas);
    return (
        {
            "header":offices_kr,
            "header2":offices,
            "columns": columns,
            "colName": colName,
            "rows":getRows(datas)
        }
    )


}


const FormatUPSBattery = (props) => (
    generateData(props)
)

export default FormatUPSBattery;
