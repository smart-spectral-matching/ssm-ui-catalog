import React, { Component } from "react";
import mergeStyles from "../../../utils/MergeStyles";
import dropzoneStyles from "./DropzoneStyles";

import uploadImage from "../../../images/baseline-cloud_upload-24px.svg";

class Dropzone extends Component {
  constructor(props) {
    super(props);
    this.state = { hightlight: false };
    this.fileInputRef = React.createRef();

    this.styles = dropzoneStyles;

    this.openFileDialog = this.openFileDialog.bind(this);
    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  openFileDialog() {
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
  }

  onFilesAdded(evt) {
    if (this.props.disabled) return;
    const files = evt.target.files;
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files);
      this.props.onFilesAdded(array);
    }
  }

  onDragOver(event) {
    event.preventDefault();
    if (this.props.disabed) return;
    this.setState({ hightlight: true });
  }

  onDragLeave(event) {
    this.setState({ hightlight: false });
  }

  onDrop(event) {
    event.preventDefault();
    if (this.props.disabed) return;
    const files = event.dataTransfer.files;
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files);
      this.props.onFilesAdded(array);
    }
    this.setState({ hightlight: false });
  }

  fileListToArray(list) {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push({
        fileObj: list.item(i),
        title: list.item(i).name,
        fileType: "XY file"
      });
    }
    return array;
  }

  render() {
    return (
      <div
        style={mergeStyles([
          this.styles.dropzone,
          { highlith: this.state.hightlight ? this.styles.highlight : ""},
          { cursor: this.props.disabled ? "default" : "pointer" }
        ])}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onClick={this.openFileDialog}
      >
        <input
          ref={this.fileInputRef}
          style={this.styles.fileInput}
          type="file"
          multiple
          onChange={this.onFilesAdded}
        />
        <img alt="upload" style={this.styles.icon} src={uploadImage} />
        <span>Upload Files</span>
      </div>
    );
  }
}

export default Dropzone;
