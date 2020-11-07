/* eslint-disable */
import {fetch} from './server'
import {format} from './metric'

self.addEventListener("message", processWorker);

function processWorker(event) {
    let worker = event.data
    switch (worker.type) {
        case 'server':
            fetch(worker)
            break;
        case 'process':
            format(worker)
            break;
    }
}