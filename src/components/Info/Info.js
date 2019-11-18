import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import logo from '../../assets/logo.svg';
import './Info.css';

class Info extends Component {
	state = {
		cookie: undefined,
		accountNumber: undefined,
		customerName: undefined,
		balance: undefined
	}

	constructor() {
		super();
		const cookie = new Cookies();
		this.state.cookie = cookie.get("userBankPro");
	}

	componentDidMount() {
		let request = require('request');
		let xml2js = require('xml2js');

		if (this.state.cookie && !this.state.accountNumber) {
			this.setState({ accountNumber: JSON.parse(atob(this.state.cookie))["accountNumber"] });
			this.setState({ customerName: JSON.parse(atob(this.state.cookie))["customerName"] });
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
			url: 'http://localhost:8080/web_service_bank_pro/services/GetCustomerBalance?wsdl',
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
			<div className="wrapper-info">
				<div className="wrapper-info-customer-info">
					<img src={logo} className={
						this.state.cookie ? "App-logo-flip" : "App-logo-spin"
					} alt="logo" width="5%" />

					<div className="wrapper-main-info1">
						<label className="text-name">
							<span id="customer-info">{this.state.customerName}</span>
						</label>

						<label className="text-number">
							<span id="customer-number">{this.state.accountNumber}</span>
						</label>
					</div>

					<div className="wrapper-main-info2">
						<label className="text-balance">
							Balance: <span id="customer-info">Rp. {this.state.balance},-</span>
						</label>
					</div>
				</div>
			</div>
		);
	}
};

export default Info;
