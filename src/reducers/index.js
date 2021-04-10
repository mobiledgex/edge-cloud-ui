import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import userInfo from './userInfo';
import showUserRole from './showUserRole';
import selectOrg from './selectOrg';
import loadingSpinner from './loadingSpinner';
import loginMode from './loginMode';
import roleInfo from './roleInfo';
import alertInfo from './alertInfo';
import createAccount from './createAccount';
import regionInfo from './regionInfo';
import showAuditLog from './showAuditLog';
import ThemeReducer from "./ThemeReducer";
import ViewMode from "./ViewMode";
import privateAccess from './privateAccess'
import organizationInfo from './organizationInfo'
import { USER_LOGGED_OUT } from '../actions/ActionTypes';

const appReducer = combineReducers({
    loginMode,
    createAccount,
    regionInfo,
    showAuditLog,
    userInfo,
    showUserRole,
    selectOrg,
    loadingSpinner,
    roleInfo,
    alertInfo,
    ThemeReducer,
    ViewMode,
    privateAccess,
    organizationInfo,
    form: formReducer
});

const rootReducer = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === USER_LOGGED_OUT) {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;
