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
export function getRegion(state) {
    return {
        type: types.GET_REGION,
        region:state
    };
}
export function deleteReset(state) {
    return {
        type: types.DELETE_RESET,
        reset:state
    };
}
export function loginWithEmailRedux ({ params }) {
    return {
        type: types.LOGIN_WITH_EMAIL,
        params
    }
}
export function refreshData ({ params }) {
    return {
        type: types.REFRESH_DATA,
        params
    }
}
export function btnManagement (view) {
    return {
        type: types.BTN_MANAGEMENT,
        view
    }
}
export function computeItem (item) {
    return {
        type: types.COMPUTE_ITEM,
        item
    }
}
export function clickCityList (list) {
    return {
        type: types.CLICK_CITY_LIST,
        list
    }
}
export function userInfo (info) {
    return {
        type: types.USER_INFO,
        info
    }
}
export function mapCoordinatesLong (loc) {
    return {
        type: types.MAP_COORDINATES_LONG,
        loc
    }
}
export function mapCoordinatesLat (loc) {
    return {
        type: types.MAP_COORDINATES_LAT,
        loc
    }
}
export function showUserRole (role) {
    return {
        type: types.SHOW_USER_ROLE,
        role
    }
}
export function selectOrganiz (org) {
    return {
        type: types.SELECT_ORG,
        org
    }
}
export function searchValue (search,scType) {
    return {
        type: types.SEARCH_VALUE,
        search,
        scType
    }
}
export function changeRegion (region) {
    return {
        type: types.CHANGE_REGION,
        region
    }
}
export function computeRefresh (compute) {
    return {
        type: types.COMPUTE_REFRESH,
        compute
    }
}
export function loadingSpinner (loading) {
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
    return {
        type: types.BLINK_MARK,
        blink
    }
}
export function changeLoginMode (mode) {
    return {
        type: types.LOGIN_MODE,
        mode
    }
}
export function creatingSpinner (creating) {
    return {
        type: types.CREATING_SPINNER,
        creating
    }
}
export function alertMsg (msg) {
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
    return {
        type: types.ROLE_INFO,
        role
    }
}
export function appLaunch (data) {
    return {
        type: types.APP_LAUNCH,
        data
    }
}
export function alertInfo (mode,msg) {
    return {
        type: types.ALERT_INFO,
        mode,
        msg
    }
}
export function createAccount (created) {
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
export function changeStep(step) {
    return {
        type: types.CHANGE_STEP,
        step:step
    };
}
export function dataExist(data) {
    return {
        type: types.DATA_EXIST,
        data
    };
}
export function tutorStatus(data) {
    return {
        type: types.TUTOR_STATE,
        data
    };
}
export function submitInfo (data) {
    return {
        type: types.SUBMIT_INFO,
        data
    }
}
export function editInstance (data) {
    return {
        type: types.EDIT_INSTANCE,
        data
    }
}
