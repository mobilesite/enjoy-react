import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(store => {
    return {}
})

export default class TopNav extends Component {
    componentWillMount() {}

    render() {
        return (<div>TopNav</div>)
    }
} 
