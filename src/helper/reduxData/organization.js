/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { localFields } from "../../services/fields"
import { perpetual } from "../constant"

const getObject = (self) => {
    if (self && self.props && self.props.organizationInfo) {
        return self.props.organizationInfo
    }
    else if(self && self[localFields.organizationName])
    {
        return self
    }
}

export const isAdmin = (self) => {
    let info = getObject(self)
    if (info) {
        return info.type === perpetual.ADMIN
    }
    return false
}

export const isManager = (self) => {
    let info = getObject(self)
    if (info) {
        return info.role === perpetual.ADMIN_MANAGER || info.role === perpetual.DEVELOPER_MANAGER || info.role === perpetual.OPERATOR_MANAGER
    }
    return false
}

export const isDeveloperManager = (self) => {
    let info = getObject(self)
    if (info) {
        return info.role === perpetual.DEVELOPER_MANAGER
    }
    return false
}

export const isOperator = (self) => {
    let info = getObject(self)
    if (info) {
        return info.type === perpetual.OPERATOR
    }
    return false
}

export const isDeveloper = (self) => {
    let info = getObject(self)
    if (info) {
        return info.type === perpetual.DEVELOPER
    }
    return false
}

export const orgName = (self) => {
    let info = getObject(self)
    if (info) {
        return info[localFields.organizationName]
    }
}

export const role = (self) => {
    let info = getObject(self)
    if (info) {
        return info[localFields.role]
    }
}

export const isViewer = (self) => {
    let item  = role(self)
    return item && item.includes('Viewer')
}


export const roleType = (self) => {
    let info = getObject(self)
    if (info) {
        return info[localFields.type]
    }
}

export const edgeboxOnly = (self) => {
    let info = getObject(self)
    if (info) {
        return info[localFields.edgeboxOnly]
    }
    return false
}

export const nonAdminOrg = (self) => {
    return !isAdmin(self) ? orgName(self) : undefined
}

export const isAdminManager = (self) => {
    let info = getObject(self)
    if (info) {
        return info.role === perpetual.ADMIN_MANAGER
    }
    return false
}