import { validateExpiry } from "../config"

export const postMessage = (worker, message, self) => new Promise((resolve, reject) => {
    const resolution = (event) => {
        let response = event.data
        worker.removeEventListener('message', resolution)
        if (response && response.status === 200) {
            resolve(response)
        }
        else {
            console.log(self, response)
            if (validateExpiry(self, response.message)) {
                reject(response)
            }
        }
    }
    worker.addEventListener('message', resolution)
    worker.postMessage(message)
})

export const processWorker = async (self, worker, object) => {
    try {
        return await postMessage(worker, { ...object }, self)
    }
    catch (e) {
        return undefined
    }
}