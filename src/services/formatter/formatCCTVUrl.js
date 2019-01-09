/*
CURR_COUNT : 4245629
CDSA : "51"
THRESHOLD_COUNT : 7000000
CARD_NAME : "국민카드"


*/
import moment from 'moment';



let generateData = (datas) => {
    let keys = Object.keys(datas);
    keys.sort(function (a, b) {
        if (Number(a.replace(/\CCTV/g,'')) > Number(b.replace(/\CCTV/g,''))) {return 1;}
        if (Number(a.replace(/\CCTV/g,'')) < Number(b.replace(/\CCTV/g,''))) {return -1;}
        return 0;
    });
    return {
        "title": keys,
        "value": keys.map((key) => (datas[key]))
    }


}


const FormatBLStatus = (props) => (
    generateData(props)
)

export default FormatBLStatus;