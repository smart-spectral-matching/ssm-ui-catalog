import React, { Component } from "react";
import Dropzone from "../dropzone/Dropzone";
import Progress from "../progress/Progress";
import { Input, Grid, Segment, Label } from "semantic-ui-react";

import uploadStyles from "./UploadStyles";
import checkIconImage from "../../../images/baseline-check_circle_outline-24px.svg";

import mergeStyles from "../../../utils/MergeStyles";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };

    this.styles = uploadStyles;

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));
  }

  fakeRetrieveFile(file) {
    
    // If name doesn't change, it is undefined
    if(file['name'] === undefined) {
      file['name'] = file['title']
    }

    //TODO: gotta change this to be unique
    /*
    if(file['title'] === 'argon.gr') {
      file["schema"] = personSchema;
      file["uischema"] = personUISchema;
      file["path"] = "person"; 
    } else {
      file["schema"] = addressSchema;
      file["uischema"] = addressUISchema;
      file["path"] = "address"; 
    }
    */
    return file;
  }

  fakeRetrieveFiles() {
    const files = this.state.files;
    // files -> datasets
    const datasets = files.map(file => this.fakeRetrieveFile(file));
    return datasets;
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach(file => {
      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises);

      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
    const newDatasets = this.fakeRetrieveFiles();
    this.props.handleUpdateDatasets(newDatasets);
  }

  sendRequest(file) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: copy });
        }
      });

      req.upload.addEventListener("load", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });
        resolve(req.response);
      });

      req.upload.addEventListener("error", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append("file", file);

      req.open("POST", "http://localhost:8000/upload");
      req.send(formData);
    });
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div style={this.styles.progressWrapper}>
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            alt="done"
            src={checkIconImage}
            style={mergeStyles([
              this.styles.checkIcon,
              { opacity: uploadProgress && uploadProgress.state === "done" ? 0.5 : 0 }
            ])}
          />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullUploaded) {
      return (
        <button
          style={this.styles.button}
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false })
          }
        >
          Clear
        </button>
      );
    } else {
      return (
        <button
          style={this.styles.button}
          disabled={this.state.files.length < 0 || this.state.uploading}
          onClick={this.uploadFiles}
        >
          Upload
        </button>
      );
    }
  }

  handleTitleChange(e) {
    const files = this.state.files;
    var newFiles = [];
    const filename = e.target.defaultValue;
    const value = e.target.value;

    // Update files values for change
    for (var i = 0; i < files.length; i++) {
      if (files[i].title === filename) {
        newFiles[i] = {
          fileObj: files[i].fileObj,
          title: value,
          name: filename
        };
      } else {
        newFiles[i] = files[i];
      }
    }

    // Set new state of files
    this.setState({
      files: newFiles
    });
  }

  render() {
    return (
      <div styles={this.styles.upload}>
        <span tyle={this.styles.title}>Upload Files</span>
        <div style={this.styles.content}>
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded}
            />
          </div>
          <div style={this.styles.files}>
            {this.state.files.map(file => {
              return (
                <div key={file.fileObj.name} style={this.styles.row}>
                  <Segment>
                    <Grid columns={2} relaxed="very">
                      <Grid.Column>
                        <Label horizontal>Filename:</Label> {file.fileObj.name}
                      </Grid.Column>
                      <Grid.Column>
                        <Input
                          key={file.fileObj.name}
                          size="mini"
                          label="Title:"
                          defaultValue={file.title}
                          onChange={this.handleTitleChange.bind(this)}
                        />
                      </Grid.Column>
                    </Grid>
                  </Segment>

                  {this.renderProgress(file)}
                </div>
              );
            })}
          </div>
        </div>
        <div style={this.styles.actions}>{this.renderActions()}</div>
      </div>
    );
  }
}

export default Upload;
