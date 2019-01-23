import { combineReducers } from 'redux';
import videoControl from './videoControl';
import siteChanger from './siteChanger';
import tabChanger from './tabChanger';
import tabClick from './tabClick';
import receiveDataReduce from './receiveDataReduce';
import registryAccount from './registryAccount';
import cityChanger from './cityChanger';

const reducers = combineReducers({
    videoControl, siteChanger, tabChanger, tabClick, receiveDataReduce, registryAccount, cityChanger
});

export default reducers;
