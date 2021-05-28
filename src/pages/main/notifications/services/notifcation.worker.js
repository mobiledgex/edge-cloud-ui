/* eslint-disable */
import { sendRequest } from '../../../../services/worker/fetch'

export const process = async (worker) => {
    const { request, activeAt } = worker
    let mc = await sendRequest(worker)
    if (mc && mc.response && mc.response.status === 200) {
        let data = mc.response.data
        if (data && data.length > 0) {
            let latestData = data[data.length - 1]
            let showDot = false
            if (activeAt) {
                showDot = latestData.activeAt > activeAt
            }
            else {
                showDot = true
            }
            self.postMessage({ status: 200, data: { data, showDot, activeAt: latestData.activeAt, region:request.data.region } })
        }
    }
}

self.addEventListener("message", (event) => {
    process(event.data)
});