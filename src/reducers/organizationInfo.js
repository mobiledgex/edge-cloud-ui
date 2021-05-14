import * as types from '../actions/ActionTypes';

const initialState = {
    data: undefined
};

export default function organizationInfo(state = initialState, action) {
    switch (action.type) {
        case types.ORGANIZATION_INFO:
            return Object.assign({}, state, {
                data: action.data
            })
        default:
            return state
    }
}