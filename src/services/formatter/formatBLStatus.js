/*
CURR_COUNT : 4245629
CDSA : "51"
THRESHOLD_COUNT : 7000000
CARD_NAME : "국민카드"


*/
import moment from 'moment';



let generateData = (datas) => {
    let keys = Object.keys(datas);

    return {"title":"BL 현황", "value": {
            "header":["전자카드", "교통카드"],
            "rows":[
                {"value":[datas[0]*10000,datas[1]*10000]}
            ]
        }}


}


const FormatBLStatus = (props) => (
    generateData(props)
)

export default FormatBLStatus;