import * as types from '../actions/ActionTypes';

const initialState = {
    region: null
};
export default function cityChanger( state = initialState, action) {
    switch( action.type ) {
        case types.GET_REGION :
            return Object.assign({}, state, {
                region:action.region
            })
            break;
        default:
            return state
    }
}
