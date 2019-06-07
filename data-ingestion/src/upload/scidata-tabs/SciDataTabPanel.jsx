import React from "react";
import PropTypes from "prop-types";
import { Menu, Segment } from "semantic-ui-react";

export default class  SciDataTabPanel extends React.Component {
    static propTypes = {
      display: PropTypes.node,
      activeItem: PropTypes.string,
      changeChildTab: PropTypes.func
    };
  
    render () {
      const {
        display,
        activeItem,
        changeChildTab
      } = this.props;
  
      return (
        <div>
          <Menu pointing secondary>
            <Menu.Item
              name="Input"
              active={activeItem === "Input"}
              onClick={() => changeChildTab("Input")}
            />
            <Menu.Item
              name="JSON-LD"
              active={activeItem === "JSON-LD"}
              onClick={() => changeChildTab("JSON-LD")}
            />
          </Menu>
  
          <Segment>{display}</Segment>
        </div>
      );
    }
  }