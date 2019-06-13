import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Menu, Button } from "semantic-ui-react";
import { JsonForms } from "@jsonforms/react";
import { getData } from "@jsonforms/core";

import SciDataTab from "./SciDataTab";
import SciDataTabPanel from "./SciDataTabPanel";

// Tabs Component
class SciDataTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: "",
      childActiveItem: "Input",
      childDisplay: this.renderJsonForm({}, {}, "")
    };

    this.defaultDisplay = <h1> </h1>;

    this.changeTab = this.changeTab.bind(this);
    this.changeChildTab = this.changeChildTab.bind(this);
    this.removeTab = this.removeTab.bind(this);
    this.renderTabFromDataset = this.renderTabFromDataset.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
  }

  static propTypes = {
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        fileObj: PropTypes.instanceOf(File),
        fileType: PropTypes.string,
        name: PropTypes.string,
        path: PropTypes.string,
        title: PropTypes.string,
        schema: PropTypes.shape({
          properties: PropTypes.object,
          title: PropTypes.string,
          type: PropTypes.string
        }),
        uischema: PropTypes.shape({
          elements: PropTypes.arrayOf(PropTypes.object),
          label: PropTypes.string,
          type: PropTypes.string

        })
      })
    ),
    handleUpdateDatasets: PropTypes.func
  };

  changeTab(tabName) {
    this.setState({
      activeItem: tabName
    });
  }

  changeChildTab(tabName) {
    this.setState({
      childActiveItem: tabName
    });
  }

  removeTab(tabName) {
    const datasets = this.props.datasets;
    const newDatasets = datasets.filter(obj => obj.name !== tabName);
    this.props.handleUpdateDatasets(newDatasets);
  }

  removeAllTabs() {
    this.props.handleUpdateDatasets([]);
    this.setState({
      display: this.defaultDisplay
    });
  }

  renderTabFromDataset(dataset) {
    const activeItem = this.state.activeItem;
    const isActive = activeItem === dataset.name ? true : false;
    return (
      <SciDataTab
        key={dataset.name}
        name={dataset.name}
        title={dataset.title}
        isActive={isActive}
        changeTab={() => this.changeTab(dataset.name)}
        removeTab={() => this.removeTab(dataset.name)}
      />
    );
  }

  renderJsonForm(dataset) {
    return (
      <div>
        <JsonForms
          key={dataset.name}
          schema={dataset.schema}
          uischema={dataset.uischema}
          path={dataset.path}
        />
        <Button
          content="Submit"
          color="red"
          onClick={() => this.removeTab(dataset.name)}
        />
      </div>
    );
  }

  renderActiveTabPanel() {
    const activeItem = this.state.activeItem;
    const datasets = this.props.datasets;
    if(datasets.length == 0) return;
    const activeDatasetArray = datasets.filter(obj => activeItem === obj.name);
    const dataset = activeDatasetArray[0];

    const childActiveItem = this.state.childActiveItem;

    if (dataset === undefined) {
      return this.defaultDisplay;
    }

    const dataForDataset = this.props.data[dataset.path];

    var display;
    if (childActiveItem === "Input") {
      display = this.renderJsonForm(dataset);
    } else {
      display = JSON.stringify(dataForDataset, null, 2);
    }

    return (
      <SciDataTabPanel
        activeItem={childActiveItem}
        display={display}
        changeChildTab={this.changeChildTab}
      />
    );
  }

  renderTabs() {
    const datasets = this.props.datasets;
    const tabs = datasets.map(dataset => this.renderTabFromDataset(dataset));
    return tabs;
  }

  render() {
    const display = this.renderActiveTabPanel();
    var tabs = this.renderTabs();

    //const myArray = this.createTabs();
    return (
      <div>
        <Button
          content="Submit All Datasets"
          color="blue"
          onClick={() => this.removeAllTabs()}
        />
        <Grid>
          <Grid.Column width={4}>
            <Menu fluid vertical tabular>
              {tabs}
            </Menu>
          </Grid.Column>

          <Grid.Column stretched width={12}>
            {display}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { data: getData(state) };
};

export default connect(mapStateToProps)(SciDataTabs);
