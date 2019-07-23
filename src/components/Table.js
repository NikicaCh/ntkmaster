import React from 'react';
import MaterialTable from 'material-table';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import moment from 'moment'



class  MaterialTableDemo extends React.Component {
  constructor(props) {
    super(props);
    console.log("data",this.props.records)

    this.state = {
      TableColumns: [],
      data: [],
      style: {},
      classes: {
        textField: {
          // marginLeft: theme.spacing(1),
          // marginRight: theme.spacing(1),
          
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    
    this.setState({data: nextProps.records})
    Object.keys(nextProps.records[0]).map((key, index) => {
      if(nextProps.records[0][key] === true) {
        nextProps.records[0][key] = 
          <Checkbox
            checked={true}
            color="primary"/>
      } else if(nextProps.records[0][key] === false) {
        nextProps.records[0][key] = 
          <Checkbox
            checked={false}
            color="primary"/>
      } else if(nextProps.records[0][key] === "") {
        nextProps.records[0][key] = 
        <TextField
          id="standard-helperText"
          // label="Insert Date"
          defaultValue="Default Value"
          className={this.state.classes.textField}
          // helperText="default: today's date"
          margin="normal"
      />
      }
    })

  }

  componentDidMount() {
    console.log(moment("July 12, 2019 at 12:00:00 AM UTC+2").format())
    // <Checkbox
    //     checked={state.checkedA}
    //     onChange={handleChange('checkedA')}
    //     value="checkedA"
    //     inputProps={{
    //       'aria-label': 'primary checkbox',
    //     }}
    //   />
    const TableColumns = this.props.tableColumns;
    const style = {
      position: "absolute",
      top: "15%",
      width: "95%",
      left: "2.5%",
      fontSize: "1vw"
    }
    this.setState({TableColumns, style})
  }
  
  render() {
    return (
      <MaterialTable
        title="Season 201"
        columns={this.state.TableColumns}
        data={this.state.data}
        style={this.state.style}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const data = [...this.state.data];
                data.push(newData);
                this.setState({ ...this.state, data });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const data = [...this.state.data];
                data[data.indexOf(oldData)] = newData;
                this.setState({ ...this.state, data });
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const data = [...this.state.data];
                data.splice(data.indexOf(oldData), 1);
                this.setState({ ...this.state, data });
              }, 600);
            }),
        }}
      />
      );
  }
}

export default MaterialTableDemo;