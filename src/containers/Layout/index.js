import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopNav from '../../components/TopNav';
import FooterNav from '../../components/FooterNav';

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
