import React from 'react'
import firebase from 'firebase'


//Components
import Navbar from './navbar'
import MaterialTableDemo from './Table'


class Articles extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableColumns: [
                {title: "Name", field: "Name"},
                {title: "Price (€)", field: "Price"},
                {title: "Image", field: "Image"}
            ],
            records: [],
            newObject: {
                Name: "",
                Price: 0
            },
            records: [],
            newRecords: []
        }
        this.add = this.add.bind(this)
        this.delete = this.delete.bind(this)
        this.update = this.update.bind(this)
        this.newRecords = this.newRecords.bind(this)
    }
    componentDidMount() {
        firebase
        .firestore()
        .collection("Art")  
        .onSnapshot(serverUpdate => {
            const data = serverUpdate.docs.map(_docs => {
                const d = _docs.data();
                return d;
            })
            this.setState({records: data})
        })
    }

    newRecords = (records) => {
        this.setState({newRecords: records})
    }

    add = (data) => {
        data.map((_data) => {
            const uniqueId = _data.Name;
            firebase.firestore().collection("Art").doc(uniqueId).set(_data)
            .then(() => {
                console.log("Document successfully written!");
                this.setState({newRecords: []})
                window.addEventListener("beforeunload", () => {
                    //blank
                })
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
            this.setState({newRecords: []})
        })
    }

    delete = (id) => {
        firebase.firestore().collection("Art").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
          }).catch(function(error) {
            console.error("Error removing document: ", error);
          });
    }

    update = (newData, oldData) => {
        let obj = {}
        Object.keys(newData).map((_key, _index) => {
          if(newData[_key] !== oldData[_key] && typeof newData[_key] === "string") obj[_key] = newData[_key]
        })
        let doc = firebase.firestore().collection("Art").doc(oldData.Name);
        doc.update(obj)
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((err) => {
          console.log(err)
        })
    }

    render() {
        if(this.state.newRecords.length !== 0) {
            this.add(this.state.newRecords)
        }
        return (
            <div className="articles">
                <Navbar />
                <MaterialTableDemo 
                    tableColumns={this.state.tableColumns}
                    records={this.state.records}
                    newObject={this.state.newObject}
                    setNewRecords={this.add}
                    updateDb={this.update}
                    deleteFromDb={this.delete}
                    newRecords={this.state.newRecords}
                    />
            </div>
        )
    }

}

export default Articles;