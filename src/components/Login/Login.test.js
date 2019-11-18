import React from "react";
import { mount } from "enzyme";

// Disarankan file yang akan ditest diletakkan didalam direktori yang sama seperti ini
import Login from "./Login";

let login;

// setiap sebelum melakukan test, komponen ini kita 'pasang' terlebih dahulu
beforeEach(() => {
  login = mount(<Login />);
});

// setiap setelah melakukan test, komponen ini kita 'lepas'
afterEach(() => {
  login.unmount();
});

it("#", () => {
	expect(login.find("img").length).toEqual(1);
});
