import {TOGGLE_THEME} from "../actions/ActionTypes";

const initialState = {
    themeType: 'dark'
};
export default function ThemeReducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_THEME :
            return Object.assign({}, state, {
                themeType: action.themeType
            })
            break;
        default:
            return state
    }
}

