import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopNav from '../TopNav';
import FooterNav from '../FooterNav';

@connect(store => {
    return {};
})

export default class Layout extends React.Component {
    componentWillMount() {

    }

    render() {
        return (
            <div>
                <TopNav/>
                {this.props.children}
                <FooterNav/>
            </div>
        )
    }
}
