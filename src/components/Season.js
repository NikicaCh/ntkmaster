import React from "react";
import firebase from "firebase";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import * as Excel from "exceljs";
import Axios from "axios";
import XlsxPopulate from "xlsx-populate";
import date from "date-and-time";

//Components
import Navbar from "./navbar";
import MaterialTableDemo from "./Table";
import QueryTab from "./Tab";
import CircularIntegration from "./saveButton";

//old url from heroku service: https://xlsx-populator.herokuapp.com/
let urlDev = "http://localhost:8000/";
let urlProd = "https://xlsx-populator-production.up.railway.app/"; //new service railway
let theUrl = urlProd;

class Season extends React.Component {
  constructor() {
    super();

    this.state = {
      allRecords: [],
      records: [],
      queryInd: 0,
      tableColumns: [
        { title: "Import Number", field: "ImportNo" },
        { title: "Bolla", field: "Bolla" },
        { title: "Article", field: "Art" },
        { title: "Quantity", field: "Quantity" },
        { title: "Import Date", field: "ImpDate" },
        { title: "Cut", field: "Cut" },
        { title: "Cut Date", field: "CutDate" },
        { title: "Sewed", field: "Sewed" },
        { title: "Sewed Date", field: "SewedDate" },
        { title: "Export", field: "Export" },
        { title: "Export Date", field: "ExportDate" },
      ],
      newObject: {
        ImportNo: "",
        Bolla: "",
        Art: "",
        Quantity: 0,
        ImpDate: "",
        Cut: false,
        CutDate: "",
        Sewed: false,
        SewedDate: "",
        Export: false,
        ExportDate: "",
      },
      newRecords: [],
      selectedDate: "",
      exportRecords: [],
      total: 0,
    };

    this.wakeUpServer = this.wakeUpServer.bind(this);
    this.query = this.query.bind(this);
    this.queryIndex = this.queryIndex.bind(this);
    this.dailyReport = this.dailyReport.bind(this);
    this.addToDb = this.addToDb.bind(this);
    this.newRecords = this.newRecords.bind(this); // send newrecords from table to season
    this.updateDb = this.updateDb.bind(this);
    this.deleteFromDb = this.deleteFromDb.bind(this);
    this.selectDate = this.selectDate.bind(this);
    this.expReport = this.expReport.bind(this);
    this.countRows = this.countRows.bind(this);
  }

  countRows = () => {
    let tableRows = document.getElementsByTagName("tbody")[0].rows;
    if (tableRows.length > 1) {
      let total = 0;
      Object.keys(tableRows).map((key) => {
        total += parseInt(
          tableRows[key].getElementsByTagName("td")[4].innerHTML
        );
      });
      this.setState({ total });
    } else if (
      tableRows.length === 1 &&
      tableRows[0].getElementsByTagName("td")[4] !== undefined
    ) {
      let total = tableRows[0].getElementsByTagName("td")[4].innerHTML;
      this.setState({ total: total });
    } else {
      this.setState({ total: 0 });
    }
  };

  wakeUpServer = () => {
    Axios.post(`${theUrl}wakeup`, {
      data: "wakeUP!",
    })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  query = (index) => {
    let array = [];
    this.state.allRecords.map((record) => {
      if (
        index === 3 &&
        record.Cut.props.checked &&
        record.Sewed.props.checked &&
        record.Export.props.checked !== true
      ) {
        array.push(record);
      } else if (
        index === 4 &&
        record.Cut.props.checked &&
        record.Sewed.props.checked &&
        record.Export.props.checked
      ) {
        array.push(record);
      } else if (index === 0) {
        array.push(record);
      } else if (
        index === 1 &&
        record.Cut.props.checked !== true &&
        record.Sewed.props.checked !== true &&
        record.Export.props.checked !== true
      ) {
        array.push(record);
      } else if (
        index === 2 &&
        record.Cut.props.checked &&
        record.Sewed.props.checked !== true &&
        record.Export.props.checked !== true
      ) {
        array.push(record);
      }
    });
    this.setState({ records: array, exportRecords: array }, () => {
      this.countRows();
    });
  };

  queryIndex = (index) => {
    this.setState({ queryInd: index }, () => {
      this.query(index);
    });
  };

  componentDidMount() {
    firebase
      .firestore()
      .collection("Bolla")
      .onSnapshot((serverUpdate) => {
        const data = serverUpdate.docs.map((_docs) => {
          const d = _docs.data();
          return d;
        });
        this.setState({ allRecords: data, records: data });
        this.query(this.state.queryInd);
      });
    setInterval(() => {
      this.wakeUpServer();
    }, 29000);
    let now = new Date();
    const selectedDate = date.format(now, "DD.MM.YYYY");
    this.setState({ selectedDate });
    setInterval(() => {
      this.addToDb(this.state.newRecords);
    }, 30000);
    this.countRows();

    // document.getElementById("excel").addEventListener("change", (e) => {
    //     let wb = new Excel.Workbook();
    //     let reader = new FileReader();

    //             let data = new Uint8Array(reader.result)
    //             wb = XLSX.read(data, {type: "array"})
    //             let workSheet = wb.getWorksheet(1);
    //             let row = workSheet.getRow(5)
    //             row.getCell(1).value=5;
    //             row.commit();
    //             return wb.xlsx.writeFile('Book1.xlsx');

    //     });
  }

  dailyReport = async () => {
    let date = this.state.selectedDate;
    let firstArray = [];
    let secondArray = [];
    this.state.allRecords.map((record) => {
      if (record.CutDate == date && record.SewedDate == date) {
        firstArray.push(record);
        secondArray.push(record);
      } else if (record.CutDate == date) {
        firstArray.push(record);
      } else if (record.SewedDate == date) {
        secondArray.push(record);
      }
    });
    console.log(firstArray, secondArray);
    let data = [firstArray, secondArray];
    await Axios.post(`${theUrl}report`, {
      data: data,
    })
      .then((response) => {
        if (response.status === 201) {
          setTimeout(() => {
            Axios.get(`${theUrl}download`).then((response) => {
              window.location.href =
                "data:" + XlsxPopulate.MIME_TYPE + ";base64," + response.data;
            });
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  expReport = () => {
    this.queryIndex(3);
    let array = this.state.exportRecords.map((record) => {
      return record;
    });
    Axios.post(`${theUrl}export`, {
      data: array,
    })
      .then((response) => {
        if (response.status === 201) {
          setTimeout(() => {
            console.log("CALLED");
            Axios.get(`${theUrl}export`).then((response) => {
              window.location.href =
                "data:" + XlsxPopulate.MIME_TYPE + ";base64," + response.data;
            });
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //transfered all methods from table component to make it reusable
  //ADD TO DATABASE
  addToDb = (data) => {
    data.map((_data) => {
      const uniqueId = _data.Bolla;
      firebase
        .firestore()
        .collection("Bolla")
        .doc(uniqueId)
        .set(_data)
        .then(() => {
          console.log("Document successfully written!");
          this.setState({ newRecords: [] });
          window.addEventListener("beforeunload", () => {
            //blank
          });
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    });
    this.setState({ newRecords: [] });
  };
  //Setting new records that will make addToDb call in render()
  newRecords = (records) => {
    this.setState({ newRecords: records });
  };

  updateDb = (newData, oldData) => {
    let obj = {};
    Object.keys(newData).map((_key, _index) => {
      if (newData[_key] !== oldData[_key] && typeof newData[_key] === "string")
        obj[_key] = newData[_key];
    });
    let doc = firebase.firestore().collection("Bolla").doc(oldData.Bolla);
    doc
      .update(obj)
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteFromDb = (id) => {
    firebase
      .firestore()
      .collection("Bolla")
      .doc(id)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
        let data = this.state.data;
        data.map((_el) => {
          if (_el.Bolla === id) {
            data.splice(data.indexOf(_el), 1);
          }
        });
        this.setState({ data });
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  selectDate = (date) => {
    this.setState({ selectedDate: date });
  };
  componentWillUnmount() {
    firebase
      .auth()
      .signOut()
      .then(
        function () {
          // Sign-out successful.
        },
        function (error) {
          // An error happened.
        }
      );
  }

  render() {
    if (this.state.newRecords.length !== 0) {
      this.addToDb(this.state.newRecords);
    }
    return (
      <div className="Season">
        <div className="total">
          <span>Total: {this.state.total}</span>
        </div>
        <div className="report-button">
          <CircularIntegration print={this.dailyReport} />
        </div>
        <div className="export-button">
          <CircularIntegration print={this.expReport} />
        </div>
        <Navbar />
        <MaterialTableDemo
          tableColumns={this.state.tableColumns}
          records={this.state.records}
          newObject={this.state.newObject}
          newRecords={this.state.newRecords}
          setNewRecords={this.newRecords}
          updateDb={this.updateDb}
          deleteFromDb={this.deleteFromDb}
          selectDate={this.selectDate}
          countRows={this.countRows}
        />
        <QueryTab queryIndex={this.queryIndex} />
        {/* {this.state.data} */}
        {/* <input  type="file" id="excel" />
                <div id="wrapper"></div>  */}
      </div>
    );
  }
}

export default Season;
