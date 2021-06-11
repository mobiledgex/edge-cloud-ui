import { endpoint } from '../../helper/constant'
import {sendAuthRequest} from './serverWorker'

export const updateUser = (self, data, callback)=>{
    let request = {method : endpoint.UPDATE_USER, data : data}
    sendAuthRequest(self, request, callback)
} 