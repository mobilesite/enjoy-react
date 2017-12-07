import React from 'react';
import { connect } from 'react-redux';

@connect(store => {
    return {};
})

export default class NotFount extends React.Component {
    componentWillMount() {}

    render() {
        return <div>404, not found</div>;
    }
}
