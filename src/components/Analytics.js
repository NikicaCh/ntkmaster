import React from 'react'
import Navbar from './navbar'
import DatePicker from './DatePicker'
import firebase from 'firebase'
import date from 'date-and-time'


const Stat = (props) => {
    return (
        <div className="stat">
        {props.name}
        {props.stat}
        </div>
    )
}

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

    fetchData = (date) => {
        let array = [];
        this.state.records.map((record) => {
            if(record.SewedDate === date ) {
                array.push(record)
            }
        })
        console.log(array)
    }

    componentDidMount() {
        let now = new Date();
        const selectedDate = date.format(now, "DD.MM.YYYY")
        firebase
        .firestore()
        .collection("Bolla")  
        .onSnapshot(serverUpdate => {
            const data = serverUpdate.docs.map(_docs => {
                const d = _docs.data();
                console.log(d)
                return d;
            })
            this.setState({records: data}, () => {
                this.fetchData(selectedDate)
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
                <div className="stats"><Stat name="HELLO" stat={50} /></div>
                <div className="balance"></div>
            </div>
        )
    }
}


export default Analytics;