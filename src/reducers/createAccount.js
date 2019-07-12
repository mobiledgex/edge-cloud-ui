import * as types from '../actions/ActionTypes';

const initialState = {
    created: false
};
export default function createAccount( state = initialState, action) {
    switch( action.type ) {
        case types.CREATE_ACCOUNT :
            return Object.assign({}, state, {
                created:action.created
            })
            break;
        default:
            return state
    }
}
