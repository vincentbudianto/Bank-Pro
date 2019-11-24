import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import TransferForm from './TransferForm';
import AddBalanceForm from './AddBalanceForm';
import logo from '../../assets/bank_pro_logo.svg';
import './Transfer.css';

class Transfer extends Component {
	state = {
		cookie: undefined,
		accountNumber: undefined,
		balance: undefined,
		targetAccount: undefined,
		check: false
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
			url: 'http://18.207.202.246:8080/web_service_bank_pro/services/GetCustomerBalance?wsdl',
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
						this.setState({ balance: result["balance"] });
					} else {
						this.setState({ balance: -1 });
					}
				});
			};
		};

		request(options, callback);
	}

	handleCheck = async e => {
		if (this.state.check) {
			this.setState({ check: false });
		} else {
			this.setState({ check: true });
		}
	}

	handleAddBalance = async e => {
		e.preventDefault();

		let addAmount = e.target.elements.amount.value;

		if (addAmount === "") {
			document.getElementById('message2-2').innerHTML = `Amount can't be empty`;
			document.getElementById('modal-failed').style.display = 'block';
		} else if (isNaN(addAmount)) {
			document.getElementById('message2-2').innerHTML = `Amount must be numbers`;
			document.getElementById('modal-failed').style.display = 'block';
		} else {
			let request = require('request');
			let xml2js = require('xml2js');

			let xml =
				`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services/">
					<soapenv:Header/>
					<soapenv:Body>
						<ser:AddBalance>
							<account>` + this.state.accountNumber + `</account>
							<amount>` + addAmount + `</amount>
						</ser:AddBalance>
					</soapenv:Body>
				</soapenv:Envelope>`;

			let options = {
				url: 'http://18.207.202.246:8080/web_service_bank_pro/services/AddBalance?wsdl',
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
							document.getElementById('message2-1').innerHTML = `Your balance has been added`;
							document.getElementById('modal-success').style.display = 'block';
						} else {
							document.getElementById('message2-2').innerHTML = `Unknows error`;
							document.getElementById('modal-failed').style.display = 'block';
						}
					});
				};
			};

			request(options, callback);
		}
	}

	handleTransfer = async e => {
		e.preventDefault();

		let receiverAccount = e.target.elements.receiver.value;
		let transferAmount = e.target.elements.amount.value;

		if (receiverAccount === "") {
			document.getElementById('message2-2').innerHTML = `Receiver account can't be empty`;
			document.getElementById('modal-failed').style.display = 'block';
		} else if (transferAmount === "") {
			document.getElementById('message2-2').innerHTML = `Amount can't be empty`;
			document.getElementById('modal-failed').style.display = 'block';
		} else if ((receiverAccount === this.state.accountNumber) || (receiverAccount === "%")) {
			document.getElementById('message2-2').innerHTML = `Invalid account`;
			document.getElementById('modal-failed').style.display = 'block';
		} else if (isNaN(transferAmount)) {
			document.getElementById('message2-2').innerHTML = `Amount must be numbers`;
			document.getElementById('modal-failed').style.display = 'block';
		} else if (Number(this.state.balance) < Number(transferAmount)) {
			document.getElementById('message2-2').innerHTML = `Insufficient balance`;
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
				url: 'http://18.207.202.246:8080/web_service_bank_pro/services/GetAccountNumber?wsdl',
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

						if (validationResult["status"] === "200") {
							let request = require('request');

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
								url: 'http://18.207.202.246:8080/web_service_bank_pro/services/Transfer?wsdl',
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
											document.getElementById('message2-2').innerHTML = `Unknows error`;
											document.getElementById('modal-failed').style.display = 'block';
										}
									});
								};
							};

							request(options, callback);
						} else {
							document.getElementById('message2-2').innerHTML = `Account doesn't exist`;
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
				<div className="wrapper-transfer">
					<img src={logo} className="App-logo" alt="logo" width="50%" />

					<label className="switch">
						<input type="checkbox" onChange={ this.handleCheck }></input>
							<span className="switch-text">
								{
									this.state.check ? "Add Balance" : "Transfer"
								}
							</span>
					</label>

					<div className="container-transfer">
						{
							this.state.check ? <AddBalanceForm onAddBalance={this.handleAddBalance} /> : <TransferForm onTransfer={this.handleTransfer} />
					}
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
