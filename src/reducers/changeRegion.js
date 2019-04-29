import * as types from '../actions/ActionTypes';

const initialState = {
    region: 'US'
};
export default function changeRegion( state = initialState, action) {
    switch( action.type ) {
        case types.CHANGE_REGION :
            return Object.assign({}, state, {
                region:action.region
            })
            break;
        default:
            return state
    }
}
