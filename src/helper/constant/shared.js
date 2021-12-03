import { perpetual } from "."

export const isPathOrg = (self)=>{
    return self.props.history.location.pathname.includes(perpetual.PAGE_ORGANIZATIONS.toLowerCase())
}

export const tokenRequired = ()=>{
    const list = ['localhost', 'kubernetes.docker.internal']
    return list.includes(window.location.hostname)
}