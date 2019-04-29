import * as types from '../actions/ActionTypes';

const initialState = {
    loc: null
};
export default function mapCoordinatesLong( state = initialState, action) {
    switch( action.type ) {
        case types.MAP_COORDINATES_LONG :
            return Object.assign({}, state, {
                loc:action.loc
            })
            break;
        default:
            return state
    }
}
