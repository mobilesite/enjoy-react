import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

@connect(store => {
    return {}
})

export interface NavbarProps {
    prefixCls?: string;
    className?: string;
    mode?: 'dark' | 'light';
    icon?: React.ReactNode;
    leftContent?: any;
    rightContent?: any;
    onLeftClick?: () => void;
}

export default class Navbar extends React.Component<NavbarProps, any> {
    static defaultProps = {
        mode: 'dark',
        onLeftClick: () => {},
        onRightClick: () => {}
    };

    render() {
        const {
            className, children, mode, icon, onLeftClick, leftContent, onRightClick, rightContent, 
            ...restProps
        } = this.props;

        return (
            <div className={classnames('ej-navbar', `ej-navbar--${mode}`, className)} {...restProps}>
                <div className="ej-navbar__left">{leftContent}</div>
                <div className="ej-navbar__center">{children}</div>
                <div className="ej-navbar__right">{rightContent}</div>
            </div>
        )
    }
} 
