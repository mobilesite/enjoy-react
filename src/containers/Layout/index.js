import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navbar from '../../components/Navbar';
import Tabbar from '../../components/Tabbar';
import Icon from '../../components/Icon';

@connect(store => {
    return {};
})

export default class Layout extends React.Component {
    componentWillMount() {

    }
    
    onLeftClick = () => {
        alert('left clicked')
    }

    render() {
        
        return (
            <div>
                <Navbar
                    mode="dark"
                    leftContent="back"
                    onLeftClick={this.onLeftClick}
                    rightContent={<Icon type="ellipsis" />}
                >
                    Enjoy UI
                </Navbar>
                {this.props.children}
                <Tabbar/>
            </div>
        )
    }
}
