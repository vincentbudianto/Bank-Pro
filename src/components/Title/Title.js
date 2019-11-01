import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import NavigationBar from '../NavigationBar/NavigationBar';
import logo from '../../assets/logo.svg';
import './Title.css';

class Title extends Component {
	state = {
		cookie: undefined,
		customerName: undefined
	}

	constructor() {
		super();
		const cookie = new Cookies();
		this.state.cookie = cookie.get("user");
	}

	componentDidMount() {
		if (this.state.cookie && !this.state.customerName) {
			this.setState({ customerName: JSON.parse(atob(this.state.cookie))["customerName"] });
		}
	}

	render() {
		return (
			<React.Fragment>
				<NavigationBar></NavigationBar>
				<div className="wrapper-title">
					<div>
						<img src={logo} className={
							this.state.cookie ? "App-logo-flip" : "App-logo-spin"
						} alt="logo" width="25%"/>
					</div>

					<div className={
						this.state.cookie ? "text-hidden" : "text-title1"
					}>
						Welcome to Bank Pro
					</div>

					<div className={
						this.state.cookie ? "text-hidden" : "text-title2"
					}>
						Engima Exclusive Bank
					</div>

					<div className={
						this.state.cookie ? "text-title1" : "text-hidden"
					}>
						Hello, <span id="customer-name">{ this.state.customerName }</span>!
					</div>
				</div>
			</React.Fragment>
		);
	};
};

export default Title;