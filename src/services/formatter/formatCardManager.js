/*
CURR_COUNT : 4245629
CDSA : "51"
THRESHOLD_COUNT : 7000000
CARD_NAME : "국민카드"


*/
import moment from 'moment';


const getCategory = (data) => (
    data.map((name) => (
        name['CARD_NAME']
    ))
)
const getData_one = (data) => (
    data.map((count) => (
        (count["THRESHOLD_COUNT"]) ? count["THRESHOLD_COUNT"]/10000 : 0
    ))

)
const getData_two = (data) => (
    data.map((curr) => (
        (curr["CURR_COUNT"]) ? curr["CURR_COUNT"]/10000 : 0
    ))

)

let generateData = (datas) => {
    let keys = Object.keys(datas);

    return {"title":"교통카드별 B/L 현황", "value": {
        "categories":getCategory(datas),
        "serise":[
            {
                "name": "마스터 최대 건수(만)",
                "data": getData_one(datas),

            }, {
                "name": "현재 마스터 건수(만)",
                "data": getData_two(datas)

            }
        ]
    }}


}


const FormatCardManager = (props) => (
    generateData(props)
)

export default FormatCardManager;