import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './charts/sparkline.css';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import reducers from './reducers';
import { Provider } from 'react-redux';

const store = createStore(reducers);

ReactDOM.render(
    <Provider store={store} style={{width:'100%', height:'100%'}}><App /></Provider>,
    document.getElementById('root'));
registerServiceWorker();
