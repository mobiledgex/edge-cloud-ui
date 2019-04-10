import * as types from '../actions/ActionTypes';

const initialState = {
    item: ''
};
export default function computeItem( state = initialState, action) {
    switch( action.type ) {
        case types.COMPUTE_ITEM :
            return Object.assign({}, state, {
              item:action.item
            })
            break;
        default:
            return state
    }
}
