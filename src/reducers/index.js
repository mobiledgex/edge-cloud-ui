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


const reducers = combineReducers({
    videoControl, siteChanger, tabChanger, tabClick, receiveDataReduce,
    registryAccount, cityChanger, user, btnMnmt, computeItem, clickCityList, userInfo, mapCoordinatesLong, mapCoordinatesLat, form: formReducer
});

export default reducers;
