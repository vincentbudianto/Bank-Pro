import React from "react";
import { mount } from "enzyme";

// Disarankan file yang akan ditest diletakkan didalam direktori yang sama seperti ini
import Info from "./Info";

let info;

// setiap sebelum melakukan test, komponen ini kita 'pasang' terlebih dahulu
beforeEach(() => {
  info = mount(<Info />);
});

// setiap setelah melakukan test, komponen ini kita 'lepas'
afterEach(() => {
  info.unmount();
});

it("#", () => {
	expect(info.find("img").length).toEqual(1);
});
