import { perpetual } from "."
import { v1 as uuidv1 } from 'uuid';

export const uniqueId = ()=>{
    return uuidv1()
}

export const isPathOrg = (self)=>{
    return self.props.history.location.pathname.includes(perpetual.PAGE_ORGANIZATIONS.toLowerCase())
}

export const validateRemoteCIDR = (form) => {
    if (form.value && form.value.length > 0) {
        if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|1[0-9]|2[0-9]|3[0-2]?)$/.test(form.value)) {
            form.error = 'Destination CIDR format is invalid (must be between 0.0.0.0/0 to 255.255.255.255/32)'
            return false;
        }
    }
    form.error = undefined;
    return true;
}

export const validateRemoteIP = (form) => {
    if (form.value && form.value.length > 0) {
        if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(form.value)) {
            form.error = 'Route IP format is invalid (must be between 0.0.0.0 to 255.255.255.255)'
            return false;
        }
    }
    form.error = undefined;
    return true;
}