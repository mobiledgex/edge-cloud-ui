import * as types from '../actions/ActionTypes';

const initialState = {
    data: false
};
export default function dataExist( state = initialState, action) {
    switch( action.type ) {
        case types.DATA_EXIST :
            return Object.assign({}, state, {
                data:action.data
            })
            break;
        default:
            return state
    }
}
