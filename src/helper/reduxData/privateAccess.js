const getObject = (self) => {
    if (self && self.props && self.props.privateAccess) {
        return self.props.privateAccess
    }
}

export const isPrivate = (self)=>{
    let info = getObject(self)
    if (info) {
        return info.isPrivate
    }
    return false
}