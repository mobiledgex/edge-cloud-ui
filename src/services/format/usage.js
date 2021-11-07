import { MEX_PROMETHEUS_APP_NAME } from "../../helper/constant/perpetual";

export const formatUsageData = (request, response) => {
    let formattedData = []
    try {
        if (response && response.status === 200 && response.data && response.data.data) {
            let dataList = response.data.data;
            if (dataList && dataList.length > 0) {
                let series = dataList[0].Series
                let messages = dataList[0].messages
                if (series && series.length > 0) {
                    series.map(data => {
                        let columns = data.columns
                        let values = data.values
                        for (let value of values) {
                            if (value.includes(MEX_PROMETHEUS_APP_NAME)) {
                                continue;
                            }
                            let data = {}
                            columns.map((column, i) => {
                                data[column] = value[i]
                            })
                            formattedData.push(data)
                        }
                    })
                }
            }
        }
    }
    catch (e) {
        //alert(e)
    }
    return formattedData
}