/* eslint-disable */

import { formatUsageData } from "../../../../services/model/format"

const processData = (worker)=>{
    console.log('Rahul1234', worker.dataList)
}
const format = (worker) => {
    
   console.log('Rahul1234', worker)
   let mc =  formatUsageData(worker.response, worker.request.data, worker.request.keys)
   console.log('Rahul1234', mc)
}

self.addEventListener("message", (event) => {
    format(event.data)
});