import React from "react";
import { mount } from "enzyme";

// Disarankan file yang akan ditest diletakkan didalam direktori yang sama seperti ini
import Title from "./Title";

let title;

// setiap sebelum melakukan test, komponen ini kita 'pasang' terlebih dahulu
beforeEach(() => {
  title = mount(<Title />);
});

// setiap setelah melakukan test, komponen ini kita 'lepas'
afterEach(() => {
  title.unmount();
});

it("#", () => {
	expect(title.find("p").length).toEqual(2);
});
