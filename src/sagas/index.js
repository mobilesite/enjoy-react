import { fork, all, takeEvery, select } from 'redux-saga/effects';

function* watchAndLog() {
    yield takeEvery('*', function* logger(action) {
        const state = yield select();
        console.log('action', action);
        console.log('state after', state);
    });
}

export default function* root() {
    yield all([fork(watchAndLog)]);
}
