import React, { useState } from 'react'
import Navbar from './navbar'
import DatePicker from './DatePicker'
import firebase from 'firebase'
import date from 'date-and-time'


const Stat = (props) => {

    const [total, setTotal] = useState(0)
    let data = props.fetchData(props.data, props.date)
    setTimeout(() => {
        setTotal(data)
    }, 7000)
    return (
        <div className="stat">
        {props.name}
        <br />
        {total}
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
            selectedDate: ""
        }
        this.fetchData = this.fetchData.bind(this)
        this.selectDate = this.selectDate.bind(this)
    }

    fetchData = (data, date) => {
        let array = [];
        data.map((record) => {
            if(record.SewedDate === date ) {
                array.push(record)
            }
        })
        console.log("ARRAY", array)
    
        let groupByName = groupBy("Art");
        const grouped = groupByName(array)
        let total = 0;
        Object.keys(grouped).map((_key, _index) => {
            let art = grouped[_key][0].Art;
            let quantity = 0;
            grouped[_key].map((obj) => {
                quantity += obj.Quantity;
            })
            let price = 0;
            firebase
            .firestore()
            .collection("Art")
            .doc(art).get()
            .then(function(doc) {
                if (doc.exists) {
                    price = doc.data().Price;
                    let add = parseFloat(price)*quantity;
                    total += add;
                    console.log("TOTAL:",total)
                    console.log("Document data:", doc.data().Price);
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            return total
        })
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
        this.setState({selectedDate})

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
                <div className="stats"><Stat name="TODAY" data={this.state.records} date={this.state.selectedDate} fetchData={this.fetchData}/></div>
                <div className="balance"></div>
            </div>
        )
    }
}


export default Analytics;