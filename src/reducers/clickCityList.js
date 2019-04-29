import * as types from '../actions/ActionTypes';

const initialState = {
    list: []
};
export default function clickCityList( state = initialState, action) {
    switch( action.type ) {
        case types.CLICK_CITY_LIST :
            return Object.assign({}, state, {
              list:action.list
            })
            break;
        default:
            return state
    }
}
