import * as types from './ActionTypes';

export function changeSite(state) {
    return {
        type: types.CHANGE_SITE,
        site:state
    };
}
export function changeTab(state) {
    return {
        type: types.CHANGE_TAB,
        tab:state
    };
}
export function clickTab(state) {
    return {
        type: types.CLICK_TAB,
        clickTab:state
    };
}
export function injectData(state) {
    return {
        type: types.INJECT_DATA,
        data:state
    };
}
export function clearData(state) {
    return {
        type: types.CLEAR_DATA,
        data:state
    };
}
export function setUser(user:string):Action {
    return {
        type: types.SET_USER,
        payload: user,
    };
}
export function stopVideo(act:string):Action {
    return {
        type: types.SET_VIDEO,
        status: act,
    };
}
export function loadedData(act:string):Action {
    return {
        type: types.LOADED_DATA,
        loaded: act,
    };
}