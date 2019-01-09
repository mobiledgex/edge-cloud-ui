/*
<라인 별 Key Header 정의>
라벨은 Key 정의된 것으로 수정
북로JC: BUKRO_JC_
88JC: 88_JC_
김포IC: KIMPO_IC_
노오지JC_판교: NOOJI_JC_PANGYO_
노오지JC_일산: NOOJI_JC_ILSAN_
인천공항 TG: 097_TG_
북인천 TG: 098_TG_
청  라 TG: 099_TG_
금  산 IC: GEUMSAN_IC_
공항입구 JC: AIRPORT_ENTRANCE_JC_
신도시 IC_영종도: SINDOSI_IC_YJ_
신도시 IC_신도시: SINDOSI_IC_SN_
기점부: STARTING_POINT_

<Column Key 정의>
서울방향
진입: UP_IN <Integer>
본선: UP_MAIN <Integer>
진출: UP_OUT <Integer>

공항방향
진입: DOWN_IN <Integer>
본선: DOWN_MAIN <Integer>
진출: DOWN_OUT <Integer>

*/
import moment from 'moment';
import * as d3 from "d3";

const formatComma = d3.format(",");
const formatPercent = d3.format(".2f",".2f");
const office = [
    {"BUKRO_JC_" : "북로JC"},{"88_JC_":"88JC"},{"KIMPO_IC_":"김포IC"},{"NOOJI_JC_PANGYO_":"노오지JC_판교"},
    {"NOOJI_JC_ILSAN_":"노오지JC_일산"},{"099_TG_":"청  라 TG" },{ "097_TG_":"인천공항 TG"},{"098_TG_":"북인천 TG"},
    {"GEUMSAN_IC_":"금  산 IC"},{"AIRPORT_ENTRANCE_JC_":"공항입구 JC"},
    {"SINDOSI_IC_YJ_":"신도시 IC_영종도"},{"SINDOSI_IC_SN_":"신도시 IC_신도시"},{"STARTING_POINT_":"기점부"}
]
const directions_up = ["UP_IN", "UP_MAIN", "UP_OUT"];
const directions_down = ["DOWN_IN", "DOWN_MAIN", "DOWN_OUT"];
let trimData = (datas) => {
    let newData = datas.splice(0,1);
    return datas ;
}

let makeDigit = (value) => {
    if(typeof value === 'number') {
        return formatComma(value);
    }
    return value;
}
let generateData = (datas) => {
    let rows = [];
    let rate = [];


    office.map((key, i) => {
        let _key = Object.keys(office[i])[0];
        //let _value = Object.values(office[i])[0]; //IE 에서 지원 안함
        var _value = Object.keys(office[i]).map(e => office[i][e])
        rows.push({"title":_value,
            "value":[
                makeDigit(datas[_key+directions_down[0]]),
                makeDigit(datas[_key+directions_down[1]]),
                makeDigit(datas[_key+directions_down[2]]),
                makeDigit(datas[_key+directions_up[0]]),
                makeDigit(datas[_key+directions_up[1]]),
                makeDigit(datas[_key+directions_up[2]])
                   ]})

    })

    let traffic = {"title":"진출/입로 교통량", "value": {
        "header":[{"title":"진출입로", "multi":{"key":"colSpan","value":2}},{"title":"공항방향", "multi":{"key":"colSpan","value":3}},{"title":"서울방향", "multi":{"key":"colSpan","value":3}}],
        "subHeader":[{"title":"IC", "multi":{"key":"colSpan","value":2}},"진입","본선","진출","진입","본선","진출"],
        "rows":rows
    }}
    return [traffic]

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
const FormatInoutwayTraffic = (props) => (
    generateData(props)
)

export default FormatInoutwayTraffic;
