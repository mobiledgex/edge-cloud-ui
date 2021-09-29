import { fields } from "../../services/model/format"
import { perpetual } from "../constant"

const getObject = (self) => {
    if (self && self.props && self.props.organizationInfo) {
        return self.props.organizationInfo
    }
    else if(self && self[fields.organizationName])
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
        return info[fields.organizationName]
    }
}

export const role = (self) => {
    let info = getObject(self)
    if (info) {
        return info[fields.role]
    }
}

export const isViewer = (self) => {
    let item  = role(self)
    return item && item.includes('Viewer')
}


export const roleType = (self) => {
    let info = getObject(self)
    if (info) {
        return info[fields.type]
    }
}

export const edgeboxOnly = (self) => {
    let info = getObject(self)
    if (info) {
        return info[fields.edgeboxOnly]
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