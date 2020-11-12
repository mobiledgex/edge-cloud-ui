import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import tabChanger from './tabChanger';
import receiveDataReduce from './receiveDataReduce';
import registryAccount from './registryAccount';
import cityChanger from './cityChanger';
import user from './userReducer';
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
import checkedAudit from './checkedAudit';
import showAuditLog from './showAuditLog';
import redirectPage from './redirectPage';
import resetMap from './resetMap';
import submitObj from './submitObj';
import LoadingReducer from "./LoadingReducer";
import MapTyleLayerReducer from "./MapTyleLayerReducer";
import HeaderReducer from "./HeaderReducer";
import ThemeReducer from "./ThemeReducer";
import ChartDataReducer from "./ChartDataReducer";
import ViewMode from "./ViewMode";

const reducers = combineReducers({
    tabChanger,
    receiveDataReduce,
    changeRegion,
    showFlavor,
    loginMode,
    injectData,
    changeViewMode,
    createAccount,
    tableHeader,
    changeStep,
    tutorState,
    submitInfo,
    getRegion,
    regionInfo,
    checkedAudit,
    showAuditLog,
    redirectPage,
    resetMap,
    submitObj,
    registryAccount,
    cityChanger,
    user,
    computeItem,
    clickCityList,
    userInfo,
    mapCoordinatesLong,
    mapCoordinatesLat,
    showUserRole,
    selectOrg,
    searchValue,
    computeRefresh,
    loadingSpinner,
    alertMsg,
    roleInfo,
    appLaunch,
    alertInfo,
    dataExist,
    LoadingReducer,
    MapTyleLayerReducer,
    HeaderReducer,
    ThemeReducer,
    ChartDataReducer,
    ViewMode,
    form: formReducer
});

export default reducers;
