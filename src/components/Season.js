import React from 'react'
import firebase from 'firebase'


//Components
import Navbar from './navbar'
import MaterialTableDemo from './Table'


class Season extends React.Component {
    constructor() {
        super();
    
        this.state = {
          records: null,
          tableColumns: [
            {title: "Import Number", field: "ImportNo."},
            {title: "Bolla", field: "Bolla"},
            {title: "Article", field: "Art"},
            {title: "Quantity", field: "Quantity"},
            {title: "Import Date", field: "ImpDate"},
            {title: "Cut", field: "Cut"},
            {title: "Cut Date", field: "CutDate"},
            {title: "Sewed", field: "Sewed"},
            {title: "Sewed Date", field: "SewedDate"},
            {title: "Quality Control", field: "QualityControl"},
            {title: "Control Date", field: "ControlDate"},
            {title: "Export", field: "Export"},
            {title: "Export Date", field: "ExportDate"}
          ]
        }
    }

    componentDidMount() {    
        firebase
        .firestore()
        .collection("Bolla")  
        .onSnapshot(serverUpdate => {
            const data = serverUpdate.docs.map(_docs => {
                const d = _docs.data();
                return d;
            })
            this.setState({records:data})
        })
        // let state = [];
        // firebase
        // .firestore()
        // .collection("articles")
        // .onSnapshot(serverUpdate => {
        //     state = [];
        //     const data = serverUpdate.docs.map(_docs => {
        //     const d = _docs.data();
        //     return d;
        //     })
        //     data.map(_data => {
        //     const el = 
        //         <div>
        //         <h3>{_data.id}</h3>
        //         <h3>{_data.name}</h3>
        //         <h3>{_data.quantity}</h3>
        //         </div>
            
        //     state.push(el)
        //     })
        //     this.setState({data: state})
        //     console.log(data)
        // })
    }

    render() {
        return( 
            <div className="Season">
                <Navbar />
                <MaterialTableDemo tableColumns={this.state.tableColumns} records={this.state.records}/>
                {/* {this.state.data} */}
            </div>
        )
    }
}



export default Season;