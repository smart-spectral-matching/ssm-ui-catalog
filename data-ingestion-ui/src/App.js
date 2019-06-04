import React from "react";
import { Form, Label, Container, Header } from "semantic-ui-react";
import { MethodDropdown } from "./selection/method";
import { ExperimentalTechniqueDropdown } from "./selection/experimental/technique";
import { CalculationTechniqueDropdown } from "./selection/calculation/technique";
import { SpectroscopyTypeDropdown } from "./selection/experimental/types/spectroscopy";
import { AtomisticQuantumTypeDropdown } from "./selection/calculation/types/atomisticQuantum";
import MainTabs from "./upload/main/MainTabs";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: [this.renderMethodDropDown()],
      methodSelected: false,
      techniqueSelected: false
    };

    this.handleMethodChange = this.handleMethodChange.bind(this);
  }

  renderDropDown = (title, dropdown) => {
    return (
      <Form>
        <Form.Field>
          <Label color="red">{title}: </Label> {dropdown}
        </Form.Field>
      </Form>
    );
  };

  renderMethodDropDown = () => {
    return this.renderDropDown(
      "Method",
      <MethodDropdown onChange={this.handleMethodChange} />
    );
  };

  renderTechniqueDropDown = dropdown => {
    return this.renderDropDown("Technique", dropdown);
  };

  renderTypeDropDown = dropdown => {
    return this.renderDropDown("Type", dropdown);
  };

  handleMethodChange = value => {
    var newDisplay = this.state.display;
    if (value === "Experimental") {
      newDisplay = [
        this.renderMethodDropDown(),
        this.renderTechniqueDropDown(
          <ExperimentalTechniqueDropdown
            onChange={this.handleTechniqueChange}
          />
        )
      ];
    } else if (value === "Calculation") {
      newDisplay = [
        this.renderMethodDropDown(),
        this.renderTechniqueDropDown(
          <CalculationTechniqueDropdown onChange={this.handleTechniqueChange} />
        )
      ];
    } else {
      newDisplay = [this.renderMethodDropDown()];
    }

    this.setState({
      display: newDisplay
    });
  };

  handleTechniqueChange = value => {
    console.log("handleTechniqueChange");
    console.log(value);

    var newDisplay = this.state.display;
    if (value === "Spectroscopy") {
      newDisplay.push(
        this.renderTypeDropDown(
          <SpectroscopyTypeDropdown onChange={this.handleTypeChange} />
        )
      );
    } else if (value === "Atomistic (Quantum)") {
      newDisplay.push(
        this.renderTypeDropDown(
          <AtomisticQuantumTypeDropdown onChange={this.handleTypeChange} />
        )
      );
    } else if (value === "") {
      newDisplay = this.state.display;
    } else {
      newDisplay.push(<h1> Coming soon...</h1>);
    }

    this.setState({
      display: newDisplay
    });
  };

  handleTypeChange = value => {
    console.log(value);
    var newDisplay = this.state.display;
    newDisplay.push(
      <div>
        {" "}
        <MainTabs />{" "}
      </div>
    );
    this.setState({
      display: newDisplay
    });
  };

  render() {
    const display = this.state.display;
    return (
      <div>
        <Header as="h2" icon textAlign="center">
          <img src="logo.6023b87e.png" alt="" />
          Data Ingestion
          <Header.Subheader>
            Upload files from multi-method data sources
          </Header.Subheader>
        </Header>
        <Container style={{ margin: 20 }}>{display}</Container>
      </div>
    );
  }
}

export default App;
