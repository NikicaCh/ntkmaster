import React, { useState } from "react";
import Navbar from "./navbar";
import DatePicker from "./DatePicker";
import { app } from "../firebase.tsx";
import date from "date-and-time";
import CheckboxList from "./ExportList";

const Stat = (props) => {
  const [total, setTotal] = useState(null);
  setTimeout(() => {
    setTotal(props.fetchData(props.data, props.date, props.name));
  }, 1000);
  return (
    <div className="stat">
      {props.name}
      <br />
      <span className="stat-date">{props.date}</span>
      <br />
      {total + "€"}
    </div>
  );
};

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

class Analytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      records: [],
      thisWeek: [],
      arts: [],
      selectedDate: "",
      stats: [],
      exported: [],
      total: 0,
    };
    this.exported = this.exported.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.selectDate = this.selectDate.bind(this);
    this.total = this.total.bind(this);
  }

  total = (value) => {
    this.setState({ total: value });
  };

  exported = (data) => {
    let exported = [];

    data.map((record) => {
      if (record.Cut && record.Sewed && record.Export) {
        exported.push(record);
      }
    });
    this.setState({ exported }, () => {
      let groupByDate = groupBy("ExportDate");
      const grouped = groupByDate(this.state.exported);
      Object.keys(grouped).map((_exp, _key) => {});
      this.setState({ exported: grouped });
    });
  };

  fetchData = (data, date, state) => {
    let array = [];
    data.map((record) => {
      if (record.SewedDate === date) {
        array.push(record);
      } else if (date === true) {
        array.push(record);
      }
    });
    let groupByName = groupBy("Art");
    const grouped = groupByName(array);
    let total = 0;
    Object.keys(grouped).map((_key, _index) => {
      let art = grouped[_key][0].Art;
      let quantity = 0;
      grouped[_key].map((obj) => {
        quantity += parseInt(obj.Quantity);
      });
      let price;
      this.state.arts.map((_art) => {
        if (_art.Name === art) {
          price = parseFloat(_art.Price);
        }
      });
      let add = (price * quantity * 0.98).toFixed(2);
      total = (parseFloat(total) + parseFloat(add)).toFixed(2);
    });
    return total;
  };

  componentDidMount() {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    app
      .firestore()
      .collection("Bolla")
      .onSnapshot((serverUpdate) => {
        let array = [];
        let thisWeek = [];
        const data = serverUpdate.docs.map((_docs) => {
          const d = _docs.data();
          if (d.Cut && d.Sewed && d.Export !== true) {
            thisWeek.push(d);
            array.push(d);
          } else if (d.Sewed) {
            array.push(d);
          }
        });
        this.setState({ records: array, thisWeek }, () => {
          //Refactor goes here
          this.exported(this.state.records);
          let dates = [];

          for (let i = 0; i <= 5; i++) {
            let now = new Date(new Date().setDate(new Date().getDate() - i));
            now = date.format(now, "DD.MM.YYYY");
            dates[i + 1] = {
              name: days[
                new Date(new Date().setDate(new Date().getDate() - i)).getDay()
              ],
              date: now,
            };
          }
          let arrayOfStats = [];

          dates.map((date) => {
            if (date.name !== "Sunday") {
              arrayOfStats.push(
                <Stat
                  name={date.name}
                  data={this.state.records}
                  date={date.date}
                  fetchData={this.fetchData}
                />
              );
            }
          });

          this.setState({ stats: arrayOfStats });
        });
      });
    //test

    app
      .firestore()
      .collection("Art")
      .onSnapshot((serverUpdate) => {
        let array = [];
        const data = serverUpdate.docs.map((_docs) => {
          const d = _docs.data();
          array[d.Name] = d.Price;
          return d;
        });
        this.setState({ arts: data });
      });
  }

  selectDate = (date) => {
    this.setState({ selectedDate: date });
    this.fetchData(date);
  };

  render() {
    let now = new Date();
    return (
      <div className="analytics">
        <Navbar />
        <DatePicker date={now} selectDate={this.selectDate} />
        <div className="stats">{this.state.stats}</div>
        <div className="balance">
          <div className="stat-total">
            {"TOTAL"}
            <br />
            {this.state.total + "€"}
          </div>
        </div>
        <div className="exports">
          <CheckboxList
            data={this.state.exported}
            arts={this.state.arts}
            total={this.total}
            totalValue={this.state.total}
          />
        </div>
      </div>
    );
  }
}

export default Analytics;
