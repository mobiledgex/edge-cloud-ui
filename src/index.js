import React from 'react';
import ReactDOM from 'react-dom';

import './charts/sparkline.css';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';
import App from './App';
import store from './store';
import {Provider} from 'react-redux';
import {ThemeProvider} from "@material-ui/core";
import {theme} from './constant'

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Provider store={store} style={{width: '100%', height: '100%'}}>
            <App/>
        </Provider>
    </ThemeProvider>
    ,
    document.getElementById('root')
);



