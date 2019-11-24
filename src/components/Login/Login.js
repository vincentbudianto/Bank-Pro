import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import LoginForm from './LoginForm';
import logo from '../../assets/bank_pro_logo.svg';
import './Login.css';

class Login extends Component {
	state = {
		cookie: undefined
	}

	constructor() {
		super();
		let cookie = new Cookies();
		this.state.cookie = cookie.get("userBankPro");
	}

	handleLogin = async e => {
		e.preventDefault();
		let request = require('request');
		let xml2js = require('xml2js');

		let accountNumber = e.target.elements.account.value;

		let xml =
			`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services/">
				<soapenv:Header/>
				<soapenv:Body>
					<ser:Login>
						<account>` + accountNumber + `</account>
					</ser:Login>
				</soapenv:Body>
			</soapenv:Envelope>`;

		let options = {
			url: 'http://18.215.174.114:8080/web_service_bank_pro/services/Login?wsdl',
			method: 'POST',
			body: xml,
			headers: {
				'Content-Type': 'text/xml;charset=utf-8',
			}
		};

		let callback = (error, response, body) => {
			if (!error && response.statusCode === 200) {
				let parser = new DOMParser();
				let xmlResponse = parser.parseFromString(body, "text/xml");
				let resultResponse = xmlResponse.getElementsByTagName("return")[0].outerHTML;

				let xmlOptions = {
					explicitArray: false
				};

				xml2js.parseString(resultResponse, xmlOptions, (err, res) => {
					let json = JSON.stringify(res);
					let result = JSON.parse(json)["return"];

					if (result["status"] === "200") {
						let cookieValue = btoa(JSON.stringify(result));
						let cookies = new Cookies();
						cookies.set('userBankPro', cookieValue, { path: '/', expires: new Date(Date.now() + 86400000) });
						window.location.reload();
					} else {
						document.getElementById('account-input').style.borderColor = 'red';
						document.getElementById('account-input').style.borderWidth = '1.5px';
						document.getElementById('false-account-msg').style.color = 'red';
						document.getElementById('false-account-msg').innerHTML = `Account doesn't exist`;
					}
				});
			};
		};

		request(options, callback);
	}

	clearSpan = async e => {
		document.getElementById('account-input').style.borderColor = '#ccc';
		document.getElementById('account-input').style.borderWidth = '1px';
		document.getElementById('false-account-msg').innerHTML = ``;
	}

	render() {
		return (
			<React.Fragment>
				<div className="wrapper-login">
					<div>
						<img src={logo} className="App-name" alt="logo" width="75%"/>
					</div>

					<div className="container-login">
						<LoginForm onLogin={this.handleLogin} clear={this.clearSpan}/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Login;
