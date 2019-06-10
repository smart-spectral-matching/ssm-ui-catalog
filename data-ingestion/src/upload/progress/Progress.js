import React, { Component } from "react";
import progressStyles from "./ProgressStyles";
import mergeStyles from "../../../utils/MergeStyles";

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styles = progressStyles;
  }
  render() {
    return (
      <div style={this.styles.progressStyles}>
        <div
          style={mergeStyles([
            this.styles.progress,
            { width: this.props.progress + "%" }
          ])}
        />
      </div>
    );
  }
}

export default Progress;
