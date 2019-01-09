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
3: 1시간 전
4: 평균

② KEY: TRAFFIC_HOUR_RATE – double[7]
          증감률
2: 전주(화), PREV_WEEK_DAY
3: 전주,     PREV_WEEK
4: 전년월,   PREV_YEAR_MONTH
5: 전년,     PREV_YEAR
6: 금년,     CURR_YEAR


{"TRAFFIC_HOUR_RATE":[0.0,0.0,-3.4988439737470167,2.840480069943965,12.694472569705283,7.897013602960338,6.176018053133655],
"TRAFFIC_HOUR_TABLE":[[17,82225,84422,79088,72174,75402,77001],[18,90589,93460,87099,79471,82940,84599],[19,98077,101300,94882,86629,90395,91972],[20,103511,107264,100652,91851,95935,97490],[0,105404,121963,114438,104075,109066,110932]]})

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
const week_kr = ["월","화","수","목","금","토","일"]
let week = moment().format('E');
let getWeek = week_kr[(week-1)];
let generateData = (datas) => {
    let trafficHour = datas['TRAFFIC_HOUR_TABLE'];
    let trafficRate = datas['TRAFFIC_HOUR_RATE'];
    let traffic = {"title":"시간대별 교통량", "value": {
        "header":["시간대","금일",`전주(${getWeek})`,"전주","전년월","전년","금년"],
        "rows":[
            {"title":"4시간 전","value":trimData(trafficHour[0])},
            {"title":"3시간 전","value":trimData(trafficHour[1])},
            {"title":"2시간 전","value":trimData(trafficHour[2])},
            {"title":"1시간 전","value":trimData(trafficHour[3])}
        ],
        "footer":[
            {"title":"증감률(%)","value":trimData(trafficRate)},
            {"title":"평균","value":trimData(trafficHour[4])}
        ]
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
const FormatHipassMonitorTraffic = (props) => (
    generateData(props)
)

export default FormatHipassMonitorTraffic;
