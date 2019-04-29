import * as types from '../actions/ActionTypes';

const initialState = {
    // site: {mainPath:'/', subPath:'pg=0'}
    account:null
};
export default function registryAccount( state = initialState, action ) {
    switch( action.type ) {
        case types.REGIST_DEVELOPER :
            return { ...state, account:action.account }
            break;
        default:
            return state
    }
}