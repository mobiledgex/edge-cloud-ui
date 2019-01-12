import { combineReducers } from 'redux';
import videoControl from './videoControl';
import siteChanger from './siteChanger';
import tabChanger from './tabChanger';
import tabClick from './tabClick';
import receiveDataReduce from './receiveDataReduce';
import registryAccount from './registryAccount';

const reducers = combineReducers({
    videoControl, siteChanger, tabChanger, tabClick, receiveDataReduce, registryAccount
});

export default reducers;
