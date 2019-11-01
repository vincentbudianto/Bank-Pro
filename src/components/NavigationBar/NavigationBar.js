import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import name from '../../assets/bank_pro_logo.svg';
import './NavigationBar.css';

class NavigationBar extends Component {
	state = {
		cookie: undefined
	}

	constructor() {
		super();
		const cookie = new Cookies();
		this.state.cookie = cookie.get("user");
	}

	render() {
		return (
			<div className="navbar">
				<div className="navbar-wrapper">
					<Link to='/Title'>
						<img src={name} className="App-logo" alt="name" width="150" height="50" />
					</Link>

					<Link to='/Transactions'>
						<div className={
							this.state.cookie ? "navbar-button" : "navbar-button-disabled"
						}>
							<font color="white">Transactions</font>
						</div>
					</Link>

					<Link to='/History'>
						<div className={
							this.state.cookie ? "navbar-button" : "navbar-button-disabled"
						}>
							<font color="white">History</font>
						</div>
					</Link>

					<Link to='/Login' >
						<div className="navbar-button">
							<font color="white">Login</font>
						</div>
					</Link>
				</div>
			</div>
		);
	}
};

export default NavigationBar;