/* eslint-disable */
import { fetch } from './server'
import { format as metric } from './metric'
import { format as role } from './role'
import { format as show } from './monitoring/show'
import { format as flavorusage } from './monitoring/flavorUsage'
import * as constant from './constant'

self.addEventListener("message", processWorker);

function processWorker(event) {
    let worker = event.data
    switch (worker.type) {
        case constant.WORKER_SERVER:
            fetch(worker)
            break;
        case constant.WORKER_METRIC:
            metric(worker)
            break;
        case constant.WORKER_ROLE:
            role(worker)
            break;
        case constant.WORKER_MONITORING_SHOW:
            show(worker)
            break;
        case constant.WORKER_MONITORING_FLAVOR_USAGE:
            flavorusage(worker)
            break;
    }
}