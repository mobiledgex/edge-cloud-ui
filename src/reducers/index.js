import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import videoControl from './videoControl';
import siteChanger from './siteChanger';
import tabChanger from './tabChanger';
import tabClick from './tabClick';
import receiveDataReduce from './receiveDataReduce';
import registryAccount from './registryAccount';
import cityChanger from './cityChanger';
import user from './userReducer';
import btnMnmt from './btnManagement';
import computeItem from './computeItem';
import clickCityList from './clickCityList';
import userInfo from './userInfo';
import mapCoordinatesLong from './mapCoordinatesLong';
import mapCoordinatesLat from './mapCoordinatesLat';
import showUserRole from './showUserRole';
import showFlavor from './showFlavor';
import selectOrg from './selectOrg';
import searchValue from './searchValue';
import changeRegion from './changeRegion';
import computeRefresh from './computeRefresh';
import loadingSpinner from './loadingSpinner';
import creatingSpinner from './creatingSpinner';
import loginMode from './loginMode';
import injectData from './injectData';
import alertMsg from './alertMsg';
import changeViewMode from './changeViewMode';
import roleInfo from './roleInfo';
import appLaunch from './appLaunch';
import alertInfo from './alertInfo';
import createAccount from './createAccount';
import tableHeader from './tableHeader';
import changeStep from './changeStep';
import dataExist from './dataExist';
import tutorState from './tutorState';
import submitInfo from './submitInfo';
import getRegion from './getRegion';
import regionInfo from './regionInfo';
import editInstance from './editInstance';
import deleteReset from './deleteReset';
import checkedAudit from './checkedAudit';

const reducers = combineReducers({
    videoControl, siteChanger, tabChanger, tabClick, receiveDataReduce, changeRegion, showFlavor, loginMode,injectData,changeViewMode,createAccount, tableHeader, changeStep, tutorState,submitInfo,getRegion,deleteReset,editInstance, regionInfo,checkedAudit,
    registryAccount, cityChanger, user, btnMnmt, computeItem, clickCityList, userInfo, mapCoordinatesLong, mapCoordinatesLat, showUserRole, selectOrg, searchValue, computeRefresh, loadingSpinner, creatingSpinner, alertMsg, roleInfo, appLaunch, alertInfo, dataExist, form: formReducer
});

export default reducers;
