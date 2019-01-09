import * as types from '../actions/ActionTypes';

const initialState = {
    // site: {mainPath:'/', subPath:'pg=0'}
    site:null
};
export default function siteChanger( state = initialState, action ) {
    switch( action.type ) {
        case types.CHANGE_SITE :
            return { ...state, site:action.site }
            break;
        default:
            return state
    }
}
