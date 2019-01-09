import * as types from '../actions/ActionTypes';

const initialState = {
    data: null
};
export default function receiveDataReduce( state = initialState, action ) {
    switch( action.type ) {
        case types.INJECT_DATA :
            return { ...state, data:action.data }
        case types.CLEAR_DATA :
            return initialState;
        case types.LOADED_DATA :
            return action.loaded;
        default:
            return state
    }
}
