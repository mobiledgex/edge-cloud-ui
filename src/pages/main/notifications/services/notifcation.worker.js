/* eslint-disable */
import { sendRequest } from '../../../../services/worker/fetch'
export const process = async (worker) => {
    const { request } = worker
    let mc = await sendRequest(worker)
    if (mc && mc.response && mc.response.status === 200) {
        let data = mc.response.data
        if (data && data.length > 0) {
            self.postMessage({ status: 200, data: { data, region: request.data.region } })
        }
    }
}

self.addEventListener("message", (event) => {
    process(event.data)
});