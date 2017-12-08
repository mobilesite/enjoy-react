import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Link, BrowserRouter, HashRouter } from 'react-router-dom';

import history from '../../pages/index/history';
import Layout from '../Layout';
import Home from '../Home';
import NotFound from '../NotFound';

@connect(store => {
    return {};
})

export default class Wrapper extends React.Component {
    componentWillMount() {

    }

    render() {
        return (
            <ConnectedRouter history={history}>
                <Switch key={location.path}>
                    <Layout>
                        <Route exact path="/" component={Home}/>
                        <Route component={NotFound}/>
                    </Layout>
                </Switch>
            </ConnectedRouter>
        )
    }
}
