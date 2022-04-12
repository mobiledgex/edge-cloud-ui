/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import userInfo from './userInfo';
import showUserRole from './showUserRole';
import selectOrg from './selectOrg';
import loadingSpinner from './loadingSpinner';
import roleInfo from './roleInfo';
import alertInfo from './alertInfo';
import regionInfo from './regionInfo';
import showAuditLog from './showAuditLog';
import ThemeReducer from "./ThemeReducer";
import ViewMode from "./ViewMode";
import privateAccess from './privateAccess'
import organizationInfo from './organizationInfo'
import loadMain from './loadMain'
import { USER_LOGGED_OUT } from '../actions/ActionTypes';

const appReducer = combineReducers({
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
    loadMain,
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
