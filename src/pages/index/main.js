// import "babel-polyfill";
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { Link, BrowserRouter, HashRouter } from 'react-router-dom';

import store from './store';

import Layout from '../../containers/Layout';

require('../../styles/index.less');

/* eslint-disable */
render(
    <Provider store={store}>
        <Layout />
    </Provider>,
    document.getElementById('app')
);
/* eslint-enable */
