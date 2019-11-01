import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Title from '../Title/Title'

function Router() {
	return (
		<main>
			<Switch>
				<Route exact path='/' render={() => (<Redirect to="/Title"/>)} />
				<Route exact path='/Title' component={Title} />
				<Route exact path='/*' component={Title} />
			</Switch>
		</main>
	);
}

export default Router