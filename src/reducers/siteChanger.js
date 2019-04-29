import * as types from '../actions/ActionTypes';

const initialState = {
    // site: {mainPath:'/', subPath:'pg=0'}
    site:{mainPath:'/', subPath:'pg=0'}
};
export default function siteChanger( state = initialState, action ) {
    switch( action.type ) {
        case types.CHANGE_SITE :
            return Object.assign({}, state, {
                site: action.site
            })
            break;
        default:
            return state;
    }
}
