import { compose, applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from '../../reducers';
import history from './history';
import { routerMiddleware } from 'react-router-redux';

import rootSaga from '../../sagas';

const routeMiddleware = routerMiddleware(history);

const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(
    sagaMiddleware,
    routeMiddleware
);

const store = createStore(
    reducer,
    undefined,
    compose(middleware)
);

sagaMiddleware.run(rootSaga);

export default store;
