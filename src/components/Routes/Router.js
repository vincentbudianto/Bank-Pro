import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';
import TransactionsHistory from '../TransactionsHistory/TransactionsHistory'
import Login from '../Login/Login'
import Title from '../Title/Title'

function Router() {
	const cookie = new Cookies();

	if (!cookie.get("user")) {
		return (
			<Switch>
				<Route exact path='/Title' component={Title} />
				<Route exact path='/*' component={Login} />
			</Switch>
		);
	} else {
		return (
			<main>
				<Switch>
					<Route exact path='/' render={() => (<Redirect to="/Title"/>)} />
					<Route exact path='/TransactionsHistory' component={TransactionsHistory} />
					<Route exact path='/Title' component={Title} />
					<Route exact path='/*' component={Title} />
				</Switch>
			</main>
		);
	}
}

export default Router