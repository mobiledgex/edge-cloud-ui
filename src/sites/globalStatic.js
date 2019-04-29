/*
신공항   : 097 <Integer>
북인천   : 098 <Integer>
청라     : 099 <Integer>
전체     : ALL <Integer>
인천대교 : 083 <Integer>

라인별 KEY
신공항    : 097 <Integer>
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
export default {
    offices: {"097":"인천공항", "098":"북인천", "099":"청라", "ALL":"전체", "083":"인천대교"},
    lines: {"MONTH_AVG":"월평균", "YEAR_AVG":"년평균", "PREV_MONTH_AVG":"전년월평균", "PREV_YEAR_AVG":"전년평균"},
    columnKey: {"CASHCNT":"현금", "HIPSCNT":"하이패스", "ECARDCNT":"전자카드", "OTHERCNT":"기타", "SUMCNT":"합계"}
}
