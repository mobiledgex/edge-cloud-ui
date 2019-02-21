import * as types from '../actions/ActionTypes';

const initialState = {
    data: null
};
export default function receiveDataReduce( state = initialState, action ) {
    switch( action.type ) {
        case types.INJECT_DATA :
            return Object.assign({}, state, {
                data:action.data
            })
        case types.CLEAR_DATA :
            return initialState;
        case types.LOADED_DATA :
            return action.loaded;
        case types.REFRESH_DATA :
            return action;
        default:
            return state
    }
}
