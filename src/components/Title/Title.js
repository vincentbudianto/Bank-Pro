import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import logo from '../../assets/logo.svg';
import './Title.css';

class Title extends Component {
	state = {
		cookie: undefined,
		accountNumber: undefined,
		customerName: undefined
	}

	constructor() {
		super();
		const cookie = new Cookies();
		this.state.cookie = cookie.get("userBankPro");
	}

	componentDidMount() {
		if (this.state.cookie && !this.state.customerName) {
			this.setState({ customerName: JSON.parse(atob(this.state.cookie))["customerName"] });
		}

		if (this.state.cookie && !this.state.accountNumber) {
			this.setState({ accountNumber: JSON.parse(atob(this.state.cookie))["accountNumber"] });
		}
	}

	getVirtualAccount = async e => {
		let request = require('request');
		let xml2js = require('xml2js');

		let random = Math.floor(Math.random() * (9999999999 - 1000000000) + 1000000000);

		let xml =
			`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services/">
				<soapenv:Header/>
				<soapenv:Body>
					<ser:GetVirtualNumber>
						<senderAccount>` + random + `</senderAccount>
						<receiverAccount>` + this.state.accountNumber + `</receiverAccount>
					</ser:GetVirtualNumber>
				</soapenv:Body>
			</soapenv:Envelope>`;

		let options = {
			url: 'http://18.215.174.114:8080/web_service_bank_pro/services/GetVirtualNumber?wsdl',
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
							document.getElementById('message1').innerHTML = `Virtual Account`;
							document.getElementById('message2').innerHTML = result["virtualNumber"];
					} else {
						document.getElementById('message1').innerHTML = `Failed to generate virtual account`;
						document.getElementById('message1').style.color = `red`;
					}

					document.getElementById('modal-virtual').style.display = 'block';
				});
			};
		};

		request(options, callback);
	}

	closeModal() {
		document.getElementById('modal-virtual').style.display = 'none';
	}

	render() {
		return (
			<React.Fragment>
				<div className={
					this.state.cookie ? "wrapper-title1" : "wrapper-title2"
				}>
					<div>
						<img src={logo} className={
							this.state.cookie ? "App-logo-flip" : "App-logo-spin"
						} alt="logo" width={ this.state.cookie ? "20%" : "25%" }/>
					</div>

					<button className={
						this.state.cookie ? "virtual-button" : "virtual-button-hidden"
					} onClick={ this.getVirtualAccount }>Virtual Account</button>

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

				<div id="modal-virtual" className="modal" onClick={this.closeModal}>
					<div className="modal-content-container">
						<div className="modal-content">
							<p id="message1"></p>
							<span id="message2"></span>
							<p id="message3">(click anywhere to close this popup)</p>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
};

export default Title;