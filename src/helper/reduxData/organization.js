import { ADMIN, DEVELOPER, OPERATOR } from "../../constant"
import { fields } from "../../services/model/format"

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
        return info.type === ADMIN
    }
    return false
}

export const isOperator = (self) => {
    let info = getObject(self)
    if (info) {
        return info.type === OPERATOR
    }
    return false
}

export const isDeveloper = (self) => {
    let info = getObject(self)
    if (info) {
        return info.type === DEVELOPER
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
    return !isAdmin(self) && orgName(self)
}