import * as types from '../actions/ActionTypes';
import { fields } from '../services/model/format';

const initialState = {
    data: []
};

export default function organizationInfo(state = initialState, action) {
    switch (action.type) {
        case types.ORGANIZATION_INFO:
            return Object.assign({}, state, {
                data: action.data
            })
            break;
        default:
            return state
    }
}

const getObject = (self) => {
    if (self && self.props.organizationInfo) {
        return self.props.organizationInfo
    }
}

export const isOperator = (self) => {
    let value = false
    let info = getObject(self)
    if (info) {
        value = info.type === 'operator'
    }
    return value
}

export const getOrganization = (self) => {
    let info = getObject(self)
    if (info) {
        return info[fields.organizationName]
    }
}

export const edgeboxOnly = (self) => {
    let value = false
    let info = getObject(self)
    if (info) {
        value = info[fields.edgeboxOnly]
    }
    return value
}
