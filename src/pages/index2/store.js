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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    undefined,
    composeEnhancers(middleware)
);

sagaMiddleware.run(rootSaga);

export default store;
