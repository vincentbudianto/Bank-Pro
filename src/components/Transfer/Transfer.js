import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import TransferForm from './TransferForm';
import NavigationBar from '../NavigationBar/NavigationBar';
import Info from '../Info/Info';
import name from '../../assets/bank_pro_logo.svg';
import './Transfer.css';

class Transfer extends Component {
	state = {
		cookie: undefined,
		accountNumber: undefined,
		balance: undefined,
		targetAccount: undefined
	}

	constructor() {
		super();
		const cookie = new Cookies();
		this.state.cookie = cookie.get("user");
	}

	componentDidMount() {
		let request = require('request');
		let xml2js = require('xml2js');

		if (this.state.cookie && !this.state.accountNumber) {
			this.setState({ accountNumber: JSON.parse(atob(this.state.cookie))["accountNumber"] });
		}

		let xml =
			`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services/">
		    	<soapenv:Header/>
				<soapenv:Body>
					<ser:GetCustomerBalance>
						<account>` + JSON.parse(atob(this.state.cookie))["accountNumber"] + `</account>
					</ser:GetCustomerBalance>
				</soapenv:Body>
			</soapenv:Envelope>`;

		let options = {
			url: 'http://localhost:8085/web_service_bank_pro/services/GetCustomerBalance?wsdl',
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
						this.setState({ balance: result["balance"] })
					} else {
						this.setState({ balance: -1 })
					}
				});
			};
		};

		request(options, callback);
	}

	render() {
		return (
			<React.Fragment>
				<NavigationBar></NavigationBar>
				<Info></Info>
				<div className="wrapper-transfer">
					<img src={name} className="App-logo" alt="name" width="50%" />

					<div className="container-transfer">
						<TransferForm/>
					</div>
				</div>

			</React.Fragment>
		);
	}
};

export default Transfer;