import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import BottomBar from '../BottomBar/BottomBar';
import Info from '../Info/Info';
import Login from '../Login/Login';
import NavigationBar from '../NavigationBar/NavigationBar';
import Title from '../Title/Title';
import TransactionsHistory from '../TransactionsHistory/TransactionsHistory';
import Transfer from '../Transfer/Transfer';

function Router() {
	const cookie = new Cookies();

	if (!cookie.get("userBankPro")) {
		return (
			<main>
				<NavigationBar></NavigationBar>
				<Switch>
					<Route exact path='/Login' component={Login} />
					<Route exact path='/*' component={Title} />
				</Switch>
				<BottomBar></BottomBar>
			</main>
		);
	} else {
		return (
			<main>
				<NavigationBar></NavigationBar>
				<Info></Info>
				<Switch>
					<Route exact path='/' render={() => (<Redirect to="/Title"/>)} />
					<Route exact path='/TransactionsHistory' component={TransactionsHistory} />
					<Route exact path='/Title' component={Title} />
					<Route exact path='/Transfer' component={Transfer} />
					<Route exact path='/*' component={Title} />
				</Switch>
				<BottomBar></BottomBar>
			</main>
		);
	}
}

export default Router