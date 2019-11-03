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

	handleTransfer = async e => {
		e.preventDefault();

		let receiverAccount = e.target.elements.receiver.value;
		let transferAmount = e.target.elements.amount.value;

		if (Number(this.state.balance) < Number(transferAmount)) {
			document.getElementById('message2-2').innerHTML = `Insufficient balance | Please try again`;
			document.getElementById('modal-failed').style.display = 'block';
		} else {
			let validationRequest = require('request');
			let xml2js = require('xml2js');

			let validationXML =
				`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services/">
						<soapenv:Header/>
						<soapenv:Body>
							<ser:GetAccountNumber>
								<account>` + receiverAccount + `</account>
							</ser:GetAccountNumber>
						</soapenv:Body>
					</soapenv:Envelope>`;

			let validationOptions = {
				url: 'http://localhost:8085/web_service_bank_pro/services/GetAccountNumber?wsdl',
				method: 'POST',
				body: validationXML,
				headers: {
					'Content-Type': 'text/xml;charset=utf-8',
				}
			};

			let validationCallback = (error, response, body) => {
				if (!error && response.statusCode === 200) {
					let parser = new DOMParser();
					let xmlResponse = parser.parseFromString(body, "text/xml");
					let resultResponse = xmlResponse.getElementsByTagName("return")[0].outerHTML;

					let xmlOptions = {
						explicitArray: false
					};

					xml2js.parseString(resultResponse, xmlOptions, (err, res) => {
						let json = JSON.stringify(res);
						let validationResult = JSON.parse(json)["return"];
						console.log("validation result : ", validationResult);

						if (validationResult["status"] === "200") {
							let request = require('request');

							console.log("account : ", this.state.accountNumber);
							console.log("balance : ", this.state.balance);
							console.log("amount : ", transferAmount);
							console.log("targetAccount : ", receiverAccount);
							console.log("realAccount : ", validationResult["accountNumber"]);

							let xml =
								`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services/">
									<soapenv:Header/>
									<soapenv:Body>
										<ser:Transfer>
											<account>` + this.state.accountNumber + `</account>
											<amount>` + transferAmount + `</amount>
											<targetAccount>` + receiverAccount + `</targetAccount>
											<realAccount>` + validationResult["accountNumber"] + `</realAccount>
										</ser:Transfer>
									</soapenv:Body>
								</soapenv:Envelope>`;

							let options = {
								url: 'http://localhost:8085/web_service_bank_pro/services/Transfer?wsdl',
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

										if (result === "200") {
											document.getElementById('message2-1').innerHTML = `Thank you for transfering using Bank Pro`;
											document.getElementById('modal-success').style.display = 'block';
										} else {
											document.getElementById('message2-2').innerHTML = `Unknows error | Please try again`;
											document.getElementById('modal-failed').style.display = 'block';
										}
									});
								};
							};

							request(options, callback);
						} else {
							document.getElementById('message2-2').innerHTML = `Account doesn't exist | Please try again`;
							document.getElementById('modal-failed').style.display = 'block';
						}
					});
				};
			};

			validationRequest(validationOptions, validationCallback);
		}
	}

	goToTransactionsHistory() {
		document.getElementById('modal-success').style.display = 'none';
		window.location.href = '/TransactionsHistory';
	}

	closeModal() {
		document.getElementById('modal-failed').style.display = 'none';
	}

	render() {
		return (
			<React.Fragment>
				<NavigationBar></NavigationBar>
				<Info></Info>
				<div className="wrapper-transfer">
					<img src={name} className="App-logo" alt="name" width="50%" />

					<div className="container-transfer">
						<TransferForm onTransfer={ this.handleTransfer }/>
					</div>
				</div>

				<div id="modal-success" className="modal" onClick={ this.goToTransactionsHistory }>
					<div className="modal-content-container">
						<div className="modal-content">
							<p id="message1-1">Transfer Success</p>
							<p id="message2-1" className="message2"></p>
						</div>
					</div>
				</div>

				<div id="modal-failed" className="modal" onClick={ this.closeModal }>
					<div className="modal-content-container">
						<div className="modal-content">
							<p id="message1-2">Transfer Failed</p>
							<p id="message2-2" className="message2"></p>
						</div>
					</div>
				</div>

			</React.Fragment>
		);
	}
};

export default Transfer;
