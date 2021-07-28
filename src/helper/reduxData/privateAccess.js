import { fields } from "../../services/model/format"

const getObject = (self) => {
    if (self && self.props && self.props.privateAccess) {
        return self.props.privateAccess
    }
    else if(self && self[fields.isPrivate])
    {
        return self
    }
}

export const isPrivate = (self)=>{
    let info = getObject(self)
    if (info) {
        return info.isPrivate
    }
    return false
}

export const regions = (self)=>{
    let info = getObject(self)
    if (info) {
        return info.regions
    }
    return false
}

export const isRegionValid = (self, region) => {
    let info = getObject(self)
    if (info) {
        return info.isPrivate && info.regions.includes(region)
    }
    return false
}