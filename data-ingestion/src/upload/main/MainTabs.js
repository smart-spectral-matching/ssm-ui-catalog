import React from "react";
import { getSchema, Actions } from "@jsonforms/core";
import { Menu, Segment } from "semantic-ui-react";
import Upload from "../uploadTab/Upload";
import SciDataTabs from "../scidata-tabs/SciDataTabs";

import store from "../../store";

// Tabs
class MainTabs extends React.Component {
  constructor(props) {
    super(props);

    this.setState = this.setState.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.handleUpdateDatasets = this.handleUpdateDatasets.bind(this);
    this.handleUpdateDatasetsSciDataTab = this.handleUpdateDatasetsSciDataTab.bind(
      this
    );
    this.renderSciDataTab = this.renderSciDataTab.bind(this);
    this.renderFileUpload = this.renderFileUpload.bind(this);

    this.state = {
      activeItem: "File Upload",
      display: this.renderFileUpload([]),
      datasets: []
    };
  }

  changeTab(name) {
    const datasets = this.state.datasets;
    var display;
    if (name === "File Upload") {
      display = this.renderFileUpload(datasets);
    } else if (name === "SciData") {
      display = this.renderSciDataTab(datasets);
    }
    this.setState({
      activeItem: name,
      display: display
    });
  }

  handleUpdateDatasets(datasets) {
    const newDatasets = this.addFormForDatasets(datasets);
    this.setState({
      datasets: newDatasets
    });
  }

  handleUpdateDatasetsSciDataTab(datasets) {
    const display = this.renderSciDataTab(datasets);
    this.setState({
      datasets: datasets,
      display: display
    });
  }

  addFormForDatasets(datasets) {
    var newDatasets = [];
    for (var i = 0; i < datasets.length; i++) {
      newDatasets.push(this.addFormForDataset(datasets[i]));
    }
    return newDatasets
  }

  addFormForDataset(dataset) {
    var newDataset = dataset;
    newDataset.schema = this.props.schema;
    newDataset.uischema = this.props.uischema;
    newDataset.path = dataset.name;

    var schema = getSchema(store.getState());

    // necessary to see if we defined a schema yet
    if(schema.hasOwnProperty("properties")) {
      schema.properties[newDataset.path] = newDataset.schema;
    } else {
      // Initialize store
      const initSchema = {
        type: "object",
        properties: {
          path: schema
        }
      };
      store.dispatch(Actions.init({}, initSchema));
    }
    return newDataset
  }

  renderSciDataTab(datasets) {
    return (
      <SciDataTabs
        datasets={datasets}
        handleUpdateDatasets={this.handleUpdateDatasetsSciDataTab}
      />
    );
  }

  renderFileUpload(datasets) {
    return (
      <div className="App">
        <div className="Card">
          <Upload
            datasets={datasets}
            handleUpdateDatasets={this.handleUpdateDatasets}
            schema={this.schema}
            uischema={this.uischema}
          />
        </div>
      </div>
    );
  }

  render() {
    const activeItem = this.state.activeItem;
    const display = this.state.display;
    return (
      <div>
        <Menu tabular>
          <Menu.Item
            name="File Upload"
            active={activeItem === "File Upload"}
            onClick={() => this.changeTab("File Upload")}
          />
          <Menu.Item
            name="SciData"
            active={activeItem === "SciData"}
            onClick={() => this.changeTab("SciData")}
          />
        </Menu>

        <Segment>{display}</Segment>
      </div>
    );
  }
}

export default MainTabs;

