const initialState = {
    isLoading: false
};
export default function LoadingReducer(state = initialState, action) {
    switch (action.type) {
        case "TOGGLE_LOADING" :
            return Object.assign({}, state, {
                isLoading: action.isLoading
            })
            break;
        default:
            return state
    }
}

