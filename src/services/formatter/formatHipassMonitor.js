/*
[서울방향 TCS]
통신상태: UP_COMSTAT  <Map> : 01 ~ 10, 11H, 12H
신 호 등: UP_SIGNSTAT <Map> : 01 ~ 10, 11H, 12H
근무상태: UP_WORKSTAT <Map> : 01 ~ 10, 11H, 12H
전자카드: UP_LCYB     <Map> : 01 ~ 10, 11H, 12H
교통카드: UP_GCYB     <Map> : 01 ~ 10, 11H, 12H

[공향방향 TCS]
통신상태: DOWN_COMSTAT  <Map> : 01 ~ 10, 11H, 12H
신 호 등: DOWN_SIGNSTAT <Map> : 01 ~ 10, 11H, 12H
근무상태: DOWN_WORKSTAT <Map> : 01 ~ 10, 11H, 12H
전자카드: DOWN_LCYB     <Map> : 01 ~ 10, 11H, 12H
교통카드: DOWN_GCYB     <Map> : 01 ~ 10, 11H, 12H

북인천 : 일반도로 01 ~ 04, 하이패스 04H, 05H
청  라 : 일반도로 01 ~ 02, 하이패스 02H, 03H

*************************************************
{"title":"공항방향TCS", "value": {
    "header":["구분","1","2","3","4","5","6","7","8","9","10","11","12"],
    "rows":[
        {"title":"통신상태","value":["0","3","0","0","3","0","2","0","0","1","0","0"]},
        {"title":"신호등","value":["on","on","off","on","on","on","on","on","on","on","on","on"]},
        {"title":"근무상태","value":["null","홍석범","최종철","김정훈","김미라","null","홍석범","최종철","김정훈","김미라","3061","3061"]}
    ],
    "footer":[{"title":"개정현황","value":["미등록","등록","등록","등록","등록","등록","등록","등록","등록","등록","미등록","미등록"]}]
}},
{"title":"서울방향TCS", "value": {
    "header":["구분","1","2","3","4","5","6","7","8","9","10","11","12"],
    "rows":[
        {"title":"통신상태","value":["3","3","3","0","3","0","0","0","0","0","0","0"]},
        {"title":"신호등","value":["off","off","off","on","on","on","on","on","on","on","on","on"]},
        {"title":"근무상태","value":["null","홍길동","트와이스","러블리즈","블랙로즈","엑소","방탄소년","몬스타","null","김미라","3061","3061"]}
    ],
    "footer":[{"title":"개정현황","value":["미등록","등록","등록","등록","등록","등록","등록","등록","등록","등록","미등록","미등록"]}]
}}


*/
import moment from 'moment';
let sortData = (datas, direction, directionNm, tcsLength) => {
    let keys = Object.keys(datas[direction+'_COMSTAT']);
    let header = [directionNm];
    let keysOne = [];
    let keysTwo = [];
    keys.map(key => (
        (key.indexOf('H') > -1) ? keysTwo.push(key) : keysOne.push(key)
    ))
    //sort keys
    //sort data for Top
    keysOne.sort(function (a, b) {
        if (Number(a) > Number(b)) {return 1;}
        if (Number(a) < Number(b)) {return -1;}
        return 0;
    });
    keysTwo.sort(function (a, b) {
        if (Number(a.replace(/\H/g,'')) > Number(b.replace(/\H/g,''))) {return 1;}
        if (Number(a.replace(/\H/g,'')) < Number(b.replace(/\H/g,''))) {return -1;}
        return 0;
    });
    //지역에 따른 차로의 개수가 다름
    keysOne = keysOne.slice(0, tcsLength)

    keys = keysOne.concat(keysTwo);
    header = header.concat(keysOne.concat(keysTwo));
    console.log('sorted keys == '+keys);
    let comstat = keys.map((item) => (
        datas[direction+'_COMSTAT'][item]
    ));
    let signstat = keys.map((item) => (
        datas[direction+'_SIGNSTAT'][item]
    ));
    let workstat = keys.map((item) => (
        datas[direction+'_WORKSTAT'][item]
    ));
    let lcyb = keys.map((item) => (
        datas[direction+'_LCYB'][item]
    ));
    let gcyb = keys.map((item) => (
        datas[direction+'_GCYB'][item]
    ));
    return {header:header, hd1:keysOne, hd2:keysTwo, comstat:comstat, workstat:workstat, signstat:signstat, lcyb:lcyb, gcyb:gcyb}
}
let generateData = (datas) => {
    let subheader = '';
    let tcsLength = [];
    switch(global.areaCode.mainPath) {
        case '/site1': subheader = {titles:['축중', '단차로', '다차로'], values:[1,2,2]}; tcsLength = 8; break;
        case '/site2': subheader = {titles:['축중', '단차로'], values:[1,2]}; tcsLength = 4; break;
        case '/site3': subheader = {titles:['축중', '단차로'], values:[1,2]}; tcsLength = 2; break;
    }
    //공항방향
    let downDatas = sortData(datas, 'DOWN', '공항방향', tcsLength);
    //서울방향
    let upDatas = sortData(datas, 'UP', '서울방향', tcsLength);


    let downs = {"title":"TCS", "division":[downDatas.hd1, downDatas.hd2], "value": {
        "header":downDatas.header,
        "subHeader":subheader,
        "rows":[
            {"title":"통신상태","value":downDatas.comstat},
            {"title":"신호등","value":downDatas.signstat},
            {"title":"근무상태","value":downDatas.workstat}
        ],
        "footer":[
            {"title":"전자카드","value":downDatas.lcyb},
            {"title":"교통카드","value":downDatas.gcyb}
        ]
    }}
    let ups = {"title":"TCS", "division":[upDatas.hd1, upDatas.hd2], "value": {
        "header":upDatas.header,
        "subHeader":subheader,
        "rows":[
            {"title":"통신상태","value":upDatas.comstat},
            {"title":"신호등","value":upDatas.signstat},
            {"title":"근무상태","value":upDatas.workstat}
        ],
        "footer":[
            {"title":"전자카드","value":upDatas.lcyb},
            {"title":"교통카드","value":upDatas.gcyb}
        ]
    }}


    return [downs, ups]

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
const FormatHipassMonitor = (props) => (
    generateData(props)
)

export default FormatHipassMonitor;
