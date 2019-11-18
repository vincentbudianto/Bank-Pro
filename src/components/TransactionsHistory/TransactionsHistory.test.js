import React from "react";
import { mount } from "enzyme";

// Disarankan file yang akan ditest diletakkan didalam direktori yang sama seperti ini
import TransactionsHistory from "./TransactionsHistory";

let transactionsHistory;

// setiap sebelum melakukan test, komponen ini kita 'pasang' terlebih dahulu
beforeEach(() => {
  transactionsHistory = mount(<TransactionsHistory />);
});

// setiap setelah melakukan test, komponen ini kita 'lepas'
afterEach(() => {
  transactionsHistory.unmount();
});

it("#", () => {
	expect(transactionsHistory.find("div").length).toEqual(7);
});
