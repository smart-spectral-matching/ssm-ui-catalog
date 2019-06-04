import React from "react";
import { mount } from "enzyme";
import SciDataTab from "./SciDataTab";

describe("SciDataTab", () => {
  let props;
  let mountedSciDataTab;
  const scidataTab = () => {
    if (!mountedSciDataTab) {
      mountedSciDataTab = mount(<SciDataTab {...props} />);
    }
    return mountedSciDataTab;
  };

  beforeEach(() => {
    props = {
      name: undefined,
      title: undefined,
      isActive: undefined,
      changeTab: undefined,
      removeTab: undefined
    };
    mountedSciDataTab = undefined;
  });

  it("always renders a Menu.Item", () => {
      const menuItem = scidataTab().find("MenuItem");
      expect(menuItem.length).toBeGreaterThan(0);
  });

  describe("rendered Menu.Item", () => {
    it("has 4 props", () => {
      const menuItem = scidataTab().find("MenuItem");
      expect(Object.keys(menuItem.props()).length).toBe(4);
    });
  });


});
