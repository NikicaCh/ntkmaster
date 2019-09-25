import React from 'react'
import Navbar from './navbar'
import DatePicker from './DatePicker'
import firebase from 'firebase'
import date from 'date-and-time'



class Analytics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selectedDate: ""
        }
        this.fetchData = this.fetchData.bind(this)
        this.selectDate = this.selectDate.bind(this)
    }

    fetchData = (today) => {
        let array = [];
        this.state.data.map((record) => {
            if(record.SewedDate === today ) {
                array.push(record)
                console.log("added")
            }
        })
        console.log("Array",array)
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
                return d;
            })
            this.setState({data: data}, () => {
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
                <div className="stats"></div>
                <div className="balance"></div>
            </div>
        )
    }
}


export default Analytics;