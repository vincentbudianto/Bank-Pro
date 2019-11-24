import React from 'react';

const TransferForm = props => (
	<form className="transfer-form" onSubmit={props.onTransfer}>
		<label htmlFor="receiver" id="label-account">Receiver Account</label>
		<input id="receiver-input" type="text" name="receiver"/>
		<span id="false-account-msg" className="input-message"></span>

		<label htmlFor="amount" id="label-amount">Transfer Amount</label>
		<input id="amount-input" type="text" name="amount"/>
		<span id="false-amount-msg" className="input-message"></span>

 		<button className="transfer-button">Transfer</button>
	</form>
);

export default TransferForm;