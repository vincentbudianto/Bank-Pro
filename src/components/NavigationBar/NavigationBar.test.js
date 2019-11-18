import React from "react";
import { mount } from "enzyme";

// Disarankan file yang akan ditest diletakkan didalam direktori yang sama seperti ini
import NavigationBar from "./NavigationBar";

let navigationBar;

// setiap sebelum melakukan test, komponen ini kita 'pasang' terlebih dahulu
beforeEach(() => {
  navigationBar = mount(<NavigationBar />);
});

// setiap setelah melakukan test, komponen ini kita 'lepas'
afterEach(() => {
  navigationBar.unmount();
});

it("#", () => {
	expect(navigationBar.find("img").length).toEqual(1);
});
