/* eslint-disable */
import { formatData } from "../../../../services/model/endpoints"

const processData = (worker) => {
    const { dataList, region } = worker
    let data = []
    dataList.map(clientData => {
        let dataObject = clientData['dme-api'].values
        Object.keys(dataObject).map(key => {
            let findCloudlet = 0
            let registerClient = 0
            let verifyLocation = 0
            dataObject[key].map(data => {
                findCloudlet += data.includes('FindCloudlet') ? 1 : 0
                registerClient += data.includes('RegisterClient') ? 1 : 0
                verifyLocation += data.includes('VerifyLocation') ? 1 : 0
            })
            data.push({ key: `${region} -  ${dataObject[key][0][7]} [${dataObject[key][0][18]}]`, findCloudlet, registerClient, verifyLocation })
        })
    })
    self.postMessage({ data })
}

export const format = (worker) => {
    const { response } = formatData(worker.request, worker.response)
    let dataList = response.data
    if (dataList.length > 0) {
        processData({ ...worker, dataList })
    }
}

self.addEventListener("message", (event) => {
    format(event.data)
});