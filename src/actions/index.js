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
export function injectNetworkData(state) {
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
export function registDeveloper(accountInfo:string):Action {
    return {
        type: types.REGIST_DEVELOPER,
        account: accountInfo,
    };
}

export function changeCity(state) {
    return {
        type: types.CHANGE_CITY,
        city:state
    };
}
export function loginWithEmailRedux ({ params }) {
    return {
        type: types.LOGIN_WITH_EMAIL,
        params
    }
}
export function refreshData ({ params }) {
    console.log('refreshdata reducer is ...', params)
    return {
        type: types.REFRESH_DATA,
        params
    }
}
export function btnManagement (view) {
    console.log('BTN_MANAGEMENT == ', view)
    return {
        type: types.BTN_MANAGEMENT,
        view
    }
}
export function computeItem (item) {
    console.log('COMPUTE_ITEM == ', item)
    return {
        type: types.COMPUTE_ITEM,
        item
    }
}
export function clickCityList (list) {
    console.log('CLICK_CITY_LIST == ', list)
    return {
        type: types.CLICK_CITY_LIST,
        list
    }
}
export function userInfo (info) {
    console.log('USER_INFO == ', info)
    return {
        type: types.USER_INFO,
        info
    }
}
export function mapCoordinatesLong (loc) {
    console.log('MAP_COORDINATES_LONG == ', loc)
    return {
        type: types.MAP_COORDINATES_LONG,
        loc
    }
}
export function mapCoordinatesLat (loc) {
    console.log('MAP_COORDINATES_LAT == ', loc)
    return {
        type: types.MAP_COORDINATES_LAT,
        loc
    }
}
export function showUserRole (role) {
    console.log('SHOW_USER_ROLE == ', role)
    return {
        type: types.SHOW_USER_ROLE,
        role
    }
}
export function selectOrganiz (org) {
    console.log('SELECT_ORG == ', org)
    return {
        type: types.SELECT_ORG,
        org
    }
}
export function searchValue (search,scType) {
    console.log('SEARCH_VALUE == ', search,scType)
    return {
        type: types.SEARCH_VALUE,
        search,
        scType
    }
}
export function changeRegion (region) {
    console.log('CHANGE_REGION == ', region)
    return {
        type: types.CHANGE_REGION,
        region
    }
}
export function computeRefresh (compute) {
    console.log('COMPUTE_REFRESH == ', compute)
    return {
        type: types.COMPUTE_REFRESH,
        compute
    }
}
export function loadingSpinner (loading) {
    console.log('LOADING_SPINNER == ', loading)
    return {
        type: types.LOADING_SPINNER,
        loading
    }
}
export function showFlavor (flavor) {

    return {
        type: types.SHOW_FLAVOR,
        flavor
    }
}
export function blinkMark (blink) {
    console.log('BLINK_MARK == ', blink)
    return {
        type: types.BLINK_MARK,
        blink
    }
}
export function changeLoginMode (mode) {
    console.log('LOGIN_MODE == ', mode)
    return {
        type: types.LOGIN_MODE,
        mode
    }
}
export function creatingSpinner (creating) {
    console.log('CREATING_SPINNER == ', creating)
    return {
        type: types.CREATING_SPINNER,
        creating
    }
}
export function alertMsg (msg) {
    console.log('ALERT_MSG == ', msg)
    return {
        type: types.ALERT_MSG,
        msg
    }
}
export function changeDetail (mode) {
    return {
        type: types.CHANGE_VIEW,
        mode
    }
}
export function roleInfo (role) {
    console.log('ROLE_INFO == ', role)
    return {
        type: types.ROLE_INFO,
        role
    }
}
export function appLaunch (data) {
    console.log('APP_LAUNCH == ', data)
    return {
        type: types.APP_LAUNCH,
        data
    }
}
export function alertInfo (mode,msg) {
    console.log('ALERT_INFO == ', mode, msg)
    return {
        type: types.ALERT_INFO,
        mode,
        msg
    }
}
export function createAccount (created) {
    console.log('created == ', created)
    return {
        type: types.CREATE_ACCOUNT,
        created
    }
}
export function tableHeaders (headers) {
    return {
        type: types.TABLE_HEADER,
        headers
    }
}
export function saveStateFilter (filter) {
    return {
        type: types.SAVE_FILTERS,
        filter
    }
}
