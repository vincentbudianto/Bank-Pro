import React, { Component } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import './TransactionsHistory.css';

class TransactionsHistory extends Component {
	render() {
		return (
			<React.Fragment>
				<NavigationBar></NavigationBar>
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
							<div className="history-content-item">
								<div className="text-content">
									Data
								</div>

								<div className="text-content">
									Data
								</div>

								<div className="text-content">
									Data
								</div>

								<div className="text-content">
									Data
								</div>
							</div>

							<div className="history-content-item">
								<div className="text-content">
									Data
								</div>

								<div className="text-content">
									Data
								</div>

								<div className="text-content">
									Data
								</div>

								<div className="text-content">
									Data
								</div>
							</div>

							<div className="history-content-item">
								<div className="text-content">
									Data
								</div>

								<div className="text-content">
									Data
								</div>

								<div className="text-content">
									Data
								</div>

								<div className="text-content">
									Data
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	};
};

export default TransactionsHistory;