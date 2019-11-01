import React, { useState } from 'react'
import Navbar from './navbar'
import DatePicker from './DatePicker'
import firebase from 'firebase'
import date from 'date-and-time'


const Stat = (props) => {
    const [total, setTotal] = useState(null)
    setTimeout(( ) => {
        setTotal(props.fetchData(props.data, props.date, props.name))
    }, 1000)
    return (
        <div className="stat">
        {props.name}
        <br />
        {total + "€"}
        </div>
    )
}

const groupBy = key => array =>
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
            arts: [],
            selectedDate: "",
            stats: []
        }
        this.fetchData = this.fetchData.bind(this)
        this.selectDate = this.selectDate.bind(this)
    }

    fetchData = (data, date, state) => {
        let array = [];
        data.map((record) => {
            if(record.SewedDate === date ) {
                array.push(record)
            }
        })    
        let groupByName = groupBy("Art");
        const grouped = groupByName(array)
        let total = 0;
        Object.keys(grouped).map((_key, _index) => {
            let art = grouped[_key][0].Art;
            let quantity = 0;
            grouped[_key].map((obj) => {
                quantity += parseInt(obj.Quantity);
            })
            let price;
            this.state.arts.map((_art) => {
                if(_art.Name === art) {
                    price = parseFloat(_art.Price)
                }
            })
            let add = ((price*quantity)*0.98).toFixed(2);
            total = (parseFloat(total) + parseFloat(add)).toFixed(2)
        })
        return total
    }

    componentDidMount() {
        let days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        let now = new Date();
        const selectedDate = date.format(now, "DD.MM.YYYY")
        this.setState({selectedDate})
        let d = new Date();
        d.setDate(d.getDate() -1)
        const yesterday = date.format(d, "DD.MM.YYYY")
        let g = new Date();
        g.setDate(d.getDate() -2)
        const dayBeforeYesterday = date.format(g, "DD.MM.YYYY")
        firebase
        .firestore()
        .collection("Bolla")  
        .onSnapshot(serverUpdate => {
            const data = serverUpdate.docs.map(_docs => {
                const d = _docs.data();
                return d;
            })
            this.setState({records: data}, () => {
                let notSunday = "";
                let dayBefore = "";
                if(days[d.getDay() -1] === "Sunday") {
                    notSunday = days[d.getDay() - 2]
                    dayBefore = days[d.getDay() - 3]
                } else if(days[d.getDay() -2] === "Sunday") {
                    notSunday = days[d.getDay() -1]
                    dayBefore = days[d.getDay() - 3]
                }
                else {
                    notSunday = days[d.getDay() -1]
                    dayBefore = days[d.getDay() -2]
                }
                let array = [
                    <Stat name="Today"  data={this.state.records} date={this.state.selectedDate} fetchData={this.fetchData}/>,
                    <Stat name={notSunday}  data={this.state.records} date={yesterday} fetchData={this.fetchData}/>,
                    <Stat name={dayBefore}  data={this.state.records} date={dayBeforeYesterday} fetchData={this.fetchData}/>
                ]
                this.setState({stats: array})
            })
        })

        firebase
            .firestore()
            .collection("Art")
            .onSnapshot(serverUpdate => {
                let array = [];
                const data = serverUpdate.docs.map(_docs => {
                    const d = _docs.data();
                    array[d.Name] = d.Price
                    return d;
                })
                this.setState({arts: data})
            })
    }

    selectDate = (date) => {
        this.setState({selectedDate: date})
        this.fetchData(date)
    }

    render() {
        let now = new Date();
        return(
            <div className="analytics">
                <Navbar />
                <DatePicker
                    date={now}
                    selectDate={this.selectDate}/>
                <div className="stats">
                    {this.state.stats}
                </div>
                <div className="balance"></div>
            </div>
        )
    }
}


export default Analytics;