import React, { useState } from 'react'
import Navbar from './navbar'
import DatePicker from './DatePicker'
import firebase from 'firebase'
import date from 'date-and-time'


const Stat = (props) => {
    const [total, setTotal] = useState(0)
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
            console.log("ADD",add)
            // this.setState({today: this.state.today + add}, () => {
            //     console.log("STATE")
            // })
            total = (parseFloat(total) + parseFloat(add)).toFixed(2)
        })
        return total
    }

    componentDidMount() {
        let now = new Date();
        const selectedDate = date.format(now, "DD.MM.YYYY")
        this.setState({selectedDate})
        firebase
        .firestore()
        .collection("Bolla")  
        .onSnapshot(serverUpdate => {
            const data = serverUpdate.docs.map(_docs => {
                const d = _docs.data();
                return d;
            })
            this.setState({records: data}, () => {
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
                    console.log("ARRAY", array)
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
                    <Stat name="TODAY"  data={this.state.records} date={this.state.selectedDate} fetchData={this.fetchData}/>
                    <Stat name="TODAY"  data={this.state.records} date={this.state.selectedDate} fetchData={this.fetchData}/>
                </div>
                <div className="balance"></div>
            </div>
        )
    }
}


export default Analytics;