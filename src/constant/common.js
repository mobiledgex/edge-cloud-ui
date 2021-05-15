import { PAGE_ORGANIZATIONS } from "../constant"

export const isPathOrg = (self)=>{
    return self.props.history.location.pathname.includes(PAGE_ORGANIZATIONS.toLowerCase())
}