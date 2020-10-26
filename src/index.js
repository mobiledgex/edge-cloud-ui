import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import {Provider} from 'react-redux';


import 'chartjs-plugin-labels'
ReactDOM.render(
    <Provider store={store} style={{width: '100%', height: '100%'}}>
        <App/>
    </Provider>

    ,
    document.getElementById('root')
);



