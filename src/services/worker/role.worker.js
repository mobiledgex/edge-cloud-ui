/* eslint-disable */
import { fields } from '../model/format'
import { sendRequest } from './fetch'

const formatData = (roleInfo, org) => {
    let data = {}
    data[fields.organizationName] = org ? org[fields.organizationName] : 'Mexadmin'
    data[fields.type] = org ? org[fields.type] : 'admin'
    data[fields.edgeboxOnly] = org ? org[fields.edgeboxOnly] : undefined
    data[fields.role] = roleInfo[fields.role]
    data[fields.username] = roleInfo[fields.username]
    return data
}
const processData = async (worker) => {
    let isAdmin = false
    let roles = worker.data
    for (let roleInfo of roles) {
        if (roleInfo.role.indexOf('Admin') > -1) {
            isAdmin = true
            roleInfo.isAdmin = isAdmin
            let data = formatData(roleInfo)
            data[fields.isAdmin] = isAdmin
            self.postMessage({ isAdmin, roles: [data] })
            break;
        }
    }
    if (!isAdmin) { //for non admin we require all the org data available
        let mc = await sendRequest(worker)
        let dataList = []
        if(mc.response && mc.response.status === 200)
        {
            let orgs = mc.response.data
            for (let roleInfo of roles) {
                for (let org of orgs) {
                    if(org[fields.organizationName] === roleInfo['org'])
                    {
                        dataList.push(formatData(roleInfo, org))
                        break;
                    }
                }
            }
        }
        self.postMessage({ roles : dataList })
    }
}

export const format = (worker) => {
    processData(worker)
}

self.addEventListener("message", (event) => {
    format(event.data)
});