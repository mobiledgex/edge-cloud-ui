/* eslint-disable */
import { formatData } from '../format'

self.addEventListener("message", (event) => {
    let worker = event.data
    const { response } = formatData(worker.request, worker.response)
    self.postMessage(response.data)
});