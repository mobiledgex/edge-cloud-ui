/*
<COLUMN INDEX 정의>
0: 시간대,   HOUR
1: 금일,     TODAY
2: 전주(화), PREV_WEEK_DAY
3: 전주,     PREV_WEEK
4: 전년월,   PREV_YEAR_MONTH
5: 전년,     PREV_YEAR
6: 금년,     CURR_YEAR

③ <LINE INDEX 정의>
0: 4시간 전
1: 3시간 전
2: 2시간 전
3: 3시간 전
4: 평균

② KEY: TRAFFIC_HOUR_RATE – double[7]
          증감률
2: 전주(화), PREV_WEEK_DAY
3: 전주,     PREV_WEEK
4: 전년월,   PREV_YEAR_MONTH
5: 전년,     PREV_YEAR
6: 금년,     CURR_YEAR


{"TRAFFIC_HOUR_RATE":[0,0,0,0,0,0,0],
"TRAFFIC_HOUR_TABLE":[[13,0,0,0,0,0,0],[14,0,0,0,0,0,0],[15,0,0,0,0,0,0],[16,0,0,0,0,0,0],[0,0,0,0,0,0,0]]}
*************************************************
{"title":"시간대별 교통량", "value": {
    "header":["시간대","금일","전주(화)","전주","전년월","전년","금년"],
    "rows":[
        {"title":"~07시","value":["14192","14192","14192","14192","14192","14192"]},
        {"title":"~08시","value":["14059","14059","14059","14059","14059","14059"]},
        {"title":"~09시","value":["16460","16460","16460","16460","16460","16460"]},
        {"title":"~10시","value":["18871","18871","18871","18871","18871","18871"]},
        {"title":"~11시","value":["21450","21450","21450","21450","21450","21450"]},
        {"title":"~12시","value":["14312","14312","14312","14312","14312","14312"]},
        {"title":"~13시","value":["14263","14263","14263","14263","14263","14263"]}
    ],
    "footer":[
        {"title":"증감률(%)","value":["","0.6","0.6","0.6","0.6","0.6"]},
        {"title":"평균","value":["21450","21450","21450","21450","21450","21450"]}
    ]
}},


*/
import moment from 'moment';

let trimData = (datas) => {
    let newData = datas.splice(0,1);
    return datas ;
}
let generateData = (datas) => {
    let laneEquip = {"title":"차로 기기 이상내역", "value": {
        "header":["상태","발생일시","영업소","차로","장비명","이상내역"],
        "rows":[
            {"title":"상태","value":["0","03/19 18:33:22","인천공항","01","요금터미널","UPS 전원이상"]},
            {"title":"상태","value":["1","03/18 18:33:22","북인천","01","요금터미널","UPS 전원이상"]},
            {"title":"상태","value":["3","03/18 18:33:22","인천공항","01","요금터미널","UPS 전원이상"]},
            {"title":"상태","value":["0","03/18 18:33:22","인천공항","01","요금터미널","UPS 전원이상"]},
            {"title":"상태","value":["0","03/18 18:33:22","인천공항","01","요금터미널","UPS 전원이상"]},
            {"title":"상태","value":["2","03/18 18:33:22","인천공항","01","요금터미널","UPS 전원이상"]},
            {"title":"상태","value":["0","03/18 18:33:22","인천공항","01","요금터미널","UPS 전원이상"]}
        ]
    }}

    let laneGather = {"title":"차로 자료수집 이상내역", "value": {
        "header":["상태","발생일시","영업소","차로","수집구분","이상내역"],
        "rows":[
            {"title":"상태","value":["2","03/19 18:33:22","인천공항","01","통행원시","수립 이상1"]},
            {"title":"상태","value":["1","03/18 18:33:22","북인천","01","영상원시","수립 이상2"]},
            {"title":"상태","value":["0","03/18 18:33:22","인천공항","01","통행원시","수립 이상3"]},
            {"title":"상태","value":["3","03/18 18:33:22","인천공항","01","통행원시","수립 이상4"]},
            {"title":"상태","value":["0","03/18 18:33:22","인천공항","01","통행원시","수립 이상5"]},
            {"title":"상태","value":["0","03/18 18:33:22","인천공항","01","통행원시","수립 이상6"]},
            {"title":"상태","value":["0","03/18 18:33:22","인천공항","01","통행원시","수립 이상7"]}
        ]
    }}
    return [laneEquip, laneGather]

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
const FormatHipassMonitorLane = (props) => (
    generateData(props)
)

export default FormatHipassMonitorLane;
