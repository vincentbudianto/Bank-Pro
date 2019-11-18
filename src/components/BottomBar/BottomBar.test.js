import React from "react";
import { mount, configure } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';

// Disarankan file yang akan ditest diletakkan didalam direktori yang sama seperti ini
import BottomBar from "./BottomBar";

configure({ adapter: new Adapter() });

let bottomBar;

// setiap sebelum melakukan test, komponen ini kita 'pasang' terlebih dahulu
beforeEach(() => {
  bottomBar = mount(<BottomBar />);
});

// setiap setelah melakukan test, komponen ini kita 'lepas'
afterEach(() => {
  bottomBar.unmount();
});

it("punya footer", () => {
	expect(bottomBar.find("footer").length).toEqual(1);
});
