import React from "react";
import { mount } from "enzyme";
import SciDataTabPanel from "./SciDataTabPanel";

describe("SciDataTabPanel", () => {
  let props;
  let mountedSciDataTabPanel;
  const scidataTabPanel = () => {
    if (!mountedSciDataTabPanel) {
      mountedSciDataTabPanel = mount(<SciDataTabPanel {...props} />);
    }
    return mountedSciDataTabPanel;
  };

  beforeEach(() => {
    props = {
      display: undefined,
      activeItem: undefined,
      changeChildTab: undefined
    };
    mountedSciDataTabPanel = undefined;
  });

  it("always renders a div", () => {
      const divs = scidataTabPanel().find("div");
      expect(divs.length).toBeGreaterThan(0);
  });

  it("always renders a Menu", () => {
    const menu = scidataTabPanel().find("Menu");
    expect(menu.length).toBeGreaterThan(0);
  });

  describe("rendered Menu", () => {
    it("always renders two MenuItem tabs", () => {
      const menuItems = scidataTabPanel().find("MenuItem");
      expect(menuItems.length).toBe(2);
    });
  });


});
