import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { positions } from "@material-ui/system";
//test

class QueryTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
    this.props.queryIndex(newValue);
  }

  render() {
    return (
      <div className="query-tabs">
        <Paper square>
          <Tabs
            value={this.state.value || 0}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleChange}
            variant="fullWidth"
          >
            <Tab label="All" />
            <Tab label="Cuting" />
            <Tab label="Sewing" />
            <Tab label="Control" />
            <Tab label="Exported" />
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default QueryTab;
