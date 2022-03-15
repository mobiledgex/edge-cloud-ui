import { validateExpiry } from '../../../../services/config'
import { sendRequest } from '../../../../services/worker/fetch'

let intervalId = undefined

const generateRequest = async (worker) => {
    const { requestList } = worker
    let alertList = []
    let valid = true
    await Promise.all(requestList.map(async (request) => {
        let mc = await sendRequest({ ...worker, request })
        if (mc) {
            if (mc.response?.status === 200) {
                let data = mc.response.data
                if (data?.length > 0) {
                    alertList = [...alertList, ...data]
                }
            }
            else {
                if (!validateExpiry(undefined, mc.message)) {
                    valid = false
                    postMessage({ status: 401, message: mc.message })
                    clearInterval(intervalId)
                }
            }
        }
    }))
    if (valid) {
        postMessage({ status: 200, data: { alertList } })
    }
}

export const process = (worker) => {
    generateRequest(worker)
    intervalId = setInterval(() => {
        generateRequest(worker)
    }, 30000);
}

addEventListener("message", (event) => {
    process(event.data)
});