import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import global from './globalReducer';

export default combineReducers({
    router,
    global
});
