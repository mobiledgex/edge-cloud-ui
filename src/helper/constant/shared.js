import { perpetual } from "."

export const isPathOrg = (self) => {
    return self.props.history.location.pathname.includes(perpetual.PAGE_ORGANIZATIONS.toLowerCase())
}

export const tokenRequired = () => {
    const tokenReq = ['localhost', 'kubernetes.docker.internal']
    return tokenReq.includes(window.location.hostname)
}