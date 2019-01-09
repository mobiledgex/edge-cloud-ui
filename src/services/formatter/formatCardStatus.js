/*
CURR_COUNT : 4245629
CDSA : "51"
THRESHOLD_COUNT : 7000000
CARD_NAME : "국민카드"


*/
import moment from 'moment';



let generateData = (datas) => {
    let keys = Object.keys(datas);

    return {"title":"감면 현황", "value": {
            "header":["면제", "지역주민"],
            "rows":[
                {"value":[datas['REDUCTION_EXEMPTION'],datas['REDUCTION_RESIDENT']]}
            ]
        }}


}


const FormatCardStatus = (props) => (
    generateData(props)
)

export default FormatCardStatus;