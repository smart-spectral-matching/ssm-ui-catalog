import React from "react";
import PropTypes from "prop-types";
import { Menu, Icon } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";

// Tab Component
export default class  SciDataTab extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    isActive: PropTypes.bool,
    changeTab: PropTypes.func,
    removeTab: PropTypes.func,
  };

  render() {
    const {
      name,
      title,
      isActive,
      changeTab,
      removeTab
    } = this.props;

    return (
      <Menu.Item
        key={name}
        active={isActive}
        onClick={changeTab}
        as="a"
      >
        {title} <Icon name="remove circle" onClick={removeTab} />
      </Menu.Item>
    );
  }
}

