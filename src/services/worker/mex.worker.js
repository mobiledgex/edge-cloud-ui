/* eslint-disable */
import { format as role } from './role'
import { format as flavorusage } from './monitoring/flavorUsage'
import * as constant from './constant'

self.addEventListener("message", processWorker);

function processWorker(event) {
    let worker = event.data
    switch (worker.type) {
        case constant.WORKER_ROLE:
            role(worker)
            break;
        case constant.WORKER_MONITORING_FLAVOR_USAGE:
            flavorusage(worker)
            break;
    }
}