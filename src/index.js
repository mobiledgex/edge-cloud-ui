import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { Provider } from 'react-redux';

import './charts/sparkline.css';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';


unregister();
ReactDOM.render(
    <Provider store={store} style={{width:'100%', height:'100%'}}><App /></Provider>,
    document.getElementById('root'));
//registerServiceWorker();
