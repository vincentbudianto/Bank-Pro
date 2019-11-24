import React from 'react';

const AddBalanceForm = props => (
	<form className="add-balance-form" onSubmit={props.onAddBalance}>
		<label htmlFor="amount" id="label-amount">Add Amount</label>
		<input id="amount-input" type="text" name="amount"/>
		<span id="false-amount-msg" className="input-message"></span>

 		<button className="add-balance-button">Add Balance</button>
	</form>
);

export default AddBalanceForm;