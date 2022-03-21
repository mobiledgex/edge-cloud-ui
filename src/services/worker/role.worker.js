/* eslint-disable */
import { localFields } from '../fields'
import { sendRequest } from './fetch'

const formatData = (roleInfo, org) => {
    let data = {}
    data[localFields.organizationName] = org ? org[localFields.organizationName] : 'Mexadmin'
    data[localFields.type] = org ? org[localFields.type] : 'admin'
    data[localFields.edgeboxOnly] = org ? org[localFields.edgeboxOnly] : undefined
    data[localFields.role] = roleInfo[localFields.role]
    data[localFields.username] = roleInfo[localFields.username]
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
            data[localFields.isAdmin] = isAdmin
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
                    if(org[localFields.organizationName] === roleInfo['org'])
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