import { UPDATE_USER } from './endpoints'
import {sendAuthRequest} from './serverWorker'

export const updateUser = (self, data, callback)=>{
    let request = {method : UPDATE_USER, data : data}
    sendAuthRequest(self, request, callback)
} 