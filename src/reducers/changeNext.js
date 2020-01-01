import * as types from '../actions/ActionTypes';

const initialState = {
    next: null
};
export default function changeNext( state = initialState, action) {
    switch( action.type ) {
        case types.CHANGE_NEXT :
            return Object.assign({}, state, {
                next:action.next
            })
            break;
        default:
            return state
    }
}
