import { fields, formatData } from './format'
import { UPDATE_USER } from './endpoints'
import {sendRequest} from './serverWorker'

export const updateUser = (self, data, callback)=>{
    let request = {method : UPDATE_USER, data : data}
    sendRequest(self, request, callback)
} 