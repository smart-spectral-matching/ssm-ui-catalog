import React from "react";
import { mount } from "enzyme";
import SciDataTab from "./SciDataTab";
import { Icon } from "semantic-ui-react";

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

  describe("when `isActive` is defined", () => {
    beforeEach( () => {
      props.isActive = true;
    })

    it("sets the rendered `Menu.Item`'s `active` prop to the same value as `isActive`'", () => {
      const menuItem = scidataTab().find("MenuItem");
      expect(menuItem.props().active).toBe(props.isActive);
    });
  });

  describe("when `isActive` is undefined", () => {
    beforeEach( () => {
      props.isActive = undefined;
    })

    it("sets the rendered `Menu.Item`'s `active` prop to undefined'", () => {
      const menuItem = scidataTab().find("MenuItem");
      expect(menuItem.props().active).not.toBeDefined();
    });
  });

  describe("when `title` is defined", () => {
    beforeEach( () => {
      props.title = "My title!";
    })

    it("passes `title` to the rendered `MenuItem` as part of `children` with Icon", () => {
      const menuItem = scidataTab().find("MenuItem");
      expect(menuItem.props().children).toContain(props.title);
    });
  });


});
