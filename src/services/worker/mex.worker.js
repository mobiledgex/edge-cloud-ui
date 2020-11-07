/* eslint-disable */
import {fetch} from './server'
import {format} from './metric'
import * as constant from './constant'

self.addEventListener("message", processWorker);

function processWorker(event) {
    let worker = event.data
    switch (worker.type) {
        case constant.WORKER_SERVER:
            fetch(worker)
            break;
        case constant.WORKER_METRIC:
            format(worker)
            break;
    }
}