/*
<Map Key 정의>
이벤트 KEY  : FAULT_ID <String>
상태        : FAULT_LEVEL <String>
              info, minor, major, critical, down
              등급별 색깔 표시
  경고음 대상. (건수만큼 발생하되 반복 없음)
  critical, down일 경우, NOTIFY_3.mp3
  info, minor, major일 경우, NOTIFY_4.mp3
발생일시    : OCCURRED_TIME <java.util.Date>
영업소 ID   : OFFICE_NUM <String>
영업소 이름 : OFFICE_NAME <String>
차로        : HIWAY_NUM <String>
장비명      : DEVICE_NAME <String>
이상내역    : FAULT_MSG <String>

OCCURRED_DATE : "20180324210222"
TIMEMARK : "20180324210222"
CONFIRMYN : "N"
AL_CNT : 0
CONFIRMDATE : null
PLID : "097"
ALARMYN : "Y"
ERRLIST : "통행원시미수신"
NOTICE_LEVEL : "2"
KIND : "영상서버"
LANENO : "H상행11"
OFFICE_NAME : "신공항"

*/
import moment from 'moment';

let trimData = (datas) => {
    let newData = datas.splice(0,1);
    return datas ;
}
let generateData = (datas) => {
    let rows = [];
    datas.map((data) => {
        rows.push(
            {"title":"상태", "nLevel":data['FAULT_LEVEL'],
                "value":[data['FAULT_LEVEL'],retunDate(data['OCCURRED_TIME']),data['LANE_NAME'],data['DEVICE_NAME'],data['FAULT_MSG']]
            }
        )
    })
    if(datas.length === 0) rows.push({"title":"상태","value":["","","","",""]})
    let laneEquip = {"title":"차로 기기 이상내역", "value": {
            "header":["상태","발생일시","차로","장비명","이상내역"],
            "rows":rows
        }}
    return laneEquip;


}
const retunDate = (str) => {
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    var hour = str.substring(8, 10);
    var minute = str.substring(10, 12);
    var second = str.substring(12, 14);
    var date = new Date(year, month-1, day, hour, minute, second);
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
const FormatLaneEquip = (props) => (
    generateData(props)
)

export default FormatLaneEquip;
