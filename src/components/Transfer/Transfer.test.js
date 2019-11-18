import React from "react";
import { mount } from "enzyme";

// Disarankan file yang akan ditest diletakkan didalam direktori yang sama seperti ini
import Transfer from "./Transfer";

let transfer;

// setiap sebelum melakukan test, komponen ini kita 'pasang' terlebih dahulu
beforeEach(() => {
  transfer = mount(<Transfer />);
});

// setiap setelah melakukan test, komponen ini kita 'lepas'
afterEach(() => {
  transfer.unmount();
});

it("#", () => {
	expect(transfer.find("p").length).toEqual(4);
});
