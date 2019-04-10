import { combineReducers } from 'redux';
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


const reducers = combineReducers({
    videoControl, siteChanger, tabChanger, tabClick, receiveDataReduce, registryAccount, cityChanger, user, btnMnmt, computeItem, clickCityList, userInfo
});

export default reducers;
