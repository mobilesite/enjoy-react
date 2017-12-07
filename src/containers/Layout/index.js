import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import history from '../../pages/index/history';
import NotFount from '../NotFound';

@connect(store => {
    return {};
})

export default class Layout extends React.Component {
    componentWillMount() {}

    render() {
        return (
            <ConnectedRouter history={history}>
                <div>
                    <Route component="App">
                        <Route exact path="/" component={NotFount} />
                    </Route>
                </div>
            </ConnectedRouter>
        );
    }
}
