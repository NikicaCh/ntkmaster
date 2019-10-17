import React from 'react'
import MaterialTable from 'material-table'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import firebase from 'firebase'
import date from 'date-and-time'
import Snackbar from './SnackBar'
import DatePicker from './DatePicker'
import { isThisISOWeek } from 'date-fns/esm'
import Switches from './Switch'


class  MaterialTableDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      TableColumns: [],
      data: [],
      style: {},
      classes: {
        textField: {
          // marginLeft: theme.spacing(1),
          // marginRight: theme.spacing(1),
        }
      },
      newRecords: [],
      selectedDate: "",
      pagination: {
        "paging": false
      }
    }
    this.handleCheckBox = this.handleCheckBox.bind(this)
    this.selectDate = this.selectDate.bind(this)
    this.switchPagination = this.switchPagination.bind(this)
  }
  
  switchPagination = (state) => {
    console.log("STATE", state)
    if(state === false) {
      let obj = {
        paging: false
      }
      this.setState({pagination: obj })
    } else {
      let obj = ""
      this.setState({pagination: obj })
    }
  }
  

  componentWillReceiveProps(nextProps) {
      this.setState({data: nextProps.records})
      Object.keys(nextProps.records).map((key, index) => {
        Object.keys(nextProps.records[key]).map((_key, _index) => {
          if(typeof nextProps.records[key][_key] == "boolean") {
            const id = nextProps.records[key].Bolla;
            const field = _key;
            const value = !nextProps.records[key][_key];
            let keys = Object.keys(nextProps.records[key])
            let date = keys[(keys.indexOf(_key) + 1)]
            nextProps.records[key][_key] = 
              <Checkbox
                onChange={ (key) => {
                  this.handleCheckBox(id, field, value, date)
                }}
                checked={nextProps.records[key][_key]}
                color="primary"/>
          } else if(typeof nextProps.records[key][_key] == "string" && nextProps.records[key][_key] == "" ) {
            // nextProps.records[key][_key] = 
            //   <TextField
            //     id="standard-helperText"
            //     label="Insert Date"
            //     defaultValue=""
            //     className={this.state.classes.textField}
            //     // helperText="default: today's date"
            //     margin="normal"/>
          }
        })
        this.setState({data: nextProps.records})
      })
    this.setState({updated: true})
  }

  componentDidMount() {    
    const TableColumns = this.props.tableColumns;
    const style = {
      position: "absolute",
      top: "15%",
      width: "83%",
      left: "16%",
      color: "#3f51b5"
    }
    let now = new Date();
    const selectedDate = date.format(now, "DD.MM.YYYY")
    this.setState({TableColumns, style, selectedDate})

    let inputs = document.querySelectorAll(".MuiInput-input");
    let query = inputs[1].className
    let input = document.getElementsByClassName(query)[0]
    input.addEventListener("change", (e) => {
      this.props.countRows();
  })
    console.log(input)
    // inputs[1].addEventListener("input", (e) => {
    //   e.preventDefault();
    //   console.log(e.target.value)
    //   this.countRows();
    // })
    // for(let input in inputs) {
    //   input.addEventListener("input", (e) => {
    //     this.countRows();
    //   })
    // }
    // let inputs = document.querySelectorAll('.MuiInputBase-inputAdornedStart');
    // for (let input in inputs) {
    //   input.addEventListener("input",(e) => {
    //     console.log("AHA")
    //   })
    // }
    // let inputs = document.getElementsByClassName(".MuiInputBase-input");
  }


  handleCheckBox = (id, field, value, fieldDate) => {
    let doc = firebase.firestore().collection("Bolla").doc(id);
    const fieldD = this.state.selectedDate;
    const object = {}
    object[field] = value;
    if(value === true) object[fieldDate] = fieldD;
    else object[fieldDate] = ""
    return doc.update(object)
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }

  selectDate = (date) => {
    this.setState({selectedDate: date})
    this.props.selectDate(date)
  }

  
  
  render() {
    
    let now = new Date();
    const importDate = this.state.selectedDate;
    let newObject = this.props.newObject;
    newObject.ImpDate = importDate;
    return (
      <div>
      <DatePicker
        date={now}
        selectDate={this.selectDate}/>
      <Snackbar />
      <Switches  pagination={this.switchPagination}/>
      <MaterialTable
        title="Season 201"
        columns={this.state.TableColumns}
        data={this.props.records}
        style={this.state.style}
        options={this.state.pagination}
        editable={{
          onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              Object.keys(newData).map((key, index) => {
                newObject[key] = newData[key]
              })
              let data = [...this.state.data];
              let newRecords = [...this.props.newRecords]
              data.push(newObject);
              newRecords.push(newObject)
              this.setState({ ...this.state, data });
              this.props.setNewRecords(newRecords);
            }, 600);
          }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.props.updateDb(newData, oldData)
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              this.props.deleteFromDb(oldData.Bolla || oldData.Name)
              setTimeout(() => {
                resolve();
              }, 600);
            }),
        }}
      />
      </div>
      );
  }
}

export default MaterialTableDemo;