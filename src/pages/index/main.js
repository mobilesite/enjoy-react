import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { Switch, Link, BrowserRouter, HashRouter } from 'react-router-dom';

import store from './store';

import Wrapper from '../../containers/Wrapper';

import './main.less';

/* eslint-disable */
render(
    <Provider store={store}>
        <Wrapper />
    </Provider>,
    document.getElementById('page')
);
/* eslint-enable */
