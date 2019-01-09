/*

PREV_YEAR_AVG
097
YEAR_AVG
099
ALL
PREV_MONTH_AVG
098
RATE
MONTH_AVG

라인별 KEY
인천공항    : 097 <Integer>
북인천    : 098 <Integer>
청라      : 099 <Integer>
전체      : ALL <Integer>
이용률    : RATE <Double>
월평균    : MONTH_AVG <Integer>
년평균    : YEAR_AVG <Integer>
전년월평균: PREV_MONTH_AVG <Integer>
전년평균  : PREV_YEAR_AVG <Integer>

<Column Key 정의>
현금: CASHCNT
하이패스: HIPSCNT
전자카드: ECARDCNT
교통카드: CRECARDCNT
기타: OTHERCNT
합계: SUMCNT


*/
import moment from 'moment';
import GlobalStatic from '../../sites/globalStatic';


let trimData = (datas) => {
    let newData = datas.splice(0,1);
    return datas ;
}
let generateData = (datas) => {
    let rows = [];
    let footer = [];
    let rowName = ["인천공항", "북인천", "청라", "전체", "이용률(%)", "월평균", "년평균", "전년월평균", "전년평균"];
    let office = ["097","098","099","ALL","RATE","MONTH_AVG","YEAR_AVG","PREV_MONTH_AVG","PREV_YEAR_AVG"]
    office.map((key, i) => {
        (key === 'PREV_MONTH_AVG') ?
        footer.push({"title":rowName[7], "value":
        [datas[key]['CASHCNT'] || '-',
        datas[key]['HIPSCNT'] || '-',
        datas[key]['ECARDCNT'] || '-',
        datas[key]['CRECARDCNT'] || '-',
        datas[key]['OTHERCNT'] || '-',
        datas[key]['SUMCNT'] || '-']
        })
        :
        (key === 'PREV_YEAR_AVG') ?
        footer.push({"title":rowName[8], "value":
        [datas[key]['CASHCNT'] || '-',
        datas[key]['HIPSCNT'] || '-',
        datas[key]['ECARDCNT'] || '-',
        datas[key]['CRECARDCNT'] || '-',
        datas[key]['OTHERCNT'] || '-',
        datas[key]['SUMCNT'] || '-']
        })
        :
        rows.push({"title":rowName[i], "value":
        [datas[key]['CASHCNT'] || '-',
        datas[key]['HIPSCNT'] || '-',
        datas[key]['ECARDCNT'] || '-',
        datas[key]['CRECARDCNT'] || '-',
        datas[key]['OTHERCNT'] || '-',
        datas[key]['SUMCNT'] || '-']
        })
    })
    let week = moment().format('dddd');
    let week_kr = (week === 'thusday')? '목' : '';
    let traffic = {"title":"장수수단별 교통량", "value": {
        "header":["구분","현금","하이패스","전자카드","교통카드","기타","합계"],
        "rows":rows,
        "footer":footer
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
const FormatCollectwayTraffic = (props) => (
    generateData(props)
)

export default FormatCollectwayTraffic;
