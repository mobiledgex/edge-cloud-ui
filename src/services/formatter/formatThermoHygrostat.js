/*
POWER_STATUS : 0
HUMIDITY : 36.4
TEMPERATURE : 25.5
HEAT_CONTROL_STATUS : 0
FAN_CONTROL_STATUS : 0
THY_NAME : "상황실좌측"
HUMIDITY_CONTROL_STATUS : 0

대상  Table : FTMS.FTHY02T. THY_ID별 아래 각 칼럼 조회.
AIRFAN_CHECK : '송풍기 점검(0: 이상무, 1: 이상)';
COMP1_CHECK : '콤프1 점검(0: 이상무, 1: 이상)';
COMP2_CHECK : '콤프2 점검(0: 이상무, 1: 이상)';
TEMPSE_CHECK : '온도센서 점검(0: 이상무, 1: 이상)';
HUMSE_CHECK : '습도센서 점검(0: 이상무, 1: 이상)';
HUMDIF_CHECK : '가습기 점검(0: 이상무, 1: 이상)';
WATERLEAK_CHECK : '누수점검(0: 이상무, 1: 이상)';
HIGH_TEMPERATURE_ALARM : '고온 점검((0: 이상무, 1: 이상)';
HEATER_CHECK : '난방기 점검(0: 이상무, 1: 이상)';
LOW_POWER_ALARM : '전류 부족(0: 이상무, 1: 이상)';
WATERLINE_CHECK : '배수 점검 3회(0: 이상무, 1: 이상)';
OVERCUR_CHECK IS '가습기 과전류 점검(0: 이상무, 1: 이상)';
WATER_SUPPLY_ALARM : '급수 점검(0: 이상무, 1: 이상)';
WATERLV_CHECK : '수위봉 결선 확인(0: 이상무, 1: 이상)';


*/
import moment from 'moment';

let columns = {"POWER_STATUS":"전원상태", "HUMIDITY":"현재습도", "TEMPERATURE":"현재온도",
    "HEAT_CONTROL_STATUS":"항온상태", "FAN_CONTROL_STATUS":"휀상태", "THY_NAME":"위치",  "HUMIDITY_CONTROL_STATUS":"항습상태"}

let generateData = (datas) => {
    let keys = Object.keys(datas);
    return keys.map((key) => (
        {"title": key, "value": {
            "header":["TEMPERATURE", "HUMIDITY","POWER_STATUS", "FAN_CONTROL_STATUS", "HEAT_CONTROL_STATUS", "HUMIDITY_CONTROL_STATUS"],
            "rows":[
                {"value":[datas[key]['TEMPERATURE'],datas[key]['HUMIDITY'],
                        (datas[key]['POWER_STATUS'] === 0) ? 'ON' : 'OFF',
                        (datas[key]['FAN_CONTROL_STATUS'] === 0) ? '미가동' : '가동',
                        (datas[key]['HEAT_CONTROL_STATUS'] === 0) ? '미가동':(datas[key]['HEAT_CONTROL_STATUS'] === 0) ? '냉방중':'난방중',
                        (datas[key]['HUMIDITY_CONTROL_STATUS'] === 0) ? '미가동':(datas[key]['HUMIDITY_CONTROL_STATUS'] === 0) ? '제습중':'가습중']}
            ],
            "columns":columns,
            "thyName":datas[key]["THY_NAME"],
            "status": (datas[key]["STATUS"].length === 0) ? [{'null':'','null':'','null':''},{'null':'','null':'','null':''},{'null':'','null':'','null':''}] : datas[key]["STATUS"],
            "statusKeys": {'AIRFAN_CHECK' : '송풍기 점검', 'COMP1_CHECK' : '콤프1 점검', 'COMP2_CHECK' : '콤프2 점검', 'TEMPSE_CHECK' : '온도센서 점검',
                'HUMSE_CHECK' : '습도센서 점검', 'HUMDIF_CHECK' : '가습기 점검', 'WATERLEAK_CHECK' : '누수점검', 'HIGH_TEMPERATURE_ALARM' : '고온 점검',
                'HEATER_CHECK' : '난방기 점검', 'LOW_POWER_ALARM' : '전류 부족', 'WATERLINE_CHECK' : '배수 점검 3회', 'OVERCUR_CHECK' : '가습기 과전류 점검',
                'WATER_SUPPLY_ALARM' : '급수 점검', 'WATERLV_CHECK' : '수위봉 결선 확인'}
        }}
    ))
}

const FormatThermoHygrostat = (props) => (
    generateData(props)
)

export default FormatThermoHygrostat;
