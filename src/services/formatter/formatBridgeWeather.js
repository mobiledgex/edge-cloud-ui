/*
기상정보
Map<KEY, Map> getBridgeWeatherInfos()

갱신주기: 1분

<다리별 Key 정의>
신도시IC교    : JAWI00100000
영종대교      : JAWI00200000
귤현3교       : JAWI00300000
방화대교      : JAWI00400000
[송도]STA 7+0 : 0002WIS00S
[공항]STA 10+6: 0003WIS00A

<Column Key 정의>
온도      : TEMP_AIR <Double>
습도      : HUMIDITY <Double>
풍속_최대 : WIND_SPD_MAX <Double>
풍속_평균 : WIND_SPD_AVG <Double>
풍향      : WIND_DIR <String>
가시거리  : SIGHTDIST <Double>


{"JAWI00100000":{"WIND_SPD_AVG":5.3,"HUMIDITY":54,"SIGHTDIST":5724,"TEMP_AIR":-3.1,"WIND_DIR":"서북서","WIND_DIR_ANGLE":298,"WIS_ID":"JAWI00100000","WIND_SPD_MAX":8.4},"JAWI00600000":{"WIND_SPD_AVG":9.2,"HUMIDITY":53.4,"SIGHTDIST":20000,"TEMP_AIR":-3.1,"WIND_DIR":"북북서","WIND_DIR_ANGLE":338,"WIS_ID":"JAWI00600000","WIND_SPD_MAX":18},"JAWI00700000":{"WIND_SPD_AVG":1.4,"HUMIDITY":52,"SIGHTDIST":15284,"TEMP_AIR":-3.1,"WIND_DIR":"북서","WIND_DIR_ANGLE":305,"WIS_ID":"JAWI00700000","WIND_SPD_MAX":2.1},"0003WIS00A":{"WIND_SPD_AVG":7.7,"HUMIDITY":59.6,"SIGHTDIST":65000,"TEMP_AIR":-3.9,"WIND_DIR":"북서","WIND_DIR_ANGLE":312.2,"WIS_ID":"0003WIS00A","WIND_SPD_MAX":11.3},"JAWI00400000":{"WIND_SPD_AVG":8.4,"HUMIDITY":57,"SIGHTDIST":17214,"TEMP_AIR":-3.9,"WIND_DIR":"북서","WIND_DIR_ANGLE":310,"WIS_ID":"JAWI00400000","WIND_SPD_MAX":7.9},"JAWI00500000":{"WIND_SPD_AVG":12.8,"HUMIDITY":57,"SIGHTDIST":20000,"TEMP_AIR":-3.5,"WIND_DIR":"북","WIND_DIR_ANGLE":353.5,"WIS_ID":"JAWI00500000","WIND_SPD_MAX":18.6},"JAWI00300000":{"WIND_SPD_AVG":5,"HUMIDITY":51,"SIGHTDIST":18662,"TEMP_AIR":-3.5,"WIND_DIR":"서북서","WIND_DIR_ANGLE":284,"WIS_ID":"JAWI00300000","WIND_SPD_MAX":7.6},"0002WIS00S":{"WIND_SPD_AVG":8,"HUMIDITY":55.7,"SIGHTDIST":0,"TEMP_AIR":-3.6,"WIND_DIR":"서북서","WIND_DIR_ANGLE":300.9,"WIS_ID":"0002WIS00S","WIND_SPD_MAX":9.5},"JAWI00200000":{"WIND_SPD_AVG":11.8,"HUMIDITY":54,"SIGHTDIST":18686,"TEMP_AIR":-4,"WIND_DIR":"북북동","WIND_DIR_ANGLE":18,"WIS_ID":"JAWI00200000","WIND_SPD_MAX":8}}
*************************************************
"statusWeather": [
    {"title":"신도시 IC교", "value": {
        "header":["온도", "습도", "풍속", "풍향", "가시거리"],
        "header2":"1.65",
        "rows":[
            {"value":["thermometer half","theme","flag","compass","find"]},
            {"value":["4.8","25.7","8.4/6.5","서","10"]}
        ]
    }},

]


*/
import moment from 'moment';

import * as d3 from 'd3';
//text foramt    http://bl.ocks.org/mstanaland/6106487
/*
{'JAWI00400000':'방화대교'},
    {'JAWI00300000':'귤현3교'},
    {'JAWI00100000':'신도시IC교'},
    {'JAWI00700000':'인천공항영업소'},
    {'JAWI00500000':'영종대교'},
    {'JAWI00200000':'영종대교'},
    {'JAWI00600000':'영종대교'},
    {'0003WIS00A':'인천대교'},
    {'0002WIS00S':'인천대교'}
*/
const formatComma = d3.format(",");
const formatPoint = d3.format(".2f");
let areas = [
    'JAWI00400000',
    'JAWI00300000',
    'JAWI00100000',
    'JAWI00700000',
    'JAWI00500000',
    'JAWI00200000',
    'JAWI00600000',
    '0003WIS00A',
    '0002WIS00S'
]
let formatKilo = (value) => {

    let kilo = value / 1000;

    return kilo;
}
let generateData = (datas) => {
    let objKeys = Object.keys(datas);
    return objKeys.map((key) => (
        {"title":key, "value": {
            "header":["온도(℃)", "습도(%)", "풍속(m/s)", "풍향", "가시거리"],
            "header1":(datas[key]['FAC_LOCATION'] === null)?'-': datas[key]['FAC_LOCATION'],
            "header2":(datas[key]['LOC_NM'] === null)?'-': datas[key]['LOC_NM'],
            "rows":[
                {"value":["thermometer half","theme","flag","compass","find"]},
                {"value":[datas[key]['TEMP_AIR'],datas[key]['HUMIDITY'],datas[key]['WIND_SPD_AVG']+"/"+datas[key]['WIND_SPD_MAX'],datas[key]['WIND_DIR'],formatKilo(datas[key]['SIGHTDIST'])]}
            ]
        }}
    ))
}

const FormatBridgeWeather = (props) => (
    generateData(props)
)

export default FormatBridgeWeather;
