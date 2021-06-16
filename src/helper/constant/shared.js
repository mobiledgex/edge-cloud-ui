import { perpetual } from "."

export const isPathOrg = (self)=>{
    return self.props.history.location.pathname.includes(perpetual.PAGE_ORGANIZATIONS.toLowerCase())
}