export const postMessage = (worker, message) => new Promise((resolve, reject) => {
    const resolution = (event) => {
        let response = event.data
        worker.removeEventListener('message', resolution)
        if (response && response.status === 200) {
            resolve(response)
        }
        else {
            if (checkExpiry(self, response.message)) {
                reject(response)
            }
        }
    }
    worker.addEventListener('message', resolution)
    worker.postMessage(message)
})

export const processWorker = async (worker, object) => {
    try {
        return await postMessage(worker, { ...object })
    }
    catch (e) {
        return undefined
    }
}