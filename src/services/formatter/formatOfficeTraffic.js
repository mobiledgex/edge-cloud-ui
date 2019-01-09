/*

097
099
ALL
098
RATE
083
<Line Key 정의>
신공항   : 097 <Integer>
북인천   : 098 <Integer>
청라     : 099 <Integer>
전체     : ALL <Integer>
인천대교 : 083 <Integer>
비율     : RATE <Double>

<Column Key 정의>
금일       : CURR_DAY
전일       : PREV_DAY
전주(화)   : PREV_WEEK_DAY
전주평균   : PREV_WEEK_AVG
금년평균   : CURR_YEAR_AVG
전년월평균 : PREV_YEAR_MONTH_AVG
전년평균   : PREV_YEAR_AVG

PREV_YEAR_AVG : 48523
PREV_WEEK_AVG : 49905
PREV_DAY : 45926
OFFICE_NUM : "097"
PREV_YEAR_MONTH_AVG : 45159
PREV_WEEK_DAY : 47307
CURR_YEAR_AVG : 50376
CURR_DAY : 44871
*/
import moment from 'moment';
import * as d3 from 'd3';
//text foramt    http://bl.ocks.org/mstanaland/6106487
/*
Starting number: 1500
d3.format(",") : 1,500
d3.format(".1f") : 1500.0
d3.format(",.2f") : 1,500.00
d3.format("s") : 1.5k
d3.format(".1s") : 2k
d3.format(".2s") : 1.5k
function(d) { return "$" + d3.format(",.2f")(d); } : $1,500.00
d3.format(",.2%") : 150,000.00%
*/
import GlobalStatic from '../../sites/globalStatic';
const formatComma = d3.format(",");
const formatPercent = d3.format(".2f",".2f");
const week_kr = ["월","화","수","목","금","토","일"]
let trimData = (datas) => {
    let newData = datas.splice(0,1);
    return datas ;
}
let generateData = (datas) => {
    let rows = [];
    let rate = [];
    let office = Object.keys(datas);
    office = ['097','098','099','ALL','083','RATE'];
    office.map((key) => {
        (key !== 'RATE') ? rows.push({"title":GlobalStatic.offices[key], "value":
        [datas[key]['CURR_DAY'] || '-',
        datas[key]['PREV_DAY'] || '-',
        datas[key]['PREV_WEEK_DAY'] || '-',
        datas[key]['PREV_WEEK_AVG'] || '-',
        datas[key]['CURR_YEAR_AVG'] || '-',
        datas[key]['PREV_YEAR_MONTH_AVG'] || '-',
        datas[key]['PREV_YEAR_AVG'] || '-']
        })
        :
        rate.push({"title":'증감률(%)', "value":
        [datas[key]['CURR_DAY'] || '-',
        datas[key]['PREV_DAY'] || '-',
        datas[key]['PREV_WEEK_DAY'] || '-',
        datas[key]['PREV_WEEK_AVG'] || '-',
        datas[key]['CURR_YEAR_AVG'] || '-',
        datas[key]['PREV_YEAR_MONTH_AVG'] || '-',
        datas[key]['PREV_YEAR_AVG'] || '-']
        })
    })
    let week = moment().format('E');
    console.log('today == '+moment().format('YYYY-MM-DD'), week-1, week_kr[(week-1)])
    let getWeek = week_kr[(week-1)];
    let traffic = {"title":"시간대별 교통량", "value": {
        "header":["시간대","금일","전일",`전주(${getWeek})`,"전주평균","금년평균","전년월평균","전년평균"],
        "rows":rows,
        "footer":rate
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
const FormatOfficeTraffic = (props) => (
    generateData(props)
)

export default FormatOfficeTraffic;
