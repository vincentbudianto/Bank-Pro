import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import NavigationBar from '../NavigationBar/NavigationBar';
import Info from '../Info/Info';
import './TransactionsHistory.css';

class TransactionsHistory extends Component {
	state = {
		cookie: undefined,
	}

	constructor() {
		super();
		const cookie = new Cookies();
		this.state.cookie = cookie.get("user");
	}

	componentDidMount() {
		let request = require('request');
		let xml2js = require('xml2js');

		let xml =
			`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services/">
		    	<soapenv:Header/>
				<soapenv:Body>
					<ser:GetHistory>
						<account>` + JSON.parse(atob(this.state.cookie))["accountNumber"] + `</account>
					</ser:GetHistory>
				</soapenv:Body>
			</soapenv:Envelope>`;

		let options = {
			url: 'http://localhost:8080/web_service_bank_pro/services/GetHistory?wsdl',
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
					explicitArray: true
				};

				xml2js.parseString(resultResponse, xmlOptions, (err, res) => {
					let json = JSON.stringify(res);
					let result = JSON.parse(json)["return"];
					console.log("result : ", result);

					if (result["status"][0] === "200") {
						let historyContent = document.getElementsByClassName('history-content')[0];

						for (let i = 0; i < result["transactionTime"].length; i++) {
							historyContent.appendChild(this.renderHistoryContent(result, i));
						}
					}
				});
			};
		};

		request(options, callback);
	}

	renderHistoryContent(e, i) {
		let historyContentItem = document.createElement('div');
		historyContentItem.className = 'history-content-item';

		let time = document.createElement('div');
		time.className = 'text-content-' + e["transactionType"][i];
		time.innerHTML = e["transactionTime"][i].slice(0, -2);

		let type = document.createElement('div');
		type.className = 'text-content-' + e["transactionType"][i];
		type.innerHTML = e["transactionType"][i];

		let amount = document.createElement('div');
		amount.className = 'text-content-' + e["transactionType"][i];
		amount.innerHTML = "Rp. " + e["amount"][i] + ",-";

		let account = document.createElement('div');
		account.className = 'text-content-' + e["transactionType"][i];
		account.innerHTML = e["targetAccount"][i];

		historyContentItem.appendChild(time);
		historyContentItem.appendChild(type);
		historyContentItem.appendChild(amount);
		historyContentItem.appendChild(account);

		return historyContentItem;
	}

	render() {
		return (
			<React.Fragment>
				<NavigationBar></NavigationBar>
				<Info></Info>
				<div className="wrapper-history">
					<div className="history">
						<div className="history-header">
							<div className="text-header">
								Date
							</div>
							<div className="text-header">
								Transaction Type
							</div>
							<div className="text-header">
								Amount
							</div>
							<div className="text-header">
								From/To
							</div>
						</div>

						<div className="history-content">
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
};

export default TransactionsHistory;