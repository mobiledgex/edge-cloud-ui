import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import {Provider} from 'react-redux';
import ReactGA from 'react-ga';

ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID);
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
    <Provider store={store} style={{width: '100%', height: '100%'}}>
        <App/>
    </Provider>

    ,
    document.getElementById('root')
);



