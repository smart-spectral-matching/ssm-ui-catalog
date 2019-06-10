import React from "react";
import { Menu, Segment } from "semantic-ui-react";
import Upload from "../uploadTab/Upload";
import SciDataTabs from "../scidata-tabs/SciDataTabs";

// Tabs
class MainTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: "File Upload",
      display: this.renderFileUpload(),
      datasets: []
    };

    this.changeTab = this.changeTab.bind(this);
    this.updateDatasets = this.updateDatasets.bind(this);
    this.renderSciDataTab = this.renderSciDataTab.bind(this);
    this.setState = this.setState.bind(this);
  }

  renderSciDataTab(datasets) {
    return (
      <SciDataTabs
        datasets={datasets}
        handleUpdateDatasets={this.updateDatasets}
      />
    );
  }

  renderFileUpload(datasets) {
    return (
      <div className="App">
        <div className="Card">
          <Upload
            datasets={datasets}
            handleUpdateDatasets={this.updateDatasets}
          />
        </div>
      </div>
    );
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

  updateDatasets(datasets) {
    const display = this.renderSciDataTab(datasets);
    this.setState({
      datasets: datasets,
      display: display
    });
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
