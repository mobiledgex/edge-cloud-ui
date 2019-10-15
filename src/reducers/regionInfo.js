import * as types from '../actions/ActionTypes';

const initialState = {
    region: []
};
export default function regionInfo( state = initialState, action) {
    switch( action.type ) {
        case types.REGION_INFO :
            return Object.assign({}, state, {
                region:action.data
            })
            break;
        default:
            return state
    }
}
