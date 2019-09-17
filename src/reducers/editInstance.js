import * as types from '../actions/ActionTypes';

const initialState = {
    data: null
};
export default function selectOrg( state = initialState, action) {
    switch( action.type ) {
        case types.EDIT_INSTANCE :
            return Object.assign({}, state, {
                data:action.data
            })
            break;
        default:
            return state
    }
}
