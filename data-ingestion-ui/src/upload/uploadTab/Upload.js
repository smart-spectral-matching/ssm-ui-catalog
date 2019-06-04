import React, { Component } from "react";
import Dropzone from "../dropzone/Dropzone";
import "./Upload.css";
import Progress from "../progress/Progress";
import { Input, Grid, Segment, Label } from "semantic-ui-react";

import personSchema from "../../schemas/personSchema";
import personUISchema from "../../schemas/personUISchema";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };

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
    this.fakeRetrieveFiles();
  }

  fakeRetrieveFiles() {
    const files = this.state.files;
    // files -> datasets
    const datasets = files.map(file => this.fakeRetrieveFile(file));
    console.log(datasets);
  }

  fakeRetrieveFile(file) {
    file["schema"] = personSchema;
    file["uischema"] = personUISchema;
    file["path"] = "person"; //TODO: gotta change this to be unique
    return file;
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
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullUploaded) {
      return (
        <button
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
          title: value
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
      <div className="Upload">
        <span className="Title">Upload Files</span>
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded}
            />
          </div>
          <div className="Files">
            {this.state.files.map(file => {
              return (
                <div key={file.fileObj.name} className="Row">
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
        <div className="Actions">{this.renderActions()}</div>
      </div>
    );
  }
}

export default Upload;
