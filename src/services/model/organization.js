import React from 'react'
import { fields, formatData } from './format'

export const SHOW_ORG = "showOrg";
export const DELETE_ORG = "deleteOrg";

export const additionalDetail = (data) => {
    return (
        <div style={{ margin: 20, color: 'white' }}>
            <div className="newOrg3-2">
                <div>
                    If your image is docker, please upload your image with your MobiledgeX Account Credentials to our docker registry using the following docker commands.
                </div>
                <br></br>
                <div>
                    {`$ docker login -u <username> docker.mobiledgex.net`}
                </div>
                <div>
                    {`$ docker tag <your application> docker.mobiledgex.net/` + String(data[fields.organizationName]).toLowerCase() + `/images/<application name>:<version>`}
                </div>
                <div>
                    {`$ docker push docker.mobiledgex.net/` + String(data[fields.organizationName]).toLowerCase() + `/images/<application name>:<version>`}
                </div>
                <div>
                    $ docker logout docker.mobiledgex.net
                </div>
            </div>
            <br></br>
            <div className="newOrg3-3">
                <div>
                    If you image is VM, please upload your image with your MobiledgeX Account Credentials to our VM registry using the following curl command.
                </div>
                <br />
                <div>
                    {'$ curl -u<username> -T <path_to_file>'} <code style={{ color: '#76ff03' }}>{`"https://artifactory.mobiledgex.net/artifactory/repo-${data[fields.organizationName]}/<target_file_path>"`}</code> {'--progress-bar -o <upload status filename>'}
                </div>
            </div>
        </div>)
}

export const keys = [
    { field: fields.organizationName, serverField: 'Name', label: 'Organization', sortable: true, visible: true },
    { field: fields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true },
    { field: fields.phone, serverField: 'Phone', label: 'Phone', sortable: false, visible: true },
    { field: fields.address, serverField: 'Address', label: 'Address', sortable: false, visible: true },
    { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data) => {
    return ({
        name: data[fields.organizationName],
        type: data[fields.type],
        address: data[fields.address],
        phone: data[fields.phone]
    })
}

export const showOrganizations = (data) => {
    return { method: SHOW_ORG, data: data }
}

export const deleteOrganization = (data) => {
    let requestData = getKey(data);
    return { method: DELETE_ORG, data: requestData, success: `Organization ${data[fields.organizationName]}` }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData)
}