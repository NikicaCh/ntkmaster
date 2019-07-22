import React from 'react';
import MaterialTable from 'material-table';
import Checkbox from '@material-ui/core/Checkbox';


class  MaterialTableDemo extends React.Component {
  constructor(props) {
    super(props);
    console.log("data",this.props.records)

    this.state = {
      TableColumns: [],
      data: [],
      style: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    
    this.setState({data: nextProps.records})
    Object.keys(nextProps.records[0]).map((key, index) => {
      console.log("ITEM",key, index)
      if(nextProps.records[0][key] == true) {
        nextProps.records[0][key] = 
          <Checkbox
            checked={true}
            color="primary"/>
      } else if(nextProps.records[0][key] == false)
        nextProps.records[0][key] = 
          <Checkbox
            checked={false}
            color="primary"/>
    })

  }

  componentDidMount() {
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
      top: "10%",
      width: "90%",
      right: "5%",
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