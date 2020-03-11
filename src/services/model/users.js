import React from 'react'
import { fields, formatData } from './format'

export const SHOW_USERS = "ShowUsers";
export const DELETE_USER = "DeleteUser";

const roleMark = (data, isDetailView) => {
    if (isDetailView) {
        return data
    }
    else {
        let role = data[fields.role]
        let symbol = (role.indexOf('Admin') !== -1 && role.indexOf('Manager') !== -1) ? <div className="mark markA markS">S</div> :
            (role.indexOf('Developer') !== -1 && role.indexOf('Manager') !== -1) ?
                <div className="mark markD markM">M</div> :
                (role.indexOf('Developer') !== -1 && role.indexOf('Contributor') !== -1) ?
                    <div className="mark markD markC">C</div> :
                    (role.indexOf('Developer') !== -1 && role.indexOf('Viewer') !== -1) ?
                        <div className="mark markD markV">V</div> :
                        (role.indexOf('Operator') !== -1 && role.indexOf('Manager') !== -1) ?
                            <div className="mark markO markM">M</div> :
                            (role.indexOf('Operator') !== -1 && role.indexOf('Contributor') !== -1) ?
                                <div className="mark markO markC">C</div> :
                                (role.indexOf('Operator') !== -1 && role.indexOf('Viewer') !== -1) ?
                                    <div className="mark markO markV">V</div> : <div></div>

        return (
            <div>
                <div className="markBox">{symbol}</div>
                <label>{data[fields.role]}</label>
            </div>)
    }

}

export const keys = [
    { field: fields.organizationName, serverField: 'org', label: 'Username', visible: true },
    { field: fields.username, serverField: 'username', label: 'Organization', visible: true },
    { field: fields.role, serverField: 'role', label: 'Role Type', visible: true, customizedData: roleMark },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data) => {
    return ({
        org: data[fields.username],
        username: data[fields.username],
        role: data[fields.role]
    })
}

export const showUsers = (data) => {
    return { method: SHOW_USERS, data: data }
}

export const deleteUser = (data) => {
    let requestData = getKey(data);
    return { method: DELETE_USER, data: requestData, success: `User ${data[fields.username]}` }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData)
}